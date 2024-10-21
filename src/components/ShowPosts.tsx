import { Event, Filter, Relay } from "nostr-tools";
import { useEffect, useRef, useState } from "react";

const ShowPosts = () => {
  const relayRef = useRef<Relay | null>(null);
  const [posts, setPosts] = useState<Event[]>([]);
  const getRelayPosts = async () => {
    try {
      const relay = await Relay.connect("wss://relay-jp.nostr.wirednet.jp");
      relayRef.current = relay;
      console.log(`connected to ${relay.url}`);
      const filter: Filter = { kinds: [1], limit: 20 };
      const subscription = relay.subscribe([filter], {
        onevent(event: Event) {
          console.log("event:", event);
          setPosts((prevPosts) => [event, ...prevPosts]);
        },
        oneose() {
          //eoseは保存しているイベントをすべて吐き出した後出されるイベント
          subscription.close();
        },
      });
    } catch (error) {
      console.error("Error connecting to relay:", error);
    }
  };
  useEffect(() => {
    getRelayPosts();
    return () => {
      //コンポーネントアンマウント時接続を切る
      if (relayRef.current) {
        relayRef.current.close();
      }
    };
  }, []);
  return (
    <>
      aiuepo
      <ul>
        {posts.map((post, index) => {
          return (
            <li key={post.id}>
              {index + 1}:{post.content}
            </li>
          );
        })}
      </ul>
    </>
  );
};
export default ShowPosts;
