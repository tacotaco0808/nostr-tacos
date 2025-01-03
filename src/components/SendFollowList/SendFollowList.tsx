import { useEffect, useState } from "react";
import { finalizeEvent, SimplePool } from "nostr-tools";
type sendPostProps = {
  relays: string[];
};
type UserData = {
  name: string;
  connectingRelays: string[];
  secKey: Uint8Array;
};
export const SendFollowList: React.FC<sendPostProps> = ({ relays }) => {
  const pool = new SimplePool();
  const [loginAccountData, setLoginAccountData] = useState<UserData>();
  const [tags, setTags] = useState<string[][]>([]);
  const [tmpTag, setTmpTag] = useState<string>("");
  const handleInputOnChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setTmpTag(event.target.value);
  };
  const [secretKey, setSecretKey] = useState<Uint8Array>();
  const messageToSend = {
    kind: 3,
    content: "",
    created_at: Math.floor(Date.now() / 1000),
    tags: tags,
  };

  const handleButtonOnClick = () => {
    if (secretKey) {
      const signedEvent = finalizeEvent(messageToSend, secretKey);
      const sendMessage = async () => {
        try {
          if (
            loginAccountData &&
            loginAccountData.connectingRelays.length > 0
          ) {
            pool.publish(loginAccountData?.connectingRelays, signedEvent);
          } else {
            console.log(
              "接続先リレーが設定されていませんデフォルトのリレーに接続します。"
            );
            pool.publish(relays, signedEvent);
          }
        } catch (error) {}
      };
      sendMessage();
    }
  };
  const handleAddTag = () => {
    if (tmpTag.trim() !== "") {
      // 入力された文字列を分割して余分な空白を除去
      const tagArray = tmpTag
        .split(",")
        .map((item) => item.trim().replace(/^"|"$/g, "")); // 先頭と末尾の引用符を削除
      if (tagArray.length > 0) {
        setTags([...tags, tagArray]); // 配列形式で追加
      }
      setTmpTag(""); // 入力フィールドをリセット
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
      <p>
        tagsの例: "p", "91cf9..4e5ca", "wss://alicerelay.com/", "alice"
        <br />
        "tags": [ ["p", "91cf9..4e5ca", "wss://alicerelay.com/", "alice"],
        <br /> ["p", "14aeb..8dad4", "wss://bobrelay.com/nostr", "bob"],
        <br /> ["p", "612ae..e610f", "ws://carolrelay.com/ws", "carol"] ],
      </p>
      {loginAccountData ? (
        <>
          <p>現在ログインしているユーザー:{loginAccountData.name}</p>
        </>
      ) : (
        <>
          <p>ログインしていません</p>
        </>
      )}
      <h3>追加されたタグ:</h3>
      <ul>
        {tags.map((tagArray, index) => (
          <li key={index}>{JSON.stringify(tagArray)}</li> // タグをJSON形式で表示
        ))}
      </ul>
      <textarea
        value={tmpTag}
        onChange={handleInputOnChange}
        placeholder="タグを入力してください"
      />
      <button onClick={handleAddTag}>addTag</button>
      <button onClick={handleButtonOnClick}>send</button>
    </>
  );
};
