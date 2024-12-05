import { SendPost } from "../../components/SendPost/SendPost";

const Home = () => {
  const relayURLs = ["r.kojira.io"];
  return (
    <>
      tacoas
      <SendPost relays={relayURLs} />
    </>
  );
};
export default Home;
