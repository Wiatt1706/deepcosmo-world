// LikesContext.js
import React, { useEffect, createContext, useContext, useState } from 'react';
const LikesContext = createContext();

export const useLikes = () => {
    return useContext(LikesContext);
};

export const LikesProvider = ({ children, post }) => {

    const [likesActive, setLikesActive] = useState(false); // 是否激活-喜欢
    const [eatingActive, setEatingActive] = useState(false); // 是否激活-吃瓜
    const [playfulActive, setPlayfulActive] = useState(false); // 是否激活-调皮
    const [hotActive, setHotActive] = useState(false); // 是否激活-火热

    // 操作记录清单
    const [likeActions, setLikeActions] = useState([]);

    // 点赞数组
    const defaultLikeArray = Array.from(
        { length: Math.max(4, (post?.like_array?.length || 0)) },
        (_, index) => (post?.like_array?.[index] || 0)
    );

    const [likeArray, setLikeArray] = useState(defaultLikeArray); // 初始化为post中的likeArray，并补零至长度四

    // 是否抵制
    const [isReject, setIsReject] = useState(false);

    // 点赞总数
    const totalLikes = likeArray.reduce((acc, currentValue) => acc + currentValue, 0);

    // 调用点赞接口
    const callUpvoteApi = async () => {
        if (!likeActions || likeActions.length <= 0) {
            return
        }
        setLikeActions([])

        console.log(likeActions);

        await postApi(nodeApi, `/interact/like-post`, likeActions).then((response) => {
            console.log(response);
        })
    };

    // 调用抵制接口
    const callRejectApi = () => {
        put(nodeApi, `/interact/reject?postId=${post.id}`).then((response) => {
            if (!response.data.data) {
                console.error('Failed to reject:', response.message);
            }
        })
    };

    // 处理点赞操作
    const handleLikeClick = (type) => {
        if (!user) {
            checkLogin()// 打开用户登录
            return
        }
        let saveData = {
            post_id: post.id,
            type: 0,// 0-文档类型
            type_index: type,
        }
        const newLikeArray = [...likeArray];

        switch (type) {
            case 0:
                newLikeArray[0] += likesActive ? -1 : 1; // 切换likesActive时增加或减少值
                setLikesActive(!likesActive); // 切换喜欢的激活状态
                saveData.liked = !likesActive
                break;
            case 1:
                newLikeArray[1] += eatingActive ? -1 : 1; // 切换eatingActive时增加或减少值
                setEatingActive(!eatingActive); // 切换吃瓜的激活状态
                saveData.liked = !eatingActive
                break;
            case 2:
                newLikeArray[2] += playfulActive ? -1 : 1; // 切换playfulActive时增加或减少值
                setPlayfulActive(!playfulActive); // 切换调皮的激活状态
                saveData.liked = !playfulActive
                break;
            case 3:
                newLikeArray[3] += hotActive ? -1 : 1; // 切换hotActive时增加或减少值
                setHotActive(!hotActive); // 切换火热的激活状态
                saveData.liked = !hotActive
                break;
            default:
                break;
        }

        setLikeArray(newLikeArray);
        setIsReject(false);
        // 判断是否已存在相同类型的操作
        const existingActionIndex = likeActions.findIndex((action) => action.typeIndex === type);

        if (existingActionIndex !== -1) {
            // 如果已存在，删除该操作
            const newLikeActions = [...likeActions];
            newLikeActions.splice(existingActionIndex, 1);
            setLikeActions(newLikeActions);
        } else {
            // 否则，添加新操作
            setLikeActions([...likeActions, saveData]);
        }
    };

    // 抵制
    const handleRejectClick = () => {
        if (!user) {
            checkLogin()// 打开用户登录
            return
        }
        const newLikeArray = [...likeArray];

        if (likesActive) {
            newLikeArray[0] += -1
        }

        if (eatingActive) {
            newLikeArray[1] += -1
        }

        if (playfulActive) {
            newLikeArray[2] += -1
        }

        if (hotActive) {
            newLikeArray[3] += -1
        }
        setLikeArray(newLikeArray);

        setLikesActive(false);
        setEatingActive(false);
        setPlayfulActive(false);
        setHotActive(false);
        setIsReject(!isReject);
        callRejectApi()
    }

    useEffect(() => {
        if (post.likeArray) {
            setLikesActive(post.likeArray[0]);
            setEatingActive(post.likeArray[1]);
            setPlayfulActive(post.likeArray[2]);
            setHotActive(post.likeArray[3]);
            setIsReject(post.isReject);
        }
    }, [post?.likeArray]);

    return (
        <LikesContext.Provider value={{ likesActive, eatingActive, playfulActive, hotActive, isReject, totalLikes, likeArray, likeActions, callUpvoteApi, handleLikeClick, handleRejectClick }}>
            {children}
        </LikesContext.Provider>
    );
};
