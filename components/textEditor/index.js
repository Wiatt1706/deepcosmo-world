import React, { useMemo, useState, forwardRef, useImperativeHandle } from 'react';
import styles from '@/styles/blogs/Editor.module.css';
import { withReact } from 'slate-react';
import { createEditor, Node } from 'slate';
import { withHistory } from 'slate-history';
import { withImages, withHtml, withInlines, clearEditor } from './helpers';
import TextEditor from './TextEditor';
import PortalContext from '../system/PortalContext';

const Editor = forwardRef((props, ref) => {
    const [parentElement, setParentElement] = useState(null);
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState([]);
    const [bannerImg, setBannerImg] = useState(null);
    const editor = useMemo(() => withInlines(withHtml(withImages(withHistory(withReact(createEditor()))))), []);

    // 暴露给父组件的方法：清空编辑器内容、保存草稿、发布
    useImperativeHandle(ref, () => ({
        clear: () => {
            clearEditor(editor);
        },
        save: () => {
            // 将 Slate.js 数据转换为 JSON 对象
            const jsonData = JSON.stringify(editor.children);
            // 将 JSON 对象保存到本地存储或发送到服务器等操作
            localStorage.setItem('slateData', jsonData);
        },
        get: () => {
            return {
                title, tags, bannerImg,
                editorContent: editor.children,
                description: generateExcerpt(editor.children)
            };
        },

    }));

    // 获取生成摘要
    const generateExcerpt = (editorContent) => {
        const maxLength = 100; // 最大摘要长度

        // 获取编辑器内容的纯文本字符串
        const plainText = editorContent.map(node => Node.string(node)).join('');

        // 截取摘要，不超过最大长度，并确保不会截断一个单词
        return plainText.length > maxLength ? plainText.slice(0, maxLength).trim() + '...' : plainText;

    }

    return (
        <div ref={setParentElement} className={styles['format-body']}>
            <PortalContext.Provider value={parentElement}>
                <TextEditor editor={editor} setTitle={setTitle} setTags={setTags} setBannerImg={setBannerImg} />
            </PortalContext.Provider>
        </div>
    );
});

Editor.displayName = 'Editor';
export default Editor;
