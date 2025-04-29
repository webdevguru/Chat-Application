


import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import ChatProvider from "./context/ChatProvider"; // ✅ You missed this!

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
  <ChatProvider>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </ChatProvider>
</BrowserRouter>

);
