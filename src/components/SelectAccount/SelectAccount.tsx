import { useEffect, useState } from "react";

export const SelectAccount = () => {
  const [accountData, setAccountData] = useState<Record<string, any>>();
  const getItemsByKeySubstring = (substring: string): Record<string, any> => {
    const result: Record<string, any> = {};
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
  useEffect(() => {
    const fetchedData = getItemsByKeySubstring("user:");
    setAccountData(fetchedData);
  }, []);
  return (
    <>
      <h1>Select Account</h1>
      {accountData ? (
        <>
          <ul>
            {Object.entries(accountData).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {JSON.stringify(value)}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <p>loading account data...</p>
        </>
      )}
    </>
  );
};
