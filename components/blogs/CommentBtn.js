import { useEffect, useState, useRef } from 'react';
import styles from './CommentBtn.module.css';
import { BiCommentDots, BiLeftArrowAlt } from 'react-icons/bi';
import { useKeyboardEvent } from '@/components/utils/GeneralEvent';
import { FormattedMessage } from 'react-intl';
import CommentSection from './comment';
import ShadowComponent from './../utils/ShadowComponent';
import { useComment } from './CommentContext';

export default function CommentBtn({ parentRef, post }) {
    const sectionRef = useRef(null);
    // 从上下文获取文章数据
    const { commentRecordNum } = useComment();
    const [isOverlayVisible, setOverlayVisible] = useState(false);
    const [actionsStyles, setActionsStyles] = useState({});

    useKeyboardEvent('Escape', () => { setOverlayVisible(false) });



    useEffect(() => {
        // 定位评论弹窗组件
        const getContentActionsStyles = () => {
            const contentRect = parentRef.current.getBoundingClientRect();
            return {
                width: `${contentRect.width + 18}px`,
                left: `${contentRect.left}px`,
            };
        };

        setActionsStyles(getContentActionsStyles());

    }, [parentRef, isOverlayVisible]);

    return (
        <>
            <ShadowComponent visible={isOverlayVisible} className="custom-overlay">
                <div ref={sectionRef} className={styles['comment-popup']}
                    style={actionsStyles}
                >
                    <header className={styles.header}>
                        <div className={styles.backBtn} onClick={() => setOverlayVisible(false)}><BiLeftArrowAlt /> <FormattedMessage id="goBack" /></div>
                        <span><FormattedMessage id="commentsTitle_replies" values={{ count: commentRecordNum }} /></span>
                    </header>
                    <CommentSection parentRef={sectionRef} post={post} />
                </div>
            </ShadowComponent>
            <button type="button" className={styles['button']} onClick={() => setOverlayVisible(true)}>
                <BiCommentDots />
                {post?.commentRecordNum > 0
                    ? <span className={styles['button-text']}>
                        {commentRecordNum}
                        <FormattedMessage id="comment" />
                    </span>
                    : <span className={styles['button-text']}>
                        <FormattedMessage id="addComments" />
                    </span>
                }
            </button>
        </>

    );
}

