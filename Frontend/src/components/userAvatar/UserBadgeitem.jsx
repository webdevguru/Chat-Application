import { CloseIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";
import React from "react";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      bg="purple.500" 
      fontSize={12}
      color="white" 
      cursor="pointer"
      display="flex"
      alignItems="center"
    >
      {user.name}
      <CloseIcon
        ml={2} 
        boxSize={3} 
        onClick={e => {
          e.stopPropagation();
          handleFunction();
        }}
        aria-label="Remove user" 
      />
    </Box>
  );
};

export default UserBadgeItem;