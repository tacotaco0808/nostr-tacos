import { Event } from "nostr-tools";
import { useEffect, useState } from "react";
import ReplayTargetPost from "./ReplayTargetPost";
type nostrPost = Event & {
  isReplay: boolean;
  toRelayURLs: string[];
};
type postProps = {
  postEvent: nostrPost;
  isLoadingPosts: boolean;
};
const Post: React.FC<postProps> = ({ postEvent, isLoadingPosts }) => {
  //   const [replayPosts, setReplayPosts] = useState<nostrPost[]>([]);
  //   const [normalPosts, setNormalPosts] = useState<nostrPost[]>([]);
  const [isVisibleReplayTargetPost, setIsReplayTargetPost] =
    useState<boolean>(false);
  /*返信投稿と通常投稿振り分け */
  useEffect(() => {
    if (!isLoadingPosts) {
      console.log(postEvent);
    }
  }, [isLoadingPosts]);

  /*画像urlを判別してそのurlを返す*/
  const judgeImageUrls = (content: string) => {
    //:\/\/は「://」と一致 /は特殊文字だから打消し
    //[^\s] この部分は「空白以外の任意の文字」^は否定　\s は空白文字（スペース、タブ、改行など
    //[^\s]+ は、空白がない文字列
    const urlRegex = /(https?:\/\/[^\s]+(?:jpg|jpeg|png|gif|webp))/g;
    return content.match(urlRegex);
  };
  const imgUrls: string[] | null = judgeImageUrls(postEvent.content);
  const handleShowReplayTargetPost = () => {
    setIsReplayTargetPost(true);
  };
  return (
    <>
      <ul>
        <li key={postEvent.id}>
          {postEvent.isReplay ? (
            // 返信投稿の場合の表示
            <div
              style={{
                backgroundColor: "#f0f8ff",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              <p>
                <strong>返信:</strong> {postEvent.content}
              </p>
              {imgUrls?.map((url) => (
                <div key={url}>
                  <img src={url} alt="Image" style={{ maxWidth: "100%" }} />
                </div>
              ))}

              <div
                style={{
                  marginTop: "10px",
                  fontStyle: "italic",
                  color: "#888",
                }}
              >
                {/* 返信元の投稿を表示する処理のプレースホルダー */}
                {isVisibleReplayTargetPost ? (
                  <ReplayTargetPost
                    replayPost={postEvent}
                    isLoadingPost={isLoadingPosts}
                  />
                ) : (
                  <button onClick={handleShowReplayTargetPost}>
                    返信元を表示する
                  </button>
                )}
              </div>
            </div>
          ) : (
            // 通常投稿の場合の表示
            <div style={{ padding: "10px" }}>
              <p>{postEvent.content}</p>
              {imgUrls?.map((url) => (
                <div key={url}>
                  <img src={url} alt="Image" style={{ maxWidth: "100%" }} />
                </div>
              ))}
            </div>
          )}
        </li>
      </ul>
    </>
  );
};
export default Post;
