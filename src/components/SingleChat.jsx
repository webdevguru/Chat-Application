import { ArrowBackIcon, ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { io } from 'socket.io-client';
import { getSender, getSenderFull } from "../config/Chatlogics";
import { ChatState } from "../context/ChatProvider";
import '../Styles.css';
import ProfileModal from "./Miscellaneous/ProfileModal";
import UpdateGroupchatModal from "./Miscellaneous/UpdateGroupchatModal";
import ScrollableChat from "./ScrollableChat";

// Using proxy from vite.config.js
const API_URL = "";
const ENDPOINT = "http://localhost:3000";
var socket,selectedChatCompare;

const SingleChat = ({ Fetchagain, SetFetchagain }) => {
  const { user, selectedChat, setselectedChat, notification, setNotification } = ChatState();
  // console.log('selectedChat:', selectedChat);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const[typing, setTyping] = useState(false);
  const[isTyping, setIsTyping] = useState(false);
  const toast = useToast();
  let chatTitle = "";
  if (selectedChat) {
    if (selectedChat.isGroupChat) {
      // Defensive: log and fallback for group chat
      console.log("Group chat object:", selectedChat);
      chatTitle =
        selectedChat.chatname?.toUpperCase() ||
        selectedChat.chatName?.toUpperCase() ||
        "GROUP";
    } else if (selectedChat.users) {
      chatTitle = getSender(user, selectedChat.users)?.toUpperCase() || "CHAT";
    } else {
      chatTitle = "CHAT";
    }
  }

  const handleSendMessage = async (event = {}) => {
    if (newMessage && (!event.type || event.key === 'Enter')) {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post('/api/message', {
          content: newMessage,
          chatId: selectedChat._id,
        }, config);

        console.log("Message sent:", data);
        socket.emit('new message', data);
        setMessages(prevMessages => [...prevMessages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: error.response?.data?.message || "Failed to send message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  

  const typingHandeler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit('typing', selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit('stop typing', selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const fetchMessages = async()=>{
 if (!selectedChat) return;
   try{
     const config = {
       headers: {
        Authorization: `Bearer ${user.token}`,
       },
     };
     setLoading(true);
     const {data} = await axios.get(`/api/message/${selectedChat._id}`,
      config);
      console.log('messages:', data);
      setMessages(data);
      setLoading(false);
      socket.emit('join chat',selectedChat._id);
   }
    catch(error){
      toast({
        title: "Error Occurred!",
        description: "Failed to fetch messages",
        status: "error",
        duration:5000,
        isClosable:true,
        position:"bottom",
      });
      setLoading(false);
    }
  };
  useEffect(() => {
    socket = io(ENDPOINT, {
      transports: ['websocket'],
      withCredentials: true
    });
    
    socket.on('connect', () => {
      console.log("Socket connected");
      setSocketConnected(true);
    });

    socket.on('disconnect', () => {
      console.log("Socket disconnected");
      setSocketConnected(false);
    });

    socket.on('error', (error) => {
      console.error("Socket error:", error);
    });

    socket.emit("setup", user);

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('error');
      socket.off('message recieved');
      socket.disconnect();
    };
  }, [user]);
  useEffect(() => {
    if (selectedChat) {
      fetchMessages();
      selectedChatCompare = selectedChat;
    }
  }, [selectedChat]);

  useEffect(() => {
    const handleNewMessage = (newMessageReceived) => {
      console.log("New message received:", newMessageReceived);
      
      // If chat is not selected or different chat is selected
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        console.log("Adding notification for message:", newMessageReceived);
        
        // Add to notifications if not already present
        if (!notification.some(n => n._id === newMessageReceived._id)) {
          console.log("Setting notification:", [...notification, newMessageReceived]);
          setNotification([...notification, newMessageReceived]);
          SetFetchagain(!Fetchagain);
        }
      } else {
        console.log("Updating messages for current chat");
        setMessages([...messages, newMessageReceived]);
      }
    };

    if (socket) {
      socket.on('message received', handleNewMessage);
    }

    return () => {
      if (socket) {
        socket.off('message received', handleNewMessage);
      }
    };
  }, [selectedChatCompare, notification, messages, SetFetchagain, Fetchagain]);

  useEffect(() => {
    const handleTyping = () => setIsTyping(true);
    const handleStopTyping = () => setIsTyping(false);

    socket.on('typing', handleTyping);
    socket.on('stop typing', handleStopTyping);

    return () => {
      socket.off('typing', handleTyping);
      socket.off('stop typing', handleStopTyping);
    };
  }, []);
  
  // Cleanup socket connection on unmount
  useEffect(() => {
    return () => {
      if (socket) {
        socket.off('message received');
        socket.off('typing');
        socket.off('stop typing');
      }
    };
  }, []);
  
  return (
    <Box display="flex" flexDir="column" h="100%" w="100%">
      {selectedChat ? (
        <>
          {/* Header */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            w="100%"
            pb={3}
            px={4}
            pt={2}
            borderBottom="1px solid #E2E8F0"
            minH="60px"
          >
            <Box display="flex" alignItems="center" gap={2}>
              <IconButton
                display={{ base: "flex", md: "none" }}
                icon={<ArrowBackIcon />}
                onClick={() => {
                  setselectedChat();  // Call without arguments to set undefined
                }}
                size="sm"
                mr={2}
              />
              <Text
                fontSize={{ base: "22px", md: "24px" }}
                fontFamily="Work Sans"
                fontWeight="bold"
                m={0}
                p={0}
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
                maxWidth="250px"
              >
                {chatTitle}
              </Text>
            </Box>
            <Box display="flex" gap={2}>
              {selectedChat.isGroupChat &&
                selectedChat.chatname &&
                selectedChat.users && (
                  <UpdateGroupchatModal
                    fetchAgain={Fetchagain}
                    setFetchAgain={SetFetchagain}
                    fetchMessages={selectedChat}
                  />
                )}
              {!selectedChat.isGroupChat && (
                <ProfileModal user={getSenderFull(user, selectedChat.users)}>
                  <IconButton icon={<ViewIcon />} aria-label="View Profile" />
                </ProfileModal>
              )}
            </Box>
          </Box>

          {/* Chat messages area */}
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={4}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="0 0 8px 8px"
            overflowY="auto"
            flex="1"
          >
            {loading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                h="100%"
                w="100%"
              >
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="xl"
                />
              </Box>
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            {isTyping && (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="flex-start"
                mt={2}
                ml={2}
              >
                <Text fontSize="sm" color="gray.500">
                  {selectedChat.isGroupChat ? "Someone is typing..." : "Typing..."}
                </Text>
              </Box>
            )}
          </Box>

          {/* Message Input Form */}
          <FormControl
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            p={3}
            bg="white"
            borderTop="1px solid #E2E8F0"
          >
            <InputGroup>
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message..."
                value={newMessage}
                onChange={typingHandeler}
                _focus={{
                  bg: "white",
                  border: "1px solid blue",
                }}
              />
              <InputRightElement>
                <IconButton
                  colorScheme="blue"
                  aria-label="Send message"
                  icon={<ViewIcon />}
                  onClick={handleSendMessage}
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
          w="100%"
        >
          <Text fontSize="2xl" color="gray.400">
            Click on a user or group to start chatting!
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default SingleChat;
