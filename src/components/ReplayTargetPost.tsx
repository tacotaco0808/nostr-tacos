import { Event, Filter, SimplePool } from "nostr-tools";
import { useEffect, useState } from "react";
import Post from "./Post";

type nostrPost = Event & {
  isReplay: boolean;
  toRelayURLs: string[];
};
type props = {
  replayPost: nostrPost;
  isLoadingPost: boolean;
};

const ReplayTargetPost: React.FC<props> = ({ replayPost, isLoadingPost }) => {
  const [originPost, setOriginPost] = useState<nostrPost>();

  const replayTargetPostID = replayPost.tags
    .map((tag) => (tag[0] === "e" ? tag[1] : undefined))
    .filter(Boolean) as string[]; // undefinedを除外

  useEffect(() => {
    if (!isLoadingPost && replayPost.toRelayURLs.length > 0) {
      console.log("Connecting to relays:", replayPost.toRelayURLs);

      const pool = new SimplePool();
      const filter: Filter = {
        kinds: [1],
        limit: 1,
        ids: replayTargetPostID,
      };

      const subscription = pool.subscribeMany(
        replayPost.toRelayURLs,
        [filter],
        {
          onevent(event: Event) {
            console.log("Received event:", event);
            const newPost: nostrPost = {
              ...event,
              isReplay: event.tags.some((tag) => tag[0] === "e"),
              toRelayURLs: replayPost.toRelayURLs,
            };
            setOriginPost(newPost);
          },
          oneose() {
            console.log("Subscription ended.");
            subscription.close();
          },
        }
      );

      // クリーンアップ用
      return () => {
        console.log("Closing subscription.");
        subscription.close();
      };
    }
  }, [isLoadingPost]);
  if (originPost) {
    return (
      <>
        <Post postEvent={originPost} isLoadingPosts={isLoadingPost} />
      </>
    );
  } else {
    return <></>;
  }
};

export default ReplayTargetPost;
