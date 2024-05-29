import { useContext, useState, useRef, useEffect } from 'react';
import styles from './Comment.module.css';
import CommentContent from '../../blogs/comment/CommentContent';
import CommentUserEditor from '../../comment-editor';
import { useComment } from './../CommentContext';

export default function CommentSection({ parentRef, post }) {
    const { refresh, commentRecordNum } = useComment();

    const [shouldFixActions, setShouldFixActions] = useState(false);
    const [showBottomEditor, setShowBottomEditor] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const sectionRef = useRef(null);
    const topEditorRef = useRef(null);
    const commentRef = useRef(null);
    const bottomEditorRef = useRef(null);

    // 滚动条检测
    useEffect(() => {

        const handleScroll = () => {
            setShowBottomEditor(commentRef.current?.getBoundingClientRect().height > window.innerHeight)
            if (!topEditorRef.current || !commentRef.current || !bottomEditorRef.current) return;
            const topEditorRect = topEditorRef.current.getBoundingClientRect();
            const bottomEditorRect = bottomEditorRef.current.getBoundingClientRect();
            const commentRect = commentRef.current.getBoundingClientRect();
            setShouldFixActions(commentRect.top < 0 && commentRect.bottom > window.innerHeight + bottomEditorRect.height + 30 && (topEditorRect.bottom < 0))
        }

        const handleScrollThrottled = () => {
            requestAnimationFrame(handleScroll);
        }

        handleScrollThrottled(); // 检查初始滚动位置
        window.addEventListener('scroll', handleScrollThrottled);

        if (parentRef) {
            parentRef.current.addEventListener('scroll', handleScrollThrottled);
        }
        return () => {
            window.removeEventListener('scroll', handleScrollThrottled);

        };

    }, [parentRef]);

    const getContentActionsStyles = () => {
        if (shouldFixActions) {
            const contentRect = sectionRef.current.getBoundingClientRect();
            return {
                width: `${contentRect.width}px`,
                left: `${contentRect.left}px`,
            };
        }
        return {};
    };

    const publishCallback = async (text, files, commentId, parentId) => {
        if (!user) {
            checkLogin()// 打开用户登录
            return
        }
        setIsLoading(true)
        const saveData = {
            content: text,
            post_id: post.id,
            comment_id: commentId || 0,
            parent_id: parentId || 0,
        }
        if (files.length > 0) {
            const url = await uploadImg(files[0])
            saveData.image_url = url;
        }

        const response = await apiPost(nodeApi, `/comment/add-comment`, saveData);
        setIsLoading(false)
        if (response.status !== 200) return;
        refresh(); // 刷新评论
    };

    const uploadImg = async (file) => {
        const fileExtension = file.name.slice(file.name.lastIndexOf('.') + 1); // 获取文件的后缀名
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileExtension', fileExtension);
        formData.append('bucket', "comment");

        const response = await apiPost(nodeApi, `/upload/saveImg`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.status === 200) {
            return response.data.data
        }
    }

    return (
        <div
            ref={sectionRef}
            className={`${styles.comment_actions}`}
        >
            <div ref={topEditorRef} className={styles['top_editor']}>
                <CommentUserEditor onCallback={publishCallback} isLoading={isLoading} />
            </div>

            {commentRecordNum > 0 && (
                <CommentContent commentRef={commentRef} post={post} handlePublish={publishCallback} />
            )}

            <div ref={bottomEditorRef}>
                {showBottomEditor && (
                    <div
                        className={`${styles.content_actions} ${shouldFixActions ? styles.fixed_actions : ''}`}
                        style={getContentActionsStyles()}
                    >
                        <CommentUserEditor onCallback={publishCallback} showFormatToolbarDef={false} isLoading={isLoading} />
                    </div>
                )}
            </div>

        </div>
    );
}




