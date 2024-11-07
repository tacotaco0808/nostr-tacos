import { finalizeEvent, generateSecretKey, Relay } from "nostr-tools";
import { useEffect, useRef, useState } from "react";
import styles from "./RegisterForm.module.scss";
const RegisterForm = () => {
  const inputUserName = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sK, setSK] = useState<Uint8Array | null>(null);
  const relayRef = useRef<Relay | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const generateNewSK = () => {
    const newSK = generateSecretKey();
    setSK(newSK);
    return newSK;
  };
  const initializeRelay = async () => {
    try {
      const relay = await Relay.connect("ws://172.16.1.73");
      relayRef.current = relay;
      console.log(`connected to ${relay.url}`);
      setIsConnected(true);
    } catch (error) {
      console.error("Error connecting to relay:", error);
    }
  };
  const sendUserDataToRelay = async (
    secreteKey: Uint8Array | null,
    userName: string
  ) => {
    if (secreteKey) {
      // ユーザーデータ
      const event = finalizeEvent(
        {
          kind: 0,
          created_at: Math.floor(Date.now() / 1000),
          tags: [],
          content: `{"name":"${userName}","display_name":"${userName}","picture":"https://bananas"}`,
        },
        secreteKey
      );
      await relayRef.current?.publish(event);
    } else {
      console.error("Error sending data to relay:");
      return;
    }
  };
  const createUserHandle = async () => {
    if (inputUserName.current && inputUserName.current.value) {
      setError(null);
      const currentUserName = inputUserName.current.value;
      const secretKey = generateNewSK();
      await sendUserDataToRelay(secretKey, currentUserName);
      inputUserName.current.value = "";
    } else {
      setError("名前を入力してください");
    }
  };
  useEffect(() => {
    initializeRelay();
    return () => {
      //コンポーネントアンマウント時接続を切る
      if (relayRef.current) {
        relayRef.current.close();
      }
    };
  }, []);
  return (
    <>
      <h3>新しくユーザーを作成</h3>
      <div>
        <label htmlFor="user-name">Name</label>
        <input
          id="user-name"
          type="text"
          placeholder="tacochan"
          ref={inputUserName}
        />
      </div>
      <div>{error ? <div style={{ color: "red" }}>{error}</div> : ""}</div>
      <button disabled={!isConnected} onClick={createUserHandle}>
        Register
      </button>
    </>
  );
};
export default RegisterForm;
