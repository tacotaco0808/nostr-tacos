import { Event, Filter, Relay } from "nostr-tools";
import { useEffect, useRef } from "react";

const ShowPosts = () => {
  const relayRef = useRef<Relay | null>(null);
  const getRelayPosts = async () => {
    try {
      const relay = await Relay.connect("wss://relay-jp.nostr.wirednet.jp");
      relayRef.current = relay;
      console.log(`connected to ${relay.url}`);
      const filter: Filter = { kinds: [1] };
      const subscription = relay.subscribe([filter], {
        onevent(event: Event) {
          console.log("event:", event);
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
  return <>aiuepo</>;
};
export default ShowPosts;
