import React, { useRef } from "react"
import styles from './Toolbar.module.css';
import { Code2 } from 'lucide-react';
import { Element, Transforms, Editor } from 'slate'
import { useSlateStatic, useSlate } from 'slate-react'
import { CodeBlockType, CodeLineType, ParagraphType } from '../CodeHighlighting';
import { is } from "date-fns/locale";

const CodeBlockButton = () => {
    const editor = useSlate();
    // 辅助函数，用于切换代码块状态
    const toggleCodeBlock = () => {
        const isActive = isCodeBlockActive(editor);

        Transforms.unwrapNodes(editor, {
            match: (n) =>
                Element.isElement(n) && n.type === CodeBlockType,
            split: true,
        });

        if (!isActive) {
            Transforms.wrapNodes(
                editor,
                { type: CodeBlockType, language: 'html', children: [] },
            )
            Transforms.setNodes(
                editor,
                { type: CodeLineType },
                { match: n => Element.isElement(n) && n.type === ParagraphType }
            )
        } else {
            Transforms.setNodes(editor, {
                type: ParagraphType
            });
        }
    };
    // 辅助函数，用于检查编辑器的选中状态
    const isCodeBlockActive = () => {
        const [match] = Editor.nodes(editor, {
            match: (n) => Editor.isBlock(editor, n) && n.type === CodeBlockType,
        });

        return !!match;
    };

    const isActive = isCodeBlockActive();

    return (
        <button
            className={`${isActive ? styles['tooltip-icon-button-active'] : styles['tooltip-icon-button']}`}
            onMouseDown={event => {
                event.preventDefault()
                toggleCodeBlock()
            }}
        >
            <Code2 />
        </button>

    )
}

export default CodeBlockButton