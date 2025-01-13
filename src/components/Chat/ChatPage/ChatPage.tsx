import { ChatList } from "../ChatList/ChatList";
import { MessageWindow } from "../MessageWindow/MessageWindow";
import { MessageInput } from "../MessageInput/MessageInput";
import { Box } from "@mui/material";

export const ChatPage: React.FC = () => {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <ChatList />
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <MessageWindow />
        <MessageInput />
      </Box>
    </Box>
  );
};
