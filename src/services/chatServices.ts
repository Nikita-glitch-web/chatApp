import { getMessages, addMessage } from "../store/firebase.config";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchMessages(): Promise<any[]> {
  try {
    const result = await getMessages();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return result.data as any[];
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
}

export async function sendMessage(
  senderId: string,
  receiverId: string,
  text: string
): Promise<void> {
  try {
    await addMessage({ senderId, receiverId, text });
    console.log("Message sent successfully");
  } catch (error) {
    console.error("Error sending message:", error);
  }
}
