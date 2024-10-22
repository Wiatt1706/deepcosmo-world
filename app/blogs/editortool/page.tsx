"use client";
import { useState, useRef } from "react";
import Editor from "../../../components/textEditor";
import styles from "./Editortool.module.css";
import { BiCog } from "react-icons/bi";
import { v4 as uuidv4 } from "uuid";
import { BlockButton } from "@/components/assembly/DLCModule";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useNotification } from "@/components/utils/NotificationBar";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function EditorPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const textEditorRef = useRef<any>(null);
  const [isPublishing, setIsPublishing] = useState(false); // State to track publishing status
  const addNotification = useNotification((state) => state.addNotification);

  const handleClearEditor = () => {
    const confirmed = window.confirm("确定要清空编辑器内容吗？");
    if (confirmed) {
      localStorage.removeItem("slateData");
      window.location.reload(); // Resetting the editor
    }
  };

  const handleSaveDraft = () => {
    textEditorRef.current?.save(); // Using optional chaining to call save if ref exists
  };

  const handlePublish = async () => {
    if (!textEditorRef.current) return;

    const { title, tags, bannerImg, editorContent, description } =
      textEditorRef.current.get();

    if (!title) {
      addNotification("请提供标题", "error", "保存异常");
      return;
    }
    if (!tags || tags.length === 0) {
      addNotification("请至少提供一个标签", "error", "保存异常");
      return;
    }

    setIsPublishing(true);
    let bannerImgUrl = null;

    if (bannerImg) {
      const filePath = `public/bannerImg/${uuidv4()}.jpg`;
      const { data, error } = await supabase.storage
        .from("deepcosmo_img")
        .upload(filePath, bannerImg);

      if (error) {
        addNotification(error.message || "上传失败", "error", "保存异常");
        setIsPublishing(false);
        return;
      }
      bannerImgUrl = filePath;
    }

    const articleData = {
      title,
      description,
      content: JSON.stringify(editorContent),
      banner_img_url: bannerImgUrl,
      keywords: tags.map((tag: any) => tag.id),
    };

    const { error } = await supabase
      .from("PxCmtyArticles")
      .insert([articleData]);

    if (error) {
      addNotification("发布内容失败", "error", "保存异常");
    } else {
      addNotification("内容已成功发布");
      router.push("/community");
    }
    setIsPublishing(false);
  };

  return (
    <div className={styles["crayons-article-form"]}>
      <div className={styles["crayons-article-form__content"]}>
        <div className={styles["container"]}>
          <Editor ref={textEditorRef} />

          <div className={styles["footer-body"]}>
            {isPublishing ? (
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
              onClick={handleSaveDraft}
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
