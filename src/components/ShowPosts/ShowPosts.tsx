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

  const pool = new SimplePool();
  /*poolを使ったリレー接続 */
  useEffect(() => {
    const relayURLs = [
      "wss://relay-jp.nostr.wirednet.jp",
      "punya",
      "wss://relay-jp.nostr.wirednet.jp",
    ];
    const filter: Filter = {
      kinds: [1],
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
    };
  }, []);

  return (
    <>
      aiuepo
      <div>
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
