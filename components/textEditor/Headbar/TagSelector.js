import React, { useRef, useState, useEffect } from "react";
import styles from "./TagSelector.module.css";
import { BiX, BiHash, BiPlusCircle } from 'react-icons/bi';
import supabase from "./../../../util/Supabase";

const COLOR_LEVELS = ['#FFA500', '#0099CC', '#FF4500', '#CC66FF', '#00CC66', '#666666']; // 定义颜色档次

const TagSelector = ({ selectedTags, onTagSelect, onTagRemove }) => {
    const [tagInput, setTagInput] = useState("");
    const [tagsList, setTagsList] = useState();
    const [filteredTags, setFilteredTags] = useState();
    const [showPanel, setShowPanel] = useState(false);
    const showTagsList = selectedTags.length < 5;
    const inputRef = useRef(null); // 创建一个ref来引用input元素

    const fetchPaginationData = async () => {
        try {
            const { data, error } = await supabase
                .from('Keyword')
                .select('*')
            if (error) {
                throw error;
            }
            setFilteredTags(data)
            setTagsList(data)
        } catch (error) {
            console.error('Error fetching pagination data:', error);
        }
    };
    useEffect(() => {
        fetchPaginationData()
    }, []);

    const handleInputFocus = () => {
        setShowPanel(true);
        scrollToInput(); // 调用滚动条定位函数
    };

    const handleInputBlur = () => {
        setShowPanel(false);
    };

    const filterTagInput = (value) => {
        setTagInput(value);
        // 根据输入值筛选TagsList
        const filtered = tagsList.filter(
            (tag) => tag.label_name.toLowerCase().includes(value.toLowerCase())
        );

        setFilteredTags(filtered);
    }

    const handleInputChange = (event) => {
        const { value } = event.target;
        filterTagInput(value)
    };

    const handleTagClick = (tag) => {
        onTagSelect(tag);
        filterTagInput('');
    };

    const handleTagRemove = (tag) => {
        onTagRemove(tag.id);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Backspace' && tagInput === '' && selectedTags.length > 0) {
            event.preventDefault();
            const lastTag = selectedTags[selectedTags.length - 1];
            onTagRemove(lastTag.id);
        }
    };

    const scrollToInput = () => {
        if (inputRef.current) {
            inputRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <div className={styles["tagSelector"]}>

            {selectedTags.length > 0 && (
                <div className={styles["selectedTags"]}>
                    {selectedTags.map((tag) => (
                        <div
                            className={styles["tag"]}
                            style={{
                                backgroundColor: `rgba(${hexToRgb(tag.color)},0.5)`
                            }}
                            key={tag.id}
                        >
                            {tag.label_name}
                            <span
                                className={styles["tag-remove"]}
                                onClick={() => handleTagRemove(tag)}
                            >
                                <BiX />
                            </span>
                        </div>
                    ))}
                </div>
            )}

            <input
                ref={inputRef} // 将ref添加到input元素
                type="text"
                value={tagInput}
                placeholder="Add up to 5 tags..."
                onFocus={handleInputFocus} // 添加 onFocus 事件处理程序
                onBlur={handleInputBlur} // 添加 onBlur 事件处理程序
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
            />
            {showPanel && (
                <div className={styles['tags-panel']}>
                    {showPanel && !tagInput && (
                        <div className={styles['tags-panel-title']}>Top tags</div>
                    )}
                    {showTagsList ? (
                        <TagsList tagInput={tagInput} tags={filteredTags} selectedTags={selectedTags} onHandleTagClick={handleTagClick} />
                    ) : (
                        <div className={styles['tag-limit-message']}>
                            You can only add up to 5 tags.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};


const TagsList = ({ tagInput, tags, selectedTags, onHandleTagClick }) => {
    // 过滤已选择的标签
    const filteredTags = tags && tags.filter((tag) => !selectedTags.some((selectedTag) => selectedTag.id === tag.id));

    const handleSaveClick = async () => {

        const tag = {
            label_name: tagInput,
            color: COLOR_LEVELS[Math.floor(Math.random() * COLOR_LEVELS.length)],
            label_type: 0
        }
        const { data, error } = await supabase
            .from('Keyword')
            .insert([
                tag,
            ])
            .select();

        if (error) {
            throw error;
        }
        onHandleTagClick(data[0])
    };

    if (filteredTags.length === 0) {
        if (tagInput && tagInput.replace(/\s/g, '').length > 0) {
            return <div
                className={styles['tags-item']}
                onMouseDown={() => handleSaveClick()}
            >
                <div className={styles['tags-item-title']}>
                    <BiPlusCircle /> <label>Add New Tag</label>
                </div>
            </div>;
        } else {
            return <div style={{
                padding: "0.25rem 1rem"
            }}>No tags available.</div>;
        }
    }

    return (
        <div className={styles['tags-list']}>
            {filteredTags.map((tag) => (
                <div
                    className={styles['tags-item']}
                    key={tag.id}
                    onMouseDown={() => onHandleTagClick(tag)} // 添加点击事件处理程序
                >
                    <div style={{ color: tag.color }} className={styles['tags-item-title']}>
                        <BiHash />
                        <label>{tag.label_name}</label>
                    </div>
                    <div>{tag.description}</div>
                </div>
            ))}
        </div>
    );
}

function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
}
export default TagSelector;
