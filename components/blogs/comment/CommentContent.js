"use client";
import React, { useContext, useState } from "react";
import styles from './CommentContent.module.css';
import { MessageCircle } from 'lucide-react';
import { BiCaretRight, BiCaretDown, BiSolidHeart, BiHeart } from 'react-icons/bi';
import { DateInterval } from '../../../components/utils/DateComponent';
import { parseEmojiCode } from '../../../components/assembly/comment-editor/EmojiBtn';
import Image from 'next/image';
import { CommentEditor } from '../../comment-editor';
import { useKeyboardEvent } from '@/components/utils/GeneralEvent';
import { FormattedMessage } from 'react-intl';
import { useComment } from './../CommentContext';

export default function CommentContent({ commentRef, handlePublish: handlePublish }) {
    // 从上下文获取文章数据
    const { comments, commentRecordNum } = useComment();

    return (
        <div ref={commentRef} className={styles.comment_container}>
            <div className={styles.commentHeader}>
                <div>
                    <FormattedMessage id="commentsTitle" values={{ count: commentRecordNum }} />
                </div>
                <div className={styles.btn_group}>
                    <button className={styles.active}>
                        <FormattedMessage id="btn_group_top" />
                    </button>
                    <button>
                        <FormattedMessage id="btn_group_latest" />
                    </button>
                </div>
            </div>
            <div className={styles.commentList}>
                {comments?.map(comment => (
                    <div key={comment.id} className={styles.commentItem}>
                        <CommentItem comment={comment} handlePublish={handlePublish} />
                    </div>
                ))}
            </div>
            <div className={styles.commentBottom}>
                <div className={`d_c_c ${styles.loadBtn}`}>
                    <FormattedMessage id="load_mode" />
                    <BiCaretDown />
                </div>
            </div>
        </div>
    );
}


const CommentItem = ({ comment, handlePublish }) => {

    const { refresh } = useComment();
    const [isLoading, setIsLoading] = useState(false);
    const [isEditorVisible, setIsEditorVisible] = useState(false);
    const [isUnfold, setIsUnfold] = useState(false); // 是否展开
    const { user, checkLogin } = useContext(UserContext); // 获取上下文中的用户信息
    const [showSubComments, setShowSubComments] = useState(false);

    const toggleEditorVisibility = () => {
        setIsEditorVisible(!isEditorVisible);
    };
    const publishCallback = async (text, files) => {
        setIsLoading(true);
        await handlePublish(text, files, comment.id, comment.parent_id == 0 ? comment.id : comment.parent_id)
        setIsLoading(false);
        setIsEditorVisible(false);
    };

    const handleLikeClick = async () => {
        if (!user) {
            checkLogin()// 打开用户登录
            return
        }

        let saveData = {
            post_id: comment.post_id,
            type: 1,// 1-评论类型
            type_index: 0,
            liked: !comment.is_liked,
            comment_id: comment.id,
        }

        await postApi(nodeApi, `/interact/like-comment`, saveData).then((response) => {
            if (response.status === 200) {
                refresh();
            } else {
                console.error('Failed to upvote:', response.data.message);
            }
        })

    };

    useKeyboardEvent('Escape', () => { setIsEditorVisible(false) });

    const editorActiveClass = isEditorVisible ? `${styles.active}` : '';
    const likeActiveClass = comment.is_liked ? `${styles.active}` : '';
    // 根据liked字段的值决定使用哪个图标
    const LikeIcon = comment.is_liked ? BiSolidHeart : BiHeart;

    return (
        <div className={styles.item_main}>
            <div className={`${styles.commentAvatar}`}>
                <div className={styles.itme_avatar}>
                    {comment.UserDetail?.avatar_url &&
                        <Image
                            className={styles.avatar}
                            src={comment.UserDetail.avatar_url}
                            fill={true}
                            alt={comment.UserDetail.full_name}
                        />
                    }
                </div>
            </div>

            <div className={styles.itme_gruop}>
                <div className={styles.itme_title}>
                    <span>
                        {comment.UserDetail?.full_name}
                        {comment.is_author && (
                            <font className={styles.itme_title_author}>
                                <FormattedMessage id="author" />
                            </font>
                        )}
                    </span>
                    {comment.target_comment && (
                        <div className={`d_c_c`}>
                            <BiCaretRight className={styles.separator} />
                            <span>{comment.target_comment.UserDetail?.full_name}</span>
                        </div>
                    )}
                </div>

                <div className={styles.itme_content}>
                    {parseEmojiCode(comment.content)}
                    {comment.image_url && (
                        <div className={styles['review-preview']}>
                            <img
                                alt=''
                                src={comment.image_url}
                            />
                        </div>
                    )}
                </div>

                <div className={styles.itme_operate}>
                    <div className={styles.itme_else_info}>
                        <DateInterval providedDate={comment.created_at} />
                    </div>
                    <div className={styles.itme_btn_list}>
                        <button className={likeActiveClass} onClick={handleLikeClick}><LikeIcon /> {comment.like_num > 0 && (<span>{comment.like_num}</span>)}</button>
                        <button className={editorActiveClass} onClick={toggleEditorVisibility}><MessageCircle />
                            <span><FormattedMessage id="reply" /></span>
                        </button>
                    </div>
                </div>

                {isEditorVisible &&
                    <div className={styles.itme_editor}>
                        <CommentEditor onCallback={publishCallback} isLoading={isLoading} />
                    </div>
                }
                <div className={styles.itme_subcomment}>

                    {showSubComments
                        ? comment?.commentRecords?.map(subComment => (
                            <CommentItem key={subComment.id} comment={subComment} handlePublish={handlePublish} />
                        ))
                        : comment?.commentRecords?.slice(0, 3).map(subComment => (
                            <CommentItem key={subComment.id} comment={subComment} handlePublish={handlePublish} />
                        ))
                    }
                    {comment?.commentRecords?.length > 3 && !isUnfold && (
                        <button className={styles['switchShowBtn']} onClick={() => { setShowSubComments(!showSubComments); setIsUnfold(true) }}>
                            <FormattedMessage id="collapse_hint" values={{ count: comment?.commentRecords?.length - 3 }} />
                            <BiCaretDown />
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
};


