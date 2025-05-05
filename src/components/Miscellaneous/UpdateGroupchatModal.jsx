import { ViewIcon } from '@chakra-ui/icons';
import { Box, Button, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react';
import { ChatState } from '../../context/ChatProvider';
import UserBadgeItem from '../userAvatar/UserBadgeItem';

const UpdateGroupchatModal = ({ Fetchagain, SetFetchagain,fetchMessages }) => {

  const [groupChatName, setGroupChatName] = useState("");

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { selectedChat, setselectedChat, user, chats, setChats } = ChatState();

  const toast = useToast();
  const handleRemove = async (userToRemove) => {
    if (selectedChat.groupAdmin._id !== user._id && userToRemove._id !== user._id) {
      toast({
        title: "Only group admin can remove someone!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        '/api/chat/groupRemove',
        {
          chatId: selectedChat._id,
          userId: userToRemove._id,
        },
        config
      );
      if (userToRemove._id === user._id) {
        setselectedChat(null);
      } else {
        setselectedChat(data);
        setChats(prevChats =>
          prevChats.map(chat => (chat._id === data._id ? data : chat))
        );
      }
      fetchMessages();
      setLoading(false);
      Fetchagain && Fetchagain();
      toast({
        title: 'User removed from group.',
        status: 'info',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    } catch (error) {
      setLoading(false);
      toast({
        title: 'Error removing user',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        '/api/chat/rename',
        {
          chatId: selectedChat._id,
          chatname: groupChatName,
        },
        config
      );
      setselectedChat(data);
      setChats(prevChats =>
        prevChats.map(chat => (chat._id === data._id ? data : chat))
      );
      Fetchagain && Fetchagain();
      setRenameLoading(false);
      toast({
        title: 'Group name updated!',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Error updating group name',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      setRenameLoading(false);
    }
  };

  const handleLeaveGroup = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.put(
        '/api/chat/groupRemove',
        {
          chatId: selectedChat._id,
          userId: user._id,
        },
        config
      );
      setLoading(false);
      setselectedChat(null);
      toast({
        title: 'You have left the group.',
        status: 'info',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      onClose();
      Fetchagain && Fetchagain();
    } catch (error) {
      setLoading(false);
      toast({
        title: 'Error leaving group',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  const handleAddUser = async (u) => {
    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.put(
        '/api/chat/groupadd',
        {
          chatId: selectedChat._id,
          userId: u._id,
        },
        config
      );
      setselectedChat(data);
      setChats(prevChats =>
        prevChats.map(chat => (chat._id === data._id ? data : chat))
      );
      setSearch(""); // Clear search input
      setSearchResult([]); // Clear search results
      Fetchagain && Fetchagain();
      toast({
        title: 'User added to group.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    } catch (error) {
      toast({
        title: 'Error adding user',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    }
    setLoading(false);
  };

  return (
    <div>
        
        <IconButton  display={ {base: "flex"}} icon ={<ViewIcon/>}onClick={onOpen} />

<Modal
  key={selectedChat._id + selectedChat.users.length}
  isOpen={isOpen}
  onClose={onClose}
>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>{selectedChat.chatname}</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
      <Box mb={3} display="flex" gap={2}>
        <input
          placeholder="New Group Name"
          value={groupChatName}
          onChange={e => setGroupChatName(e.target.value)}
          style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <Button
          colorScheme="teal"
          onClick={handleRename}
          isLoading={renameLoading}
          disabled={!groupChatName}
        >
          Update
        </Button>
      </Box>
      <Box mb={3} display="flex" gap={2}>
        <input
          placeholder="Add user by name or email"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <Button
          colorScheme="blue"
          onClick={async () => {
            if (!search) return;
            setLoading(true);
            try {
              const config = {
                headers: { Authorization: `Bearer ${user.token}` },
              };
              const { data } = await axios.get(`/api/user?search=${search}`, config);
              setSearchResult(data);
            } catch (error) {
              toast({
                title: "Error searching users",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top",
              });
            }
            setLoading(false);
          }}
          isLoading={loading}
        >
          Search
        </Button>
      </Box>
      <Box>
        {selectedChat.users.map(u => (
          <UserBadgeItem
            key={u._id}
            user={u}
            handleFunction={() => handleRemove(u)}
            showClose={user._id === u._id || selectedChat.groupAdmin._id === user._id}
            isAdd={false}
          />
        ))}
      </Box>
      {searchResult
        .filter(u => !selectedChat.users.some(member => member._id === u._id))
        .map(u => (
          <Box key={u._id} display="flex" alignItems="center" mb={2} gap={2}>
            <UserBadgeItem
              user={u}
              showClose={false}
              isAdd={false}
            />
            <Button
              size="xs"
              colorScheme="green"
              onClick={() => handleAddUser(u)}
            >
              Add
            </Button>
          </Box>
        ))}
    </ModalBody>

    <ModalFooter>
      <Button colorScheme='blue' mr={3} onClick={onClose}>
        Close
      </Button>
      <Button colorScheme="red" onClick={handleLeaveGroup} isLoading={loading}>
        Leave Group
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>


    </div>
  )
}

export default UpdateGroupchatModal