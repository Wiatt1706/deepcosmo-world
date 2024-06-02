"use client";
import { useContext, useState, useRef, useEffect } from "react";
import styles from "./Comment.module.css";
import CommentContent from "./CommentContent";
import { CommentUserEditor } from "@/components/assembly/comment-editor";
import { useComment } from "../CommentContext";
import {
  Session,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { useUserStore } from "@/components/SocketManager";
import { post as postApi } from "@/utils/api";
import { UploadService } from "@/utils/serviceimpl";
import { v4 as uuidv4 } from "uuid";
import { useNotification } from "@/components/utils/NotificationBar";
export default function CommentSection({
  parentRef,
  post,
  session,
}: {
  parentRef: any;
  post: PostVO;
  session: Session | null;
}) {
  const supabase = createClientComponentClient();
  const addNotification = useNotification((state) => state.addNotification);
  const checkLogin = useUserStore((state) => state.checkLogin);
  const { refresh, commentRecordNum } = useComment();

  console.log("commentRecordNum", commentRecordNum);
  
  const [shouldFixActions, setShouldFixActions] = useState(false);
  const [showBottomEditor, setShowBottomEditor] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const topEditorRef = useRef<HTMLDivElement | null>(null);
  const commentRef = useRef<HTMLDivElement | null>(null);
  const bottomEditorRef = useRef<HTMLDivElement | null>(null);

  // 滚动条检测
  useEffect(() => {
    const handleScroll = () => {
      console.log("handleScroll");

      let isBottom =
        (commentRef.current?.getBoundingClientRect()?.height ?? 0) >
        window.innerHeight;
      setShowBottomEditor(isBottom);
      if (
        !topEditorRef.current ||
        !commentRef.current ||
        !bottomEditorRef.current
      )
        return;
      const topEditorRect = topEditorRef.current.getBoundingClientRect();
      const bottomEditorRect = bottomEditorRef.current.getBoundingClientRect();
      const commentRect = commentRef.current.getBoundingClientRect();
      setShouldFixActions(
        commentRect.top < 0 &&
          commentRect.bottom >
            window.innerHeight + bottomEditorRect.height + 30 &&
          topEditorRect.bottom < 0
      );
    };

    window.addEventListener("scroll", handleScroll);

    if (parentRef) {
      parentRef.current.addEventListener("scroll", handleScroll);
    }
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [parentRef]);

  const getContentActionsStyles = () => {
    if (shouldFixActions && sectionRef.current) {
      const contentRect = sectionRef.current.getBoundingClientRect();
      return {
        width: `${contentRect.width}px`,
        left: `${contentRect.left}px`,
      };
    }
    return {};
  };

  const publishCallback = async (
    text: string,
    files: File[],
    commentId: number,
    parentId: number
  ) => {
    if (!session) {
      checkLogin(); // 打开用户登录
      return;
    }
    setIsLoading(true);

    let image_url;
    if (files.length > 0) {
      const url = await uploadImg(files[0]);
      if (!url) {
        addNotification(
          "发表评论异常，图片上传失败，请稍后重试",
          "error",
          "UploadImg Error"
        );
        setIsLoading(false);
        return;
      }
      image_url = url;
      console.log("image_url", image_url);
    }

    const saveData = {
      content: text,
      post_id: post.id,
      comment_id: commentId || 0,
      parent_id: parentId || 0,
      image_url,
    };

    const response = await postApi(`/comment`, saveData);
    
    setIsLoading(false);
    if (response.status !== 200) return;
    refresh(); // 刷新评论
  };

  const uploadImg = async (file: File) => {
    const fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1); // 获取文件的后缀名
    const bucket = "chat_img";
    const filePath = `public/comment/${uuidv4()}.${fileExtension}`;

    return UploadService.uploadImg(
      supabase,
      bucket,
      filePath,
      new Blob([file], { type: file.type })
    );
  };

  return (
    <div ref={sectionRef} className={`${styles.comment_actions}`}>
      <div ref={topEditorRef} className={styles["top_editor"]}>
        <CommentUserEditor
          session={session}
          onCallback={publishCallback}
          isLoading={isLoading}
        />
      </div>

      {commentRecordNum > 0 && (
        <CommentContent
          commentRef={commentRef}
          session={session}
          handlePublish={publishCallback}
        />
      )}

      <div ref={bottomEditorRef}>
        {showBottomEditor && (
          <div
            className={`${styles.content_actions} ${
              shouldFixActions ? styles.fixed_actions : ""
            }`}
            style={getContentActionsStyles()}
          >
            <CommentUserEditor
              session={session}
              onCallback={publishCallback}
              showFormatToolbarDef={false}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
}
