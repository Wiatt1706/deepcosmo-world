"use client";
import { get } from '@/utils/api';
import React, { useEffect, createContext, useContext, useState } from 'react';
const CommnentContext = createContext();

export const useComment = () => {
    return useContext(CommnentContext);
};

export const CommentProvider = ({ children, post }) => {

    const [commentRecordNum, setCommentRecordNum] = useState(0); // 评论数
    const [comments, setComments] = useState([]); // 评论记录
    const [triggerRefresh, setTriggerRefresh] = useState(false);

    const refresh = () => {
        setTriggerRefresh(!triggerRefresh); // 反转状态来触发子组件
    };

    useEffect(() => {
        const getCmtyDocsComment = async () => {
            try {
                const response = await get(`/comment?postId=${post.id}`);
                if (response?.data) {
                    setComments(response.data)
                    setCommentRecordNum(response.count);
                }
            } catch (error) {
                console.error('Error retrieving post:', error);
                return null;
            }
        };
        getCmtyDocsComment();
    }, [post, triggerRefresh]); // 空依赖数组表示只在组件挂载时触发一次

    return (
        <CommnentContext.Provider value={{ commentRecordNum, comments, refresh }}>
            {children}
        </CommnentContext.Provider>
    );
};
