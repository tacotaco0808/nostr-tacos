import { useState } from "react";
import styles from "./SendPost.module.scss";
import { finalizeEvent, SimplePool } from "nostr-tools";
type sendPostProps = {
  secretKey: Uint8Array;
  relays: string[];
};
export const SendPost: React.FC<sendPostProps> = ({ secretKey, relays }) => {
  const pool = new SimplePool();
  const [inputMessage, setInputMessage] = useState<string>("");
  const handleInputOnChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setInputMessage(event.target.value);
  };
  const messageToSend = {
    kind: 1,
    content: inputMessage,
    created_at: Math.floor(Date.now() / 1000),
    tags: [],
  };
  const signedEvent = finalizeEvent(messageToSend, secretKey);
  const sendMessage = async () => {
    try {
      pool.publish(relays, signedEvent);
    } catch (error) {}
  };
  const handleButtonOnClick = () => {
    sendMessage();
  };
  return (
    <>
      <p>{inputMessage}</p>
      <textarea onChange={handleInputOnChange} />
      <button onClick={handleButtonOnClick}>send</button>
    </>
  );
};
