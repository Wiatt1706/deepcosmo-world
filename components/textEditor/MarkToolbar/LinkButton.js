import { isLinkActive, insertLink } from './../helpers';
import { Editor, Transforms, Range } from 'slate';
import { useRef, useEffect, useState } from 'react';
import styles from './LinkButton.module.css';
import { Link2, Globe } from 'lucide-react';

const LinkButton = ({ editor, setBlock, handleRestoreCheck, toolbarPosition }) => {
    const [shadePanel, setShadePanel] = useState(false);
    const [linkValue, setLinkValue] = useState('');
    const linkInputRef = useRef(null);

    const positionTop = Math.min(parseFloat(toolbarPosition.top) + parseFloat(toolbarPosition.height), window.innerHeight - 200);
    const positionLeft = Math.max(parseFloat(toolbarPosition.left), 10)

    useEffect(() => {
        if (shadePanel) {
            linkInputRef.current.focus();
        }
    }, [shadePanel]);

    const handleLinkItemClick = event => {
        event.preventDefault();
        insertLink(editor, linkValue);
        closeLink();
        // 跳出当前link节点
        Transforms.move(editor, { unit: 'offset' })

    };

    const closeLink = () => {
        handleRestoreCheck()
        setShadePanel(false);
        setBlock(false)
        setLinkValue('')
    }
    const handleKeyDown = event => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleLinkItemClick(event);
        }
    };

    return (
        <>
            <div
                className={`${styles['hovering-link']} ${isLinkActive(editor) ? styles['hovering-link-active'] : ''}`}
                onMouseUp={event => {
                    event.preventDefault()
                    setShadePanel(true);
                    setBlock(true)
                }}
                onClick={event => {
                    event.preventDefault();
                }}
            >
                <Link2></Link2><i>link</i>
            </div>

            <div
                className={styles['toolbar-shade']}
                style={{ display: `${shadePanel ? 'block' : 'none'}` }}
                onMouseUp={event => {
                    event.preventDefault();
                    if (event.target === event.currentTarget) {
                        closeLink()
                    }
                }}
            >
                <div
                    className={styles['toolbar-link-form']}
                    style={{
                        position: 'absolute',
                        zIndex: 100,
                        top: `${positionTop}px`,
                        left: `${positionLeft}px`,
                        marginTop: '45px',
                        opacity: `${shadePanel ? 1 : 0}`,
                        transition: 'opacity 0.75s',
                    }}
                >
                    <input
                        ref={linkInputRef}
                        type="text"
                        placeholder="Paste, or fill in the link"
                        value={linkValue}
                        onChange={event => setLinkValue(event.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <div className={styles['toolbar-link-list']}>
                        <div
                            onMouseUp={handleLinkItemClick}
                            className={styles['toolbar-link-item']}
                        >
                            <Globe size={18} /> <span>Link to web page</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LinkButton;
