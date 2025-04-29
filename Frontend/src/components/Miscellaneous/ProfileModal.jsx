import { ViewIcon } from '@chakra-ui/icons';
import {
    Button,
    IconButton,
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure
} from '@chakra-ui/react';
import React from 'react';

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<ViewIcon />} // ✅ Correct JSX
          onClick={onOpen}
        />
      )}
      
      <Modal  size="lg"  isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">{user?.name || "User Profile"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
           
            display='flex'
            flexDir='column'
            alignItems='center'
            justifyContent='space-between'
            >
            <Image
             borderRadius='full'
             boxSize='150px'
                src={user?.pic}
                alt={user?.name}
                objectFit='cover'
                fallbackSrc='https://via.placeholder.com/150'
                mb={4}
            
            />
            {/* ✅ Removed invalid <Lorem /> */}
            <p>Email: {user?.email}</p>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
