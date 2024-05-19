import React from "react";
import styles from "./Main.module.css";

import LoadingSpinner from "./LoadingSpinner";
import ChatListItem from "./ChatListItem";
import { ChatMessage } from "./ChatTypes";

const ChatList = ({
  isLoading,
  chatList,
}: {
  isLoading: boolean;
  chatList: ChatMessage[];
}): JSX.Element => {
  return (
    <div className={styles.list}>
      {chatList.map((item: any, index: number) => (
        <ChatListItem key={index} item={item} />
      ))}
      {isLoading && <LoadingSpinner />}
    </div>
  );
};

export default ChatList;
