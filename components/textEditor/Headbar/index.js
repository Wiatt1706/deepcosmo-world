import React, { useRef, useState, useEffect } from "react";
import styles from './Headbar.module.css';
import TagSelector from "./TagSelector";
import ImageUploader from "./ImageUploader";

const Headbar = ({ maxLength = 32, setTitle, setTags, setBannerImg }) => {
    const textareaRef = useRef(null);
    const [text, setText] = useState("");
    const [selectedTags, setSelectedTags] = useState([]); // 存储选择的标签值。

    const handleCanvasChange = (dataURL) => {
        setBannerImg(dataURL);
    };

    const handleTagClick = (tag) => {
        setSelectedTags((prevTags) => [...prevTags, tag]);
    };
    const handleTagRemove = (tagId) => {
        setSelectedTags((prevTags) =>
            prevTags.filter((prevTag) => prevTag.id !== tagId)
        );
    };
    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    };

    const handleChange = (event) => {
        const { value } = event.target;
        if (value.length <= maxLength) {
            setText(value);
        } else {
            event.target.value = text; // 显示截断的文本
        }
        adjustTextareaHeight();
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault(); // 阻止默认的回车键行为
        }
    };

    useEffect(() => {
        setTitle(text);
    }, [text, setTitle]);

    useEffect(() => {
        setTags(selectedTags);
    }, [selectedTags, setTags]);

    return (
        <div className={styles['format-titlebar']}>
            <div style={{ marginBottom: "1rem" }}>
                <ImageUploader onCanvasChange={handleCanvasChange} />
            </div>

            <div>
                <textarea
                    ref={textareaRef}
                    className={styles['tooltip__title']}
                    placeholder="New post title here..."
                    rows={1}
                    maxLength={maxLength}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    style={{
                        resize: 'none',
                    }}
                />
                <label className={styles['character-limit-exceeded']}>{`${text.length} / ${maxLength}`}</label>
            </div>

            <TagSelector
                selectedTags={selectedTags}
                onTagSelect={handleTagClick}
                onTagRemove={handleTagRemove}
            />
        </div>
    );
}

export default Headbar;
