import React, { useRef, useState, useEffect } from "react";
import styles from "./CommentEditor.module.css";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { BlockButton } from "@/components/assembly/DLCModule";
import { useEvent, useKeyboardEvent } from "@/components/utils/GeneralEvent";
import { init } from "emoji-mart";
import { TbMoodSmile } from "react-icons/tb";

init({ data });

// Define the types for the props
interface EmojiBtnProps {
  handleSelect: (emoji: { id: string }) => void;
}

const customCategories = [
  "frequent",
  "people",
  "nature",
  "symbols",
  "objects",
  "places",
];

export function parseEmojiCode(text: string): (string | JSX.Element)[] {
  const emojiRegex = /\[([^\]]+)\]/g;
  const matches = text && text.match(emojiRegex);

  if (!matches) {
    return [text];
  }

  return text.split(emojiRegex).map((part, index) => {
    if (index % 2 === 0) {
      return part;
    } else {
      const emojiCode = matches[(index - 1) / 2].slice(1, -1);
      return React.createElement("em-emoji", { key: index, id: emojiCode });
    }
  });
}

const EmojiBtn: React.FC<EmojiBtnProps> = ({ handleSelect }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [emojiPickerStyle, setEmojiPickerStyle] = useState<React.CSSProperties>(
    {
      position: "absolute",
      top: "40px",
      left: "0px",
    }
  );

  const emojiButtonRef = useRef<HTMLButtonElement | null>(null);
  const emojiContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleEmojiPickerPosition = () => {
      const windowHeight = window.innerHeight;
      if (emojiContainerRef.current && emojiButtonRef.current) {
        const buttonRect = emojiButtonRef.current.getBoundingClientRect();
        const containerRect = emojiContainerRef.current.getBoundingClientRect();
        const buttonBottom = buttonRect.bottom;

        if (buttonBottom + containerRect.height >= windowHeight) {
          setEmojiPickerStyle({
            position: "absolute",
            top: `-${containerRect.height}px`,
            left: "0px",
          });
        } else {
          setEmojiPickerStyle({
            position: "absolute",
            top: `40px`,
            left: "0px",
          });
        }
      }
    };

    window.addEventListener("resize", handleEmojiPickerPosition);
    handleEmojiPickerPosition();

    return () => {
      window.removeEventListener("resize", handleEmojiPickerPosition);
    };
  }, [showEmojiPicker]);

  // Handle the selected emoji
  const handleEmojiSelect = (emoji: { id: string }) => {
    setShowEmojiPicker(false);
    handleSelect(emoji);
  };

  // Toggle emoji picker visibility
  const handleAddEmoji = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  return (
    <div>
      {/* Add emoji button */}
      <BlockButton
        value={<TbMoodSmile />}
        btnRef={emojiButtonRef}
        onClick={handleAddEmoji}
      />

      {showEmojiPicker && (
        <div
          ref={emojiContainerRef}
          className={styles["emojiContainer"]}
          style={emojiPickerStyle}
        >
          <Picker
            data={data}
            theme="dark"
            onEmojiSelect={handleEmojiSelect}
            previewPosition="none"
            searchPosition="none"
            categories={customCategories}
            emojiSize="18"
            emojiButtonSize="28"
            perLine={10}
          />
        </div>
      )}
    </div>
  );
};

export default EmojiBtn;
