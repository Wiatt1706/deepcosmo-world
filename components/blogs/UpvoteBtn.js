"use client"
import { useEffect, useState, useRef } from 'react';
import { clsx } from 'clsx';
import styles from './UpvoteBtn.module.css';
import { BiCaretUp, BiCaretDown } from 'react-icons/bi';
import { useLikes } from './LikesContext';
import { useKeyboardEvent } from '@/components/utils/GeneralEvent';
import { FormattedMessage } from 'react-intl';

export default function UpvoteBtn() {

    const { likesActive, eatingActive, playfulActive, hotActive, isReject, totalLikes, likeArray, likeActions, callUpvoteApi, handleLikeClick, handleRejectClick } = useLikes();
    const hideTimeout = useRef(null);
    const [showActions, setShowActions] = useState(false);

    const handUpvoteClick = (type) => {
        clearTimeout(hideTimeout.current);
        handleLikeClick(type);
    };

    useKeyboardEvent('Escape', () => { setShowActions(false) });

    useEffect(() => {
        // 当 showActions 变为 true 时，设置一个延迟隐藏的定时器
        if (showActions) {
            hideTimeout.current = setTimeout(() => {
                setShowActions(false);
                callUpvoteApi()
            }, 1500);
        } else {
            // 如果在两秒内再次操作面板，则清除之前的定时器
            clearTimeout(hideTimeout.current);
        }

        // 在组件卸载时清除定时器，以防止内存泄漏
        return () => {
            clearTimeout(hideTimeout.current);
        };
    }, [showActions, likeActions]);

    return (
        <>
            <button type="button" className={clsx([styles['button'], styles['VoteButton']], likesActive && styles['voteButton-active'])} onClick={() => handUpvoteClick(0)} onMouseEnter={() => setShowActions(true)}>
                <BiCaretUp />
                <span className={styles['button-number']}>{totalLikes}</span><span className={styles['button-text']}>
                    <FormattedMessage id="upvotes" />
                </span>
                {showActions && (
                    <div className={styles['float-actions']}>
                        <div className={clsx([styles['crayons-item'], likesActive && styles['active']])}
                            onClick={(e) => {
                                // 阻止事件继续冒泡到父元素
                                handUpvoteClick(0);
                                e.stopPropagation();
                            }}>
                            <label>❤️</label><span>{likeArray[0]}</span>
                        </div>
                        <div className={clsx([styles['crayons-item'], eatingActive && styles['active']])}
                            onClick={(e) => {
                                handUpvoteClick(1);
                                e.stopPropagation();
                            }}>
                            <label>🌭</label><span>{likeArray[1]}</span>
                        </div>
                        <div className={clsx([styles['crayons-item'], playfulActive && styles['active']])}
                            onClick={(e) => {
                                handUpvoteClick(2);
                                e.stopPropagation();
                            }}>
                            <label>👻</label><span>{likeArray[2]}</span>
                        </div>
                        <div className={clsx([styles['crayons-item'], hotActive && styles['active']])}
                            onClick={(e) => {
                                handUpvoteClick(3);
                                e.stopPropagation();
                            }}>
                            <label>🚀</label><span>{likeArray[3]}</span>
                        </div>
                    </div>
                )}
            </button>

            <button type="button" className={clsx([styles['button'], styles['VoteButton']], isReject && styles['voteButton-active'])} onClick={() => handleRejectClick()}>
                <BiCaretDown />
            </button>
        </>

    );
}

