"use client";
import { useEffect, useRef, useState } from "react";
import styles from "@/styles/blogs/Read.module.css";
import ReadingContent from "@/components/blogs/ReadingContent";
import UpvoteBtn from "@/components/blogs/UpvoteBtn";
import CommentBtn from "@/components/blogs/CommentBtn";
import CommentSection from "@/components/blogs/comment";
import { LikesProvider } from "@/components/blogs/LikesContext";
import { CommentProvider } from "@/components/blogs/CommentContext";


export default function BlogClient({ post }: any) {
  console.log(post);

  const [shouldFixActions, setShouldFixActions] = useState(false);

  const contentRef = useRef(null);
  const actionsRef = useRef(null);
  const commentsRef = useRef(null);
  const shouldFixActionsRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current || !actionsRef.current || !commentsRef.current)
        return;

      const contentRect = contentRef.current.getBoundingClientRect();
      const actionsRect = actionsRef.current.getBoundingClientRect();
      const commentsRect = commentsRef.current.getBoundingClientRect();

      const isContentBelowWindow =
        contentRect.bottom >
        window.innerHeight + actionsRect.height + commentsRect.height;
      const isContentAboveWindow = contentRect.top < 0;
      const newShouldFixActions = isContentBelowWindow && isContentAboveWindow;

      if (newShouldFixActions !== shouldFixActionsRef.current) {
        shouldFixActionsRef.current = newShouldFixActions;
        setShouldFixActions(newShouldFixActions);
      }
    };

    const handleScrollThrottled = () => {
      requestAnimationFrame(handleScroll);
    };

    handleScrollThrottled(); // 检查初始滚动位置
    window.addEventListener("scroll", handleScrollThrottled);

    return () => {
      window.removeEventListener("scroll", handleScrollThrottled);
    };
  }, []);

  const getContentActionsStyles = () => {
    if (shouldFixActions) {
      const contentRect = contentRef.current.getBoundingClientRect();
      return {
        width: `${contentRect.width}px`,
        left: `${contentRect.left}px`,
      };
    }
    return {};
  };

  return (
    <LikesProvider post={post}>
      <CommentProvider post={post}>
        <div className={styles.content} ref={contentRef}>
          <ReadingContent post={post} />

          <div
            ref={actionsRef}
            className={`${styles.content_actions} ${
              shouldFixActions ? styles.fixed_actions : ""
            }`}
            style={getContentActionsStyles()}
          >
            <UpvoteBtn post={post} />
            <CommentBtn parentRef={contentRef} post={post} />
          </div>

          {/* 评论模块 */}
          <div ref={commentsRef}>
            <CommentSection post={post} />
          </div>
        </div>
      </CommentProvider>
    </LikesProvider>
  );
}