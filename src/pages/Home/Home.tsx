import { generateSecretKey } from "nostr-tools";
import { SendPost } from "../../components/SendPost/SendPost";

const Home = () => {
  const relayURLs = ["wss://relay-jp.nostr.wirednet.jp", "punya"];
  const sk = generateSecretKey();
  return (
    <>
      tacoas
      <SendPost secretKey={sk} relays={relayURLs} />
    </>
  );
};
export default Home;
