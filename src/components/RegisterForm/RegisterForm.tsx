import { finalizeEvent, generateSecretKey, SimplePool } from "nostr-tools";
import { useRef, useState } from "react";
import styles from "./RegisterForm.module.scss";
type UserData = {
  name: string;
  connectingRelays: string[];
  secKey: Uint8Array;
};
const RegisterForm = () => {
  const inputUserName = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sK, setSK] = useState<Uint8Array | null>(null);
  const relayURLs = ["ws://172.16.1.73"];
  const generateNewSK = () => {
    const newSK = generateSecretKey();
    setSK(newSK);
    return newSK;
  };
  const pool = new SimplePool();
  const saveToLocalStorage = (key: string, data: any) => {
    /*ローカルストレージへデータを保存 */
    if (data.secKey instanceof Uint8Array) {
      data.secKey = Array.from(data.secKey); // Uint8Arrayを配列化
    }
    localStorage.setItem(key, JSON.stringify(data));
  };
  const uint8ArrayToBase64 = (array: Uint8Array): string => {
    return btoa(String.fromCharCode(...array));
  };
  const sendUserDataToRelay = async (
    secreteKey: Uint8Array | null,
    userName: string,
    relays: string[]
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
      const signedEvent = finalizeEvent(event, secreteKey);
      await pool.publish(relays, signedEvent);
    } else {
      console.error("Error sending data to relay:");
      return;
    }
  };
  const createUserHandle = async () => {
    if (inputUserName.current && inputUserName.current.value) {
      const currentUserName = inputUserName.current.value;
      const secretKey = generateNewSK();
      const newUserData: UserData = {
        name: currentUserName,
        connectingRelays: [],
        secKey: secretKey,
      };
      setError(null);
      const encoded = uint8ArrayToBase64(secretKey);
      saveToLocalStorage(encoded, newUserData);

      await sendUserDataToRelay(secretKey, currentUserName, relayURLs);
      inputUserName.current.value = "";
    } else {
      setError("名前を入力してください");
    }
  };

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
