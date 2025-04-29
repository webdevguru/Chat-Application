import React, { useState } from 'react';
import { ChatState } from '../context/ChatProvider';

import { Box } from '@chakra-ui/react'; // Chakra UI er Box import korte hobe
import Chatbox from '../components/Chatbox';
import SideDrawer from '../components/Miscellaneous/SideDrawer';
import Mychats from '../components/Mychats';

const ChatPage = () => {  // Ei function declaration missing chhilo
  const { user } = ChatState(); // useContext call
  const[Fetchagain,SetFetchagain]=useState(false);

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box display= "flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <Mychats Fetchagain={Fetchagain} />}
        {user && <Chatbox Fetchagain={Fetchagain} SetFetchagain={SetFetchagain}/>}
      </Box>
    </div>
  );
};

export default ChatPage;





