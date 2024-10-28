import { Event, Filter, SimplePool } from "nostr-tools";
import { useEffect, useState } from "react";

const ShowPosts = () => {
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
        subscription.close();
        setIsLoadingPosts(false);
      },
    });
    return () => {
      //コンポーネントアンマウントの際に切断
      subscription.close();
    };
  }, []);
  /*画像urlを判別してそのurlを返す*/
  const judgeImageUrls = (content: string) => {
    //:\/\/は「://」と一致 /は特殊文字だから打消し
    //[^\s] この部分は「空白以外の任意の文字」^は否定　\s は空白文字（スペース、タブ、改行など
    //[^\s]+ は、空白がない文字列
    const urlRegex = /(https?:\/\/[^\s]+(?:jpg|jpeg|png|gif|webp))/g;
    return content.match(urlRegex);
  };
  /*すべての投稿を読み込んだ後に実行 */
  /*投稿が返信か、通常か仕分け */
  useEffect(() => {
    if (!isLoadingPosts) {
      const tmpNormalPosts = posts.filter(
        //通常の投稿が入っている
        (post: Event) => !post.tags.some((tag) => tag[0] === "e")
      );
      const tmpReplaylPosts = posts.filter(
        //返信の投稿が入っている
        (post: Event) => post.tags.some((tag) => tag[0] === "e")
      );
      setNormalPosts((prevPosts: Event[]) => [...tmpNormalPosts, ...prevPosts]);
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
          const imgUrls: string[] | null = judgeImageUrls(post.content);
          return (
            <li key={post.id}>
              {index + 1}:{post.content}
              {imgUrls?.map((url) => {
                return (
                  <div key={url}>
                    <img src={url} alt="Image" style={{ maxWidth: "100%" }} />
                  </div>
                );
              })}
            </li>
          );
        })}
      </ul>
      <ul>
        <h3>返信の投稿</h3>
        {replayPosts.map((post, index) => {
          const imgUrls: string[] | null = judgeImageUrls(post.content);
          return (
            <li key={post.id}>
              {index + 1}:{post.content}
              {imgUrls?.map((url) => {
                return (
                  <div key={url}>
                    <img src={url} alt="Image" style={{ maxWidth: "100%" }} />
                  </div>
                );
              })}
            </li>
          );
        })}
      </ul>
      {/* debug */}
      {/* <div>
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
      </div> */}
    </>
  );
};
export default ShowPosts;
