"use client";
import { useEffect, useRef, useState } from "react";
import styles from "@/styles/blogs/Read.module.css";
import ReadingContent from "@/components/blogs/ReadingContent";
import UpvoteBtn from "@/components/blogs/UpvoteBtn";
import CommentBtn from "@/components/blogs/CommentBtn";
import CommentSection from "@/components/blogs/comment";
import { LikesProvider } from "@/components/blogs/LikesContext";
import { CommentProvider } from "@/components/blogs/CommentContext";
import { Session } from "@supabase/auth-helpers-nextjs";
export default function BlogClient({
  post,
  session,
}: {
  post: PostVO;
  session: Session | null;
}) {
  const [shouldFixActions, setShouldFixActions] = useState(false);

  const contentRef = useRef<HTMLDivElement | null>(null);
  const actionsRef = useRef<HTMLDivElement | null>(null);
  const commentsRef = useRef<HTMLDivElement | null>(null);
  const shouldFixActionsRef = useRef<boolean>(false);

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
    if (shouldFixActions && contentRef.current) {
      const contentRect = contentRef.current.getBoundingClientRect();
      return {
        width: `${contentRect.width}px`,
        left: `${contentRect.left}px`,
      };
    }
    return {};
  };

  return (
    <LikesProvider post={post} session={session}>
      <CommentProvider post={post}>
        <div ref={contentRef} className={styles.content}>
          <ReadingContent post={post} />

          <div
            ref={actionsRef}
            className={`${styles.content_actions} ${
              shouldFixActions ? styles.fixed_actions : ""
            }`}
            style={getContentActionsStyles()}
          >
            <UpvoteBtn />
            <CommentBtn parentRef={contentRef} post={post} />
          </div>

          {/* 评论模块 */}
          <div ref={commentsRef}>
            <CommentSection post={post} session={session} />
          </div>
        </div>
      </CommentProvider>
    </LikesProvider>
  );
}
