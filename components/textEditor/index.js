import React, { useMemo, useState, forwardRef, useImperativeHandle } from 'react';
import styles from '@/styles/blogs/Editor.module.css';
import { withReact } from 'slate-react';
import { createEditor, Node } from 'slate';
import { withHistory } from 'slate-history';
import { withImages, withHtml, withInlines, clearEditor } from './helpers';
import TextEditor from './TextEditor';
import PortalContext from './system/PortalContext';

const Editor = forwardRef((props, ref) => {
    const [parentElement, setParentElement] = useState(null);
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState([]);
    const [bannerImg, setBannerImg] = useState(null);

    const editor = useMemo(() =>
        withInlines(withHtml(withImages(withHistory(withReact(createEditor()))))), []
    );

    useImperativeHandle(ref, () => ({
        clear: () => clearEditor(editor),
        save: () => {
            const jsonData = JSON.stringify(editor.children);
            localStorage.setItem('slateData', jsonData);
        },
        get: () => ({
            title,
            tags,
            bannerImg,
            editorContent: editor.children,
            description: generateExcerpt(editor.children),
        }),
    }));

    const generateExcerpt = (editorContent) => {
        const maxLength = 100; // Maximum excerpt length
        const plainText = editorContent.map(node => Node.string(node)).join('');
        return plainText.length > maxLength ? `${plainText.slice(0, maxLength).trim()}...` : plainText;
    }

    return (
        <div ref={setParentElement} className={styles['format-body']}>
            <PortalContext.Provider value={parentElement}>
                <TextEditor
                    editor={editor}
                    setTitle={setTitle}
                    setTags={setTags}
                    setBannerImg={setBannerImg}
                />
            </PortalContext.Provider>
        </div>
    );
});

Editor.displayName = 'Editor';
export default Editor;
