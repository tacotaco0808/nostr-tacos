import { finalizeEvent, generateSecretKey, Relay } from "nostr-tools";
import { useEffect, useRef, useState } from "react";
const RegisterForm = () => {
  const inputUserName = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sK, setSK] = useState<Uint8Array | null>(null);
  const relayRef = useRef<Relay | null>(null);
  const generateNewSK = () => {
    const newSK = generateSecretKey();
    setSK(newSK);
    return newSK;
  };
  const initializeRelay = async () => {
    try {
      const relay = await Relay.connect("wss://relay-jp.nostr.wirednet.jp");
      relayRef.current = relay;
      console.log(`connected to ${relay.url}`);
    } catch (error) {
      console.error("Error connecting to relay:", error);
    }
  };
  const sendUserDataToRelay = async (secreteKey: Uint8Array | null) => {
    if (secreteKey) {
      // ユーザーデータ
      const event = finalizeEvent(
        {
          kind: 0,
          created_at: Math.floor(Date.now() / 1000),
          tags: [],
          content: `{"name":"${inputUserName.current?.value}","display_name":"${inputUserName.current?.value}","picture":"https://bananas"}`,
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
      const secretKey = generateNewSK();
      await sendUserDataToRelay(secretKey);
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
      <button onClick={createUserHandle}>Register</button>
    </>
  );
};
export default RegisterForm;
