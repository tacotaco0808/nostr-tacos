import { generateSecretKey } from "nostr-tools";
import { SendPost } from "../../components/SendPost/SendPost";

const Home = () => {
  const relayURLs = ["ws://172.16.1.73"];
  const sk = generateSecretKey();
  return (
    <>
      tacoas
      <SendPost secretKey={sk} relays={relayURLs} />
    </>
  );
};
export default Home;
