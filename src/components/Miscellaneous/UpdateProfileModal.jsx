import { ViewIcon } from '@chakra-ui/icons';
import {
    Button,
    FormControl,
    IconButton,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    useToast
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react';
import { ChatState } from '../../context/ChatProvider';

const UpdateProfileModal = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pic, setPic] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, setUser } = ChatState();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleUpdate = async () => {
    if (!name && !email && !pic) {
      toast({
        title: 'Please fill at least one field',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top',
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
        '/api/user/profile',
        {
          name: name || undefined,
          email: email || undefined,
          pic: pic || undefined,
        },
        config
      );

      setUser(data);
      setLoading(false);
      toast({
        title: 'Profile Updated Successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      onClose();
    } catch (error) {
      setLoading(false);
      toast({
        title: 'Error Updating Profile',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  return (
    <>
      <IconButton
        display={{ base: 'flex' }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <Input
                placeholder="Enter New Name"
                mb={3}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Enter New Email"
                mb={3}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Enter New Profile Picture URL"
                mb={3}
                value={pic}
                onChange={(e) => setPic(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              colorScheme="green"
              onClick={handleUpdate}
              isLoading={loading}
            >
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateProfileModal; 