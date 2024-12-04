import { useEffect, useState } from "react";
import styles from "./SendPost.module.scss";
import { finalizeEvent, SimplePool } from "nostr-tools";
type sendPostProps = {
  relays: string[];
};
type UserData = {
  name: string;
  connectingRelays: string[];
  secKey: Uint8Array;
};
export const SendPost: React.FC<sendPostProps> = ({ relays }) => {
  const pool = new SimplePool();
  const [inputMessage, setInputMessage] = useState<string>("");
  const [loginAccountData, setLoginAccountData] = useState<UserData>();
  const handleInputOnChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setInputMessage(event.target.value);
  };
  const [secretKey, setSecretKey] = useState<Uint8Array>();
  const messageToSend = {
    kind: 1,
    content: inputMessage,
    created_at: Math.floor(Date.now() / 1000),
    tags: [],
  };

  const handleButtonOnClick = () => {
    if (secretKey) {
      const signedEvent = finalizeEvent(messageToSend, secretKey);
      const sendMessage = async () => {
        try {
          pool.publish(relays, signedEvent);
        } catch (error) {}
      };
      sendMessage();
    }
  };
  const getItemsByKeySubstring = (
    substring: string
  ): Record<string, UserData> => {
    const result: Record<string, UserData> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i); //すべて取得
      if (key && key.includes(substring)) {
        //文字列に含まれるなら
        const value = localStorage.getItem(key);
        result[key] = value ? JSON.parse(value) : null; //Json形式ならパース
      }
    }
    return result;
  };
  const parseToUserData = (accountDataJSON: Record<string, UserData>) => {
    Object.entries(accountDataJSON).map(([key, value]) => {
      setLoginAccountData(value);
      if (value.secKey && Array.isArray(value.secKey)) {
        setSecretKey(new Uint8Array(value.secKey));
      } else {
        console.error("Invalid secKey format");
      }
    });
  };

  useEffect(() => {
    const fetchedData = getItemsByKeySubstring("currentUser:");
    parseToUserData(fetchedData);
  }, []);
  return (
    <>
      {loginAccountData ? (
        <>
          <p>現在ログインしているユーザー:{loginAccountData.name}</p>
        </>
      ) : (
        <>
          <p>ログインしていません</p>
        </>
      )}
      <p>{inputMessage}</p>
      <textarea onChange={handleInputOnChange} />
      <button onClick={handleButtonOnClick}>send</button>
    </>
  );
};
