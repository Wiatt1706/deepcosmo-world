import React, { useRef, useState, useEffect } from "react"
import styles from './Toolbar.module.css';
import { BiImage } from 'react-icons/bi';
import { Loader2, MoreVertical, Heading1, Heading2, TextQuote, AlignJustify, AlignLeft, AlignRight, AlignCenter, ListOrdered, List } from 'lucide-react';
import {
    Editor,
    Transforms,
    Element as SlateElement,
} from 'slate';
import { useSlate, useSlateStatic } from 'slate-react';
import { LIST_TYPES, TEXT_ALIGN_TYPES, insertImage } from '../helpers';
import CodeBlockButton from './CodeBlockButton';
import { v4 as uuidv4 } from 'uuid';
import supabase from "../../../util/Supabase";
const PUBLIC_URL = process.env.NEXT_PUBLIC_SUPABASE_URL + '/storage/v1/object/public/deepcosmo_img/';
import { BlockButton as DLCButton } from '../../widget/DLCModule';

const Toolbar = () => {
    const [isUpload, setIsUpload] = useState(false); // 添加一个状态来跟踪上传状态
    const [showFormatToolbar, setShowFormatToolbar] = useState(false);
    const formatToolbarRef = useRef(null);

    const InsertImageButton = () => {
        const editor = useSlateStatic();
        const inputRef = useRef(null);

        const handleFileChange = async (event) => {
            const file = event.target.files[0];
            if (file) {
                setIsUpload(true)
                const filePath = `public/postImg/${uuidv4()}.jpg`;
                // 上传封面图片
                const { data, error } = await supabase.storage.from('deepcosmo_img').upload(filePath, file)

                if (data) {
                    console.log(data);
                    insertImage(editor, PUBLIC_URL + filePath);
                } else {
                    // Handle saving failure
                    console.log(error);
                }
                setIsUpload(false)
            }
        };

        return (
            <>
                <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                    ref={inputRef}
                />
                {isUpload ? (
                    <DLCButton className={styles['tooltip-icon-button']} value={<Loader2 />} autoRotate={true} />
                ) : (
                    <DLCButton className={styles['tooltip-icon-button']} value={<BiImage />} onClick={() => { inputRef.current.click() }} />
                )}
            </>
        );
    };

    const toggleBlock = (editor, format) => {
        const isActive = isBlockActive(
            editor,
            format,
            TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
        );

        const isList = LIST_TYPES.includes(format);
        Transforms.unwrapNodes(editor, {
            match: n =>
                !Editor.isEditor(n) &&
                SlateElement.isElement(n) &&
                LIST_TYPES.includes(n.type) &&
                !TEXT_ALIGN_TYPES.includes(format),
            split: true,
        })

        let newProperties;
        if (TEXT_ALIGN_TYPES.includes(format)) {

            newProperties = {
                align: isActive ? undefined : format,
            };
        } else {
            newProperties = {
                type: isActive ? 'paragraph' : isList ? 'list-item' : format,
            };
        }

        Transforms.setNodes(editor, newProperties);

        if (!isActive && isList) {
            const block = { type: format, children: [] };
            Transforms.wrapNodes(editor, block);
        }
    };

    const isBlockActive = (editor, format, blockType = 'type') => {
        const { selection } = editor
        if (!selection) return false

        const [match] = Array.from(
            Editor.nodes(editor, {
                at: Editor.unhangRange(editor, selection),
                match: n =>
                    !Editor.isEditor(n) &&
                    SlateElement.isElement(n) &&
                    n[blockType] === format,
            })
        )
        return !!match
    }

    const BlockButton = ({ format, icon }) => {
        const editor = useSlate();
        const isActive = isBlockActive(editor, format, TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type');

        return (
            <button
                className={`${isActive ? styles['tooltip-icon-button-active'] : styles['tooltip-icon-button']}`}
                onMouseDown={event => {
                    event.preventDefault();
                    toggleBlock(editor, format);
                }}
            >
                {icon}
            </button>
        );
    };


    useEffect(() => {
        const handleClickOutside = event => {
            if (formatToolbarRef.current && !formatToolbarRef.current.contains(event.target)) {
                setShowFormatToolbar(false);
            }
        };
        const handleKeyDown = event => {
            if (event.key === 'Escape') {
                setShowFormatToolbar(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <div className={styles['format-toolbar']} ref={formatToolbarRef}>
            <div className="d_c_c">
                <BlockButton format="heading-one" icon={<Heading1 />} />
                <BlockButton format="heading-two" icon={<Heading2 />} />
                <CodeBlockButton />
                <BlockButton format="block-quote" icon={<TextQuote />} />
                <BlockButton format="numbered-list" icon={<ListOrdered />} />
                <BlockButton format="bulleted-list" icon={<List />} />
                <InsertImageButton />
            </div>
            <div>
                <button
                    className={`${showFormatToolbar ? styles['tooltip-icon-button-active'] : styles['tooltip-icon-button']}`}
                    onMouseDown={event => {
                        event.preventDefault();
                        setShowFormatToolbar(!showFormatToolbar);
                    }}
                >
                    <MoreVertical />
                </button>
                {showFormatToolbar && (
                    <div className={styles['format-toolbar-unnecessary']}>
                        <BlockButton format="left" icon={<AlignLeft />} />
                        <BlockButton format="center" icon={<AlignCenter />} />
                        <BlockButton format="right" icon={<AlignRight />} />
                        <BlockButton format="justify" icon={<AlignJustify />} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Toolbar