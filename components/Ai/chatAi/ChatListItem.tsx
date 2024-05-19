import React, { useState } from "react";
import styles from "./Main.module.css";
import Image from "next/image";
import { ChatMessage } from "./ChatTypes";
import ReadEditor from "../../textEditor/ReadEditor";
import { TbCheck, TbClipboardText } from "react-icons/tb";
import { GeminiSVG } from "@/components/utils/icons";

const ChatListItem = ({
  item,
  index,
}: {
  item: ChatMessage;
  index?: number;
}): JSX.Element => {
  const [isCopied, setIsCopied] = useState(false);

  const slateText = (text: string) => [
    {
      type: "paragraph",
      children: [{ text: text }],
    },
  ];

  const copyHandle = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
  };

  const resetCopyStatus = () => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, 1500);
    }
  };

  return (
    <div
      className={styles.item}
      key={index}
      onTouchStart={resetCopyStatus}
      onMouseEnter={resetCopyStatus}
    >
      <div className={styles.item_tool}>
        <ul onClick={() => copyHandle(item.parts)}>
          {isCopied ? <TbCheck width={15} /> : <TbClipboardText width={15} />}
        </ul>
      </div>
      <div className={`${styles.commentAvatar}`}>
        {item.role === "user" ? (
          <div className={styles.itme_avatar}></div>
        ) : (
          <div className={styles.ai_avatar}>
            <GeminiSVG size={20} />
          </div>
        )}
      </div>

      <div className={styles.itme_gruop}>
        <div className={styles.itme_content}>
          <div className={styles.itme_text}>
            {/* <ReadEditor content={slateText(item.parts)} /> */}
            {item.parts}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ChatListItem;
