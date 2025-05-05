import { Avatar, Box, Text } from "@chakra-ui/react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      w="100%"
      display="flex" 
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
      aria-label={`Select user ${user?.name || "Unknown User"}`}
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user?.name || "Unknown User"} // Added fallback for name
        src={user?.pic || ""} // Added fallback for pic
      />
      <Box>
        <Text>{user?.name || "Unknown User"}</Text> {/* Added fallback for name */}
        <Text fontSize="xs">
          <b>Email: </b>
          {user?.email || "No Email Provided"} {/* Added fallback for email */}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;