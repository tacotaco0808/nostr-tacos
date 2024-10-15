import { generateSecretKey } from "nostr-tools";
import { useRef, useState } from "react";
const RegisterForm = () => {
  const inputUserName = useRef<HTMLInputElement | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sK, setSK] = useState<Uint8Array | null>(null);
  const generateNewSK = () => {
    const newSK = generateSecretKey();
    setSK(newSK);
    return newSK;
  };

  const createUserHandle = () => {
    if (inputUserName.current && inputUserName.current.value) {
      setUserName(inputUserName.current.value);
      setError(null);
      const secretKey = generateNewSK();
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
