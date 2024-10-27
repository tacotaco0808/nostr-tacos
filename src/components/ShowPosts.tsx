import { Event, Filter, Relay, SimplePool } from "nostr-tools";
import { useEffect, useRef, useState } from "react";

const ShowPosts = () => {
  const relayRef = useRef<Relay[] | null>([]);
  const [posts, setPosts] = useState<Event[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState<boolean>(true);
  const [replayPosts, setReplayPosts] = useState<Event[]>([]);
  const [normalPosts, setNormalPosts] = useState<Event[]>([]);
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
        setPosts((prevPosts) => [...prevPosts, event]);
      },
      oneose() {
        subscription.close;
      },
    });
    return () => {
      //コンポーネントアンマウントの際に切断
      subscription.close();
    };
  }, []);
  // /*リレーへ接続 */
  // const connectRelays = async (urlRelays: string[]): Promise<Relay[]> => {
  //   const relays: Relay[] = [];
  //   for (const url of urlRelays) {
  //     try {
  //       const relay = await Relay.connect(url);
  //       relays.push(relay);
  //       console.log(`Connected to relay ${url}`);
  //     } catch (error) {
  //       console.log(`Failed to connect to relay ${url}`);
  //     }
  //   }
  //   return relays;
  // };
  // /*すべての投稿を読み込む */
  // const getRelaysPosts = async (relays: Relay[]) => {
  //   try {
  //     for (const relay of relays) {
  //       const filter: Filter = { kinds: [1], limit: 100 };
  //       const subscription = relay.subscribe([filter], {
  //         onevent(event: Event) {
  //           console.log("event:", event);
  //           setPosts((prevPosts) => [event, ...prevPosts]);
  //         },
  //         oneose() {
  //           //eoseは保存しているイベントをすべて吐き出した後出されるイベント
  //           subscription.close();
  //           setIsLoadingPosts(false);
  //         },
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error connecting to relay:", error);
  //   }
  // };
  // useEffect(() => {
  //   const relayURLs = [
  //     "wss://relay-jp.nostr.wirednet.jp",
  //     "punya",
  //     "wss://relay-jp.nostr.wirednet.jp",
  //   ];
  //   const setupRelays = async () => {
  //     const connectedRelays = await connectRelays(relayURLs);
  //     relayRef.current = connectedRelays;
  //   };
  //   setupRelays();
  //   return () => {
  //     //コンポーネントアンマウント時接続を切る
  //     relayRef.current?.forEach((relay) => relay.close());
  //   };
  // }, []);
  // /*すべての投稿を読み込んだ後に実行 */
  // useEffect(() => {
  //   if (!isLoadingPosts) {
  //     const tmpNormalPosts = posts.filter(
  //       //通常の投稿が入っている
  //       (post: Event) => !post.tags.some((tag) => tag[0] === "e")
  //     );
  //     const tmpReplaylPosts = posts.filter(
  //       //返信の投稿が入っている
  //       (post: Event) => post.tags.some((tag) => tag[0] === "e")
  //     );
  //     setNormalPosts((prevPosts: Event[]) => [...tmpNormalPosts, ...prevPosts]);
  //     setReplayPosts((prevPosts: Event[]) => [
  //       ...tmpReplaylPosts,
  //       ...prevPosts,
  //     ]);
  //   }
  // }, [isLoadingPosts]);
  return (
    <>
      aiuepo
      {/* <ul>
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
      </ul> */}
      <div>
        <h1>Nostr Events</h1>
        <ul>
          {posts.map((event) => (
            <li key={event.id}>
              <p>Author: {event.pubkey}</p>
              <p>Content: {event.content}</p>
              <p>Time: {new Date(event.created_at * 1000).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
export default ShowPosts;
