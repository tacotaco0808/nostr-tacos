import { SendFollowList } from "../../components/SendFollowList/SendFollowList";

export const FollowPage = () => {
  const relayURLs = ["r.kojira.io"];
  return (
    <>
      <SendFollowList relays={relayURLs} />
    </>
  );
};
