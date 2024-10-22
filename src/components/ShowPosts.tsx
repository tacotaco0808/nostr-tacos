import { Event, Filter, Relay } from "nostr-tools";
import { useEffect, useRef, useState } from "react";

const ShowPosts = () => {
  const relayRef = useRef<Relay | null>(null);
  const [posts, setPosts] = useState<Event[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState<boolean>(true);
  const [replayPosts, setReplayPosts] = useState<Event[]>([]);
  const [normalPosts, setNormalPosts] = useState<Event[]>([]);

  /*すべての投稿を読み込む */
  const getRelayPosts = async () => {
    try {
      const relay = await Relay.connect("wss://relay-jp.nostr.wirednet.jp");
      relayRef.current = relay;
      console.log(`connected to ${relay.url}`);
      const filter: Filter = { kinds: [1], limit: 100 };
      const subscription = relay.subscribe([filter], {
        onevent(event: Event) {
          console.log("event:", event);
          setPosts((prevPosts) => [event, ...prevPosts]);
        },
        oneose() {
          //eoseは保存しているイベントをすべて吐き出した後出されるイベント
          subscription.close();
          setIsLoadingPosts(false);
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
  /*すべての投稿を読み込んだ後に実行 */
  useEffect(() => {
    if (!isLoadingPosts) {
      console.log("準備完了");
      const tmpNormalPosts = posts.filter(
        //通常の投稿が入っている
        (post: Event) => !post.tags.some((tag) => tag[0] === "e")
      );
      setNormalPosts((prevPosts: Event[]) => [...tmpNormalPosts, ...prevPosts]);
      const tmpReplaylPosts = posts.filter(
        //通常の投稿が入っている
        (post: Event) => post.tags.some((tag) => tag[0] === "e")
      );
      setReplayPosts((prevPosts: Event[]) => [
        ...tmpReplaylPosts,
        ...prevPosts,
      ]);
    }
  }, [isLoadingPosts]);
  return (
    <>
      aiuepo
      <ul>
        <h3>通常の投稿</h3>
        {normalPosts.map((post, index) => {
          return (
            <li key={post.id}>
              {index + 1}:{post.content}
            </li>
          );
        })}
      </ul>
      <ul>
        <h3>返信の投稿</h3>
        {replayPosts.map((post, index) => {
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
