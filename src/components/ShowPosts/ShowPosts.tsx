import { Event, Filter, SimplePool } from "nostr-tools";
import { useEffect, useState } from "react";
import Post from "../Post/Post";
import styles from "./showPosts.module.scss";
type nostrPost = Event & {
  isReplay: boolean;
  toRelayURLs: string[];
};
const ShowPosts = () => {
  const [posts, setPosts] = useState<nostrPost[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState<boolean>(true);
  const [kindNumber, setKindNumber] = useState<number>(0);
  const [relayURLs, setRelayURLs] = useState<string[]>(["ws://172.16.1.73/"]);
  const [newRelay, setNewRelay] = useState<string>("");
  const changeNumberHandle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value); // 入力値を数値に変換
    setKindNumber(value);
  };
  const addRelay = (newRelay: string) => {
    setRelayURLs((prevRelayURLs) => {
      if (prevRelayURLs.includes(newRelay)) {
        return prevRelayURLs;
      } else {
        return [...prevRelayURLs, newRelay];
      }
    });
  };
  const removeRelayURL = (urlToRemove: string) => {
    setRelayURLs((prevRelayURLs) =>
      //filterは条件のものを残す関数
      prevRelayURLs.filter((url) => url !== urlToRemove)
    );
  };
  const handleAddRelayUrl = () => {
    addRelay(newRelay);
    setNewRelay("");
  };
  const pool = new SimplePool();
  /*poolを使ったリレー接続 */
  useEffect(() => {
    const filter: Filter = {
      kinds: [kindNumber],
      limit: 100,
    };
    const subscription = pool.subscribeMany(relayURLs, [filter], {
      onevent(event: Event) {
        const newPost: nostrPost = {
          ...event, //返信投稿の場合マーク
          isReplay: event.tags.some((tag) => tag[0] === "e"),
          toRelayURLs: relayURLs,
        };
        setPosts((prevPosts) => [...prevPosts, newPost]);
      },
      oneose() {
        subscription.close();
        setIsLoadingPosts(false);
      },
    });
    return () => {
      //コンポーネントアンマウントの際に切断
      subscription.close();
      setPosts([]);
    };
  }, [kindNumber]);

  return (
    <>
      <div>
        <h3>リレー管理</h3>
        <div>
          <input
            type="text"
            value={newRelay}
            onChange={(e) => setNewRelay(e.target.value)}
            placeholder="リレーURLを追加"
          />
          <button onClick={handleAddRelayUrl}>追加</button>
        </div>
        <ul>
          {relayURLs.map((url, index) => (
            <li key={index}>
              {url} <button onClick={() => removeRelayURL(url)}>削除</button>
            </li>
          ))}
        </ul>
        <h4>kindの番号を入力</h4>
        <input value={kindNumber} type="number" onChange={changeNumberHandle} />

        <h1>Nostr Events</h1>
        <ul>
          {isLoadingPosts ? (
            <p>読み込み中...</p>
          ) : (
            <ul>
              {posts.map((event: nostrPost) => (
                <Post
                  key={event.id}
                  postEvent={event}
                  isLoadingPosts={isLoadingPosts}
                />
              ))}
            </ul>
          )}
        </ul>
      </div>
    </>
  );
};
export default ShowPosts;
