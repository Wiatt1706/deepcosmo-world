"use client";
import React, { useRef, useEffect, useState } from "react";
import styles from "./CommentEditor.module.css";
import EmojiBtn from "./EmojiBtn";
import ImageBtn from "./ImageBtn";
import { FormattedMessage } from "react-intl";
import { Loader2, XCircle } from "lucide-react";
import { BlockButton } from "@/components/assembly/DLCModule";
import { useKeyboardEvent } from "@/components/utils/GeneralEvent";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
export const CommentEditor = ({
  onCallback,
  showFormatToolbarDef = true,
  placeholder = "Add to the discussion",
  isLoading = false,
  uploadImgSeting,
}) => {
  const [showFormatToolbar, setShowFormatToolbar] = useState(true); // 控制格式工具栏的显示状态
  const editorRef = useRef(null);

  // 用于存储文本框的内容
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]); // 用于存储选中的文件对象

  useKeyboardEvent(["Control", "Enter"], () => {
    handleCallback();
  });

  useEffect(() => {
    if (showFormatToolbarDef !== undefined) {
      setShowFormatToolbar(showFormatToolbarDef);
    }
  }, [showFormatToolbarDef]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "33px"; // 设置高度为33像素
      textareaRef.current.addEventListener("focus", () => {
        setShowFormatToolbar(true);
      });
    }

    return () => {
      if (textareaRef.current) {
        textareaRef.current.removeEventListener("focus", () => {
          setShowFormatToolbar(true);
        });
      }
    };
  }, []);

  const textareaRef = useRef(null);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // 设置高度为内容的高度

      const contentLines = (textareaRef.current.scrollHeight - 33) / 33; // 22px per line, subtract 6px for padding
      if (contentLines <= 1) {
        textareaRef.current.style.height = "33px"; // 设置高度为33像素
      } else {
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // 设置高度为内容的高度
      }
    }
  };

  // 处理文本框内容变化的函数
  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  // 处理选中的表情包
  const handleEmojiSelect = (emoji) => {
    // 插入选中的表情包到文本框
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;

      const newText =
        text.substring(0, start) + `[${emoji.id}]` + text.substring(end);

      setText(newText);
      // 重新获取焦点
      textareaRef.current.focus();
    }
  };

  // 处理选中的图片
  const handleImageSelect = (file) => {
    // 存储选中的图片URL
    setFiles(Array.from(file));
  };

  // 清除files
  const handleClearImage = (index) => {
    // 创建一个新的文件数组，排除掉指定索引的文件
    const newFiles = files.filter((file, i) => i !== index);
    setFiles(newFiles);
  };

  const handleCallback = () => {
    if (!text && (!files || files.length === 0)) {
      return;
    }
    textareaRef.current.style.height = "auto";
    setText("");
    setFiles([]);
    onCallback(text, files);
  };

  return (
    <div ref={editorRef} className={styles.review_input}>
      <textarea
        ref={textareaRef}
        className={styles["review_textarea"]}
        placeholder={placeholder}
        style={{
          resize: "none",
        }}
        value={text}
        onChange={(e) => {
          handleTextChange(e);
          adjustTextareaHeight(); // 调用调整高度的函数
        }}
      />
      {files.length > 0 && (
        <div className={styles["review-preview"]}>
          {files.map((file, index) => (
            <div className={styles["img-preview"]} key={index}>
              <button
                className={styles["clear-button"]}
                onClick={() => handleClearImage(index)}
              >
                <XCircle width={20} height={20} />
              </button>
              <img
                width={175}
                height={116}
                alt={`Preview ${index + 1}`}
                src={URL.createObjectURL(file)}
              />
            </div>
          ))}
        </div>
      )}

      {showFormatToolbar && (
        <div className={styles["format-toolbar"]}>
          <div className="d_c_c">
            {/* 添加表情包按钮 */}
            <EmojiBtn handleSelect={handleEmojiSelect} />
            {/* 添加图片按钮 */}
            <ImageBtn
              handleSelect={handleImageSelect}
              uploadImgSeting={uploadImgSeting}
            />
          </div>
          <div className="d_c_c">
            <div className="d_c_c">
              <span style={{ marginRight: "15px" }}>Ctrl + Enter</span>
            </div>
            {isLoading ? (
              <BlockButton value={<Loader2 />} autoRotate={true} />
            ) : (
              <button
                onClick={handleCallback}
                disabled={!text && (!files || files.length === 0)}
                className={styles.button_set_submit}
              >
                <FormattedMessage id="submit" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const CommentUserEditor = ({
  onCallback,
  showFormatToolbarDef = true,
  placeholder = "Add to the discussion",
  isLoading = false,
  uploadImgSeting,
  session,
}) => {

  return (
    <div className={styles.review_writing}>
      {session && (
        <div className={`${styles.commentAvatar}`}>
          {session.user.user_metadata?.avatar_url !== null ? (
            <Image
              className={styles.avatar}
              src={session.user.user_metadata.avatar_url}
              width={40}
              height={40}
              alt={session.user.user_metadata.name}
            />
          ) : (
            <div className={styles.noAvatar}>
              {session.user.user_metadata.name &&
                session.user.user_metadata.name
                  .replace(/[^\w\s]/gi, "无")
                  .charAt(0)}
            </div>
          )}
        </div>
      )}
      <div className={styles.commentEditor}>
        <CommentEditor
          onCallback={onCallback}
          showFormatToolbarDef={showFormatToolbarDef}
          placeholder={placeholder}
          isLoading={isLoading}
          uploadImgSeting={uploadImgSeting}
        />
      </div>
    </div>
  );
};
