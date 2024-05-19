
import React, { useRef, useState, useEffect } from "react";
import styles from './CommentEditor.module.css';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { BlockButton } from '@/components/assembly/DLCModule';
import { useKeyboardEvent } from '@/components/utils/GeneralEvent';
import { init } from 'emoji-mart'
import { TbMoodSmile } from "react-icons/tb";

init({ data })
// 自定义要显示的类别
const customCategories = ['frequent', 'people', 'nature', 'symbols', 'objects', 'places'];

export function parseEmojiCode(text) {
    const emojiRegex = /\[([^\]]+)\]/g;
    const matches = text && text.match(emojiRegex);

    if (!matches) {
        return text;
    }

    return text.split(emojiRegex).map((part, index) => {
        if (index % 2 === 0) {
            return part;
        } else {
            // Remove brackets around the emoji code
            const emojiCode = matches[(index - 1) / 2].slice(1, -1);
            return <em-emoji key={index} id={emojiCode}></em-emoji>;
        }
    });

}

export default function EmojiBtn({ handleSelect }) {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [emojiPickerStyle, setEmojiPickerStyle] = useState({
        position: 'absolute',
        top: '40px',
        left: '0px',
    });

    const emojiButtonRef = useRef(null);
    const emojiContainerRef = useRef(null);

    useEffect(() => {
        const handleEmojiPickerPosition = () => {
            const windowHeight = window.innerHeight;
            if (emojiContainerRef.current) {
                const buttonRect = emojiButtonRef.current.getBoundingClientRect();
                const containerRect = emojiContainerRef.current.getBoundingClientRect();
                const buttonBottom = buttonRect.bottom;

                if (buttonBottom + containerRect.height >= windowHeight) {
                    setEmojiPickerStyle({
                        position: 'absolute',
                        top: `-${containerRect.height}px`,
                        left: '0px',
                    });
                } else {
                    setEmojiPickerStyle({
                        position: 'absolute',
                        top: `40px`,
                        left: '0px',
                    });
                }
            }
        };

        window.addEventListener('resize', handleEmojiPickerPosition);
        handleEmojiPickerPosition();

        return () => {
            window.removeEventListener('resize', handleEmojiPickerPosition);
        };
    }, [showEmojiPicker]);

    // 处理选中的表情包
    const handleEmojiSelect = (emoji) => {
        setShowEmojiPicker(false);
        handleSelect(emoji)
    };

    // 处理点击添加表情包的函数
    const handleAddEmoji = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    useKeyboardEvent('Escape', () => { setShowEmojiPicker(false) });
    return (
        <div >
            {/* 添加表情包按钮 */}
            <BlockButton value={<TbMoodSmile />} btnRef={emojiButtonRef} onClick={handleAddEmoji} />

            {showEmojiPicker && (
                <div ref={emojiContainerRef} className={styles['emojiContainer']} style={emojiPickerStyle}>
                    <Picker
                        data={data}
                        theme='dark'
                        onEmojiSelect={handleEmojiSelect}
                        previewPosition='none'
                        searchPosition='none'
                        categories={customCategories}
                        emojiSize='18'
                        emojiButtonSize='28'
                        perLine={10} // 控制每行显示的表情包数量
                    />
                </div>
            )}
        </div>
    );
}

