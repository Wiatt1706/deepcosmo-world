"use client";
import { useState, useRef } from "react";
import TextEditor from "../../../components/textEditor";
import styles from "./Editortool.module.css";
import { BiCog } from "react-icons/bi";
import { v4 as uuidv4 } from "uuid";
import { BlockButton } from "@/components/assembly/DLCModule";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useNotification } from "@/components/utils/NotificationBar";

export default function EditorPage() {
  const router = useRouter();
  const textEditorRef = useRef(null);

  const [isPublish, setIsPublish] = useState(false); // 添加一个状态来跟踪提交状态
  const addNotification = useNotification((state) => state.addNotification);

  const handleClearEditor = () => {
    const confirmed = window.confirm("确定要清空编辑器内容吗？");
    if (confirmed) {
      if (textEditorRef.current) {
        window.location.reload();
        localStorage.removeItem("slateData");
      }
    }
  };

  const handleSaveDraftEditor = () => {
    if (textEditorRef.current) {
      textEditorRef.current.save();
    }
  };

  const handlePublish = async () => {
    if (textEditorRef.current) {
      const { title, tags, bannerImg, editorContent, description } =
        textEditorRef.current.get();

      if (!title) {
        addNotification("请提供标题", "error", "保存异常");
        return;
      }

      if (!tags || tags.length == 0) {
        addNotification("请至少提供一个标签", "error", "保存异常");
        return;
      }

      setIsPublish(true);
      let bannerImgUrl = null;
      if (bannerImg) {
        const filePath = `public/bannerImg/${uuidv4()}.jpg`;
        // 上传封面图片
        const { data, error } = await supabase.storage
          .from("deepcosmo_img")
          .upload(filePath, bannerImg);

        if (data) {
          bannerImgUrl = filePath;
        } else {
          // Handle saving failure
          addNotification(error, "error", "保存异常");
          console.log(error);
          setIsPublish(false);
        }
      }

      const pxCmtyArticlesData = {
        title,
        description: description,
        content: JSON.stringify(editorContent),
        banner_img_url: bannerImgUrl,
        keywords: tags.map((obj) => obj.id),
      };

      const { data, error } = await supabase
        .from("PxCmtyArticles")
        .insert([pxCmtyArticlesData])
        .select();

      if (data) {
        addNotification("内容已成功发布");
        router.push("/community");
      } else {
        addNotification("发布内容失败", "error", "保存异常");
      }
      setIsPublish(false);
    }
  };

  return (
    <div className={styles["crayons-article-form"]}>
      <div className={styles["crayons-article-form__content"]}>
        <div className={styles["container"]}>
          <TextEditor ref={textEditorRef} />

          <div className={styles["footer-body"]}>
            {isPublish ? (
              <BlockButton
                className={styles["c-btn--primary"]}
                value={<Loader2 />}
                autoRotate={true}
              />
            ) : (
              <BlockButton
                value="Publish"
                onClick={handlePublish}
                className={styles["c-btn--primary"]}
              />
            )}

            <button
              onClick={handleSaveDraftEditor}
              type="button"
              className={styles["c-btn"]}
            >
              Save
            </button>
            <button type="button" className={styles["c-btn"]}>
              <BiCog />
            </button>
            <button
              onClick={handleClearEditor}
              type="button"
              className={styles["c-btn"]}
            >
              Revert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
