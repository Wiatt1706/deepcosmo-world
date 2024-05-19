import { useRef, useEffect, useState, useCallback } from 'react';
import { Editor } from 'slate';
import { useFocused } from 'slate-react';
import { BiBold, BiItalic, BiUnderline, BiCode } from 'react-icons/bi';
import styles from './MarkToolbar.module.css';
import Portal from '../../layout/Portal'
import PortalContext from '../../system/PortalContext';
import isHotkey from 'is-hotkey';
import LinkButton from './LinkButton';
import { isMultilineSelection } from './../helpers';

const HOTKEYS = {
    'mod+b': 'bold',
    'mod+i': 'italic',
    'mod+u': 'underline',
    'mod+`': 'code',
};

const MarkToolbar = ({ editor, editableNode }) => {
    const ref = useRef(null);
    const focused = useFocused();
    const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
    const [showPanel, setShowPanel] = useState(false);
    const [block, setBlock] = useState(false);
    const [isMultiline, setIsMultiline] = useState(false);

    const selectedTextRef = useRef('');
    const isMouseDownRef = useRef(false);
    const previousSelectionRef = useRef(null); // 保存先前的选区范围

    const isMarkActive = format => {
        const marks = Editor.marks(editor);
        return marks ? marks[format] === true : false;
    };

    const toggleMark = format => {
        const isActive = isMarkActive(format);
        Editor.removeMark(editor, format);
        if (!isActive) {
            Editor.addMark(editor, format, true);
        }
    };

    const MarkButton = ({ format, icon }) => {
        const isActive = isMarkActive(format);

        return (
            <button
                className={`${isActive ? styles['tooltip-icon-button-active'] : styles['tooltip-icon-button']}`}
                onMouseDown={event => {
                    event.preventDefault();
                    toggleMark(format);
                }}
            >
                {icon}
            </button>
        );
    };

    const handleSelect = useCallback(() => {
        const selectionText = window.getSelection();
        const text = selectionText.toString();
        selectedTextRef.current = text;
        const el = ref.current;
        const isShow = !text || !editableNode.contains(selectionText?.anchorNode);
        if (block) { return }
        if (!el || !editableNode || isShow) {
            setShowPanel(false);
            return;
        }
        if (!isMouseDownRef.current) {
            setShowPanel(true);
            const domRange = selectionText.getRangeAt(0);
            const rect = domRange.getBoundingClientRect();
            const parentElement = el.parentElement;
            const parentTop = parseFloat(parentElement.style.top) || 0;
            const parentLeft = parseFloat(parentElement.style.left) || 0;
            const top = `${rect.top + window.pageYOffset - parentTop - el.offsetHeight}px`;
            const left = `${rect.left + window.pageXOffset - parentLeft - el.offsetWidth / 2 + rect.width / 2}px`;
            const height = rect.height;

            // 设定工具位置
            setToolbarPosition({ top, left, height });
            // 保存当前的选区范围
            previousSelectionRef.current = domRange;
            // 判断是否存在多条块级元素
            setIsMultiline(isMultilineSelection(editor))
        }

    }, [editableNode, block, previousSelectionRef]);

    const handleMouseup = useCallback(() => {
        isMouseDownRef.current = false;
        handleSelect();
    }, [handleSelect]);

    const handleMousedown = useCallback(() => {
        isMouseDownRef.current = true;
    }, []);

    // 触发恢复编辑器选中
    const handleRestoreCheck = useCallback(() => {
        if (previousSelectionRef.current) {
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(previousSelectionRef.current);
        }
    })

    const handleKeyDown = useCallback(
        event => {
            const { key, keyCode } = event;
            if (block) { return }

            if (key === 'Backspace' || keyCode === 8 || key === 'Escape' || keyCode === 27) {
                // 处理按下了退格键的逻辑 - 隐藏掉浮动菜单
                setShowPanel(false);
            }
            // MarkButton 快捷配置
            for (const hotkey in HOTKEYS) {
                if (isHotkey(hotkey, event)) {
                    event.preventDefault();
                    const mark = HOTKEYS[hotkey];
                    toggleMark(mark);
                }
            }
        },
        [toggleMark]
    );

    useEffect(() => {
        document.addEventListener('selectionchange', handleSelect);
        window.addEventListener('scroll', handleSelect);
        window.addEventListener('resize', handleSelect);
        window.addEventListener('mouseup', handleMouseup);
        window.addEventListener('mousedown', handleMousedown);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('selectionchange', handleSelect);
            window.removeEventListener('scroll', handleSelect);
            window.removeEventListener('resize', handleSelect);
            window.removeEventListener('mouseup', handleMouseup);
            window.removeEventListener('mousedown', handleMousedown);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleMouseup, handleMousedown, handleSelect, handleKeyDown]);

    return (
        <PortalContext.Consumer>
            {parentElement => {
                const scrollTop = parentElement ? parentElement.scrollTop : 0;
                const toolbarTop = showPanel ? Math.max(parseFloat(scrollTop) + parseFloat(toolbarPosition.top), 10) : -10000;

                const parentLeft = parentElement ? parentElement.getBoundingClientRect().left : 0;
                const toolbarLeft = showPanel ? Math.max(parseFloat(toolbarPosition.left) - parseFloat(parentLeft), 10) : -10000;

                return (
                    <Portal parentElement={parentElement}>
                        <div
                            ref={ref}
                            className={styles['hovering-toolbar']}
                            style={{
                                position: 'absolute',
                                zIndex: 2,
                                top: `${toolbarTop}px`,
                                left: `${toolbarLeft}px`,
                                marginTop: '-70px',
                                opacity: `${showPanel ? 1 : 0}`,
                                backgroundColor: '#0d2236',
                                borderRadius: '4px',
                                transition: 'opacity 0.75s',
                            }}
                            onMouseDown={e => {
                                e.preventDefault();
                            }}
                        >
                            {!isMultiline && (
                                <LinkButton
                                    editor={editor}
                                    setBlock={setBlock}
                                    handleRestoreCheck={handleRestoreCheck}
                                    toolbarPosition={toolbarPosition}
                                />
                            )}
                            <MarkButton format="bold" icon={<BiBold />} />
                            <MarkButton format="italic" icon={<BiItalic />} />
                            <MarkButton format="underline" icon={<BiUnderline />} />
                            <MarkButton format="code" icon={<BiCode />} />
                        </div>
                    </Portal>
                );
            }}
        </PortalContext.Consumer>
    );
};

export default MarkToolbar;
