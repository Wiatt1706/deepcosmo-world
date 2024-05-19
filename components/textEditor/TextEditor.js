import React, { useRef, useCallback, useState, useEffect } from 'react';
import { Editable, Slate } from 'slate-react';
import { Transforms, Range, Editor } from 'slate'
import styles from '@/styles/blogs/Editor.module.css';
import Toolbar from './Toolbar';
import Headbar from './Headbar';
import MarkToolbar from './MarkToolbar';
import Element from './Element';
import { useDecorate, SetNodeToDecorations, CodeBlockType, toChildren, toCodeLines, ParagraphType } from './CodeHighlighting';
import Leaf from './Leaf';
import { isKeyHotkey } from 'is-hotkey'

const initialValue = [
    {
        type: ParagraphType,
        children: toChildren(''),
    },
]

const TextEditor = ({ editor, setTitle, setTags, setBannerImg }) => {
    const [slateData, setSlateData] = useState(initialValue);
    const renderElement = useCallback(props => <Element {...props} />, []);
    const renderLeaf = useCallback(props => <Leaf {...props} />, []);
    const editableRef = useRef(null);
    const decorate = useDecorate(editor)

    const onKeyDown = event => {
        const { selection } = editor
        if (selection && Range.isCollapsed(selection)) {
            const { nativeEvent } = event
            if (isKeyHotkey('left', nativeEvent)) {
                event.preventDefault()
                Transforms.move(editor, { unit: 'offset', reverse: true })
                return
            }
            if (isKeyHotkey('right', nativeEvent)) {
                event.preventDefault()
                Transforms.move(editor, { unit: 'offset' })
                return
            }
        }
    }

    useEffect(() => {
        // 从本地存储中获取保存的 JSON 数据
        const savedData = localStorage.getItem('slateData');

        if (savedData) {
            // 将 JSON 字符串转换为 Slate.js 对象
            const jsonData = JSON.parse(savedData);
            // 通过替换编辑器的内容来加载数据
            editor.children = jsonData;
        }
    }, []);

    return (
        <div className={styles['container']}>
            <Slate editor={editor} value={slateData}>
                <Headbar maxLength='50' setTitle={setTitle} setTags={setTags} setBannerImg={setBannerImg} />
                <Toolbar editor={editor} />
                <MarkToolbar editor={editor} editableNode={editableRef.current} />
                <div ref={editableRef} className={styles['editable-container']}>
                    <SetNodeToDecorations />
                    <Editable
                        decorate={decorate}
                        className={styles['editable']}
                        renderElement={renderElement}
                        renderLeaf={renderLeaf}
                        placeholder="Enter some rich text…"
                        onKeyDown={onKeyDown}
                        spellCheck
                        autoFocus
                    />
                </div>

            </Slate>
        </div>
    );
};

export default TextEditor;
