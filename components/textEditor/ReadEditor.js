import React, { useMemo, useRef, useCallback } from 'react';
import { Editable, Slate, withReact } from 'slate-react';
import styles from '@/styles/blogs/Editor.module.css';
import { createEditor } from 'slate';
import { withImages, withHtml, withInlines } from './helpers';
import Element from './Element';
import { useDecorate, SetNodeToDecorations } from './CodeHighlighting';
import Leaf from './Leaf';

const ReadEditor = ({ content }) => {
  const editor = useMemo(() => withInlines(withHtml(withImages(withReact(createEditor())))), []);
  const renderElement = useCallback(props => <Element {...props} />, []);
  const renderLeaf = useCallback(props => <Leaf {...props} />, []);
  const editableRef = useRef(null);
  const decorate = useDecorate(editor);

  const initialValue = content || [
    {
      type: 'paragraph', // 确保 'ParagraphType' 有正确的值，例如 'paragraph'
      children: [{ text: '' }], // 确保 'toChildren' 返回正确的结构
    },
  ];

  return (
    <div className={styles['container']}>
      <Slate editor={editor} initialValue={initialValue}>
        <div ref={editableRef}>
          <SetNodeToDecorations />
          <Editable
            readOnly  // 设置为只读
            decorate={decorate}
            className={styles['editable']}
            renderElement={renderElement}
            renderLeaf={renderLeaf}
          />
        </div>
      </Slate>
    </div>
  );
};

export default ReadEditor;
