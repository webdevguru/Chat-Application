



import { AddIcon } from '@chakra-ui/icons';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { getSender } from '../config/Chatlogics';
import { ChatState } from '../context/ChatProvider';
import Chatloading from './Chatloading';
import GroupchatModal from './Miscellaneous/GroupchatModal';
const Mychats = ({ Fetchagain }) => {
  const [loggedUser, setloggeduser] = useState();
  const { selectedChat, setselectedChat, chats, setChats, user } = ChatState();
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      console.log(data);
      setChats(data);

    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setloggeduser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [Fetchagain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work Sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My chats
        <GroupchatModal>

          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupchatModal>
      </Box>

      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflow="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setselectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
                mb={2}
                boxShadow={selectedChat === chat ? "md" : "sm"} // Optional: subtle shadow
                border={selectedChat === chat ? "2px solid #319795" : "1px solid #E2E8F0"} // Optional: border
              >
                <Text>
                  {!chat.isGroupChat ? (
                    getSender(loggedUser, chat.users)
                  ) : (
                    chat.chatname
                  )}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <Chatloading />
        )}
      </Box>
    </Box>
  );
};

export default Mychats;





