import { Box } from "@chakra-ui/react";
import PropTypes from "prop-types";
import React from "react";
import { ChatState } from "../context/ChatProvider";
import SingleChat from "./SingleChat";

const Chatbox = ({ Fetchagain, SetFetchagain }) => {
  const { selectedChat } = ChatState();

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat Fetchagain={Fetchagain} SetFetchagain={SetFetchagain} />
    </Box>
  );
};

// Prop validation
Chatbox.propTypes = {
  Fetchagain: PropTypes.bool.isRequired,
  SetFetchagain: PropTypes.func.isRequired,
};

export default Chatbox;