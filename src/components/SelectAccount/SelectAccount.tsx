import { Button, Card, CardContent, TextField } from "@mui/material";
import { useEffect, useState } from "react";

type UserData = {
  name: string;
  connectingRelays: string[];
  secKey: Uint8Array;
};
export const SelectAccount = () => {
  const [accountDataJSON, setAccountDataJSON] =
    useState<Record<string, UserData>>(); //ローカルストレージから引っ張ってきた生のデータ
  const [selectedAccountData, setSelectedAccountData] = useState<UserData>();
  const saveToLocalStorage = (data: any) => {
    /*ローカルストレージへデータを保存 */
    if (data.secKey instanceof Uint8Array) {
      data.secKey = Array.from(data.secKey); // Uint8Arrayを配列化
    }
    localStorage.setItem(`currentUser:`, JSON.stringify(data));
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
  const selectedHandle = (userData: UserData) => {
    saveToLocalStorage(userData);
    setSelectedAccountData(userData);
  };
  useEffect(() => {
    const fetchedData = getItemsByKeySubstring("user:");
    setAccountDataJSON(fetchedData); //読み取ったアカウントデータを配列で管理
  }, []);
  return (
    <>
      <h1>ユーザー選択</h1>
      {accountDataJSON ? (
        <>
          <ul>
            {Object.entries(accountDataJSON).map(([key, value]) => {
              return (
                <li key={key}>
                  <Card variant="outlined" style={{ margin: "10px" }}>
                    <CardContent>
                      <h3>名前:{value.name}</h3>
                      <p>{value.secKey}</p>
                      {value.connectingRelays &&
                      value.connectingRelays.length > 0 ? (
                        <p>接続先リレー:{value.connectingRelays.join(", ")}</p>
                      ) : (
                        <p>接続先リレーがありません</p>
                      )}
                      <Button
                        variant="contained"
                        onClick={() => selectedHandle(value)}
                      >
                        リレーを追加して選択
                      </Button>
                    </CardContent>
                  </Card>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <>
          <p>loading account data...</p>
        </>
      )}
      {selectedAccountData && (
        <>
          <Card variant="outlined">
            <h3>選択されたユーザー</h3>
            <h4>名前:{selectedAccountData.name}</h4>
          </Card>
        </>
      )}
    </>
  );
};
