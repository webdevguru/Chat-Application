import { Avatar, Tooltip } from '@chakra-ui/react';
import React from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import { isLastMessage, isSameSender, isSameUser } from '../config/Chatlogics';
import { ChatState } from '../context/ChatProvider';

const ScrollableChat = ({ messages }) => {
  const {user} = ChatState();
  return (
    <ScrollableFeed>
      {messages && messages.map((m,i) => (
        <div style={{
          display: "flex",
          justifyContent: m.sender._id === user._id ? "flex-end" : "flex-start"
        }} key={m._id}>
          {(isSameSender(messages,m,i,user._id) || isLastMessage(messages,i,user._id)) && (
            <Tooltip label={m.sender.name} placement='bottom-start' hasArrow>
              <Avatar
                mt={1}
                mr={2}
                size='sm'
                cursor='pointer'
                name={m.sender.name}
                src={m.sender.pic}
              />
            </Tooltip>
          )}
          <span style={{
            backgroundColor: m.sender._id === user._id ? "#00A884" : "#202C33",
            borderRadius: "20px",
            padding: "5px 15px",
            maxWidth: "75%",
            marginLeft: m.sender._id === user._id ? "auto" : "0",
            marginRight: m.sender._id === user._id ? "0" : "auto",
            marginTop: isSameUser(messages,m,i,user._id) ? 3 : 10,
            whiteSpace: "normal",
            wordBreak: "break-word",
            fontSize: "14px",
            color: "white",
          }}>
            {m.content}
          </span>
        </div>
      ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;