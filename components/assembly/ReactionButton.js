import styles from './ReactionButton.module.css';

const ReactionButton = ({ post }) => {

    // 点赞数组
    let likeArray = post.like_array;
    // 点赞总数
    const totalLikes = likeArray ? likeArray.reduce((acc, currentValue) => acc + currentValue, 0) : 0;

    return (
        <>
            {totalLikes > 0 && (
                <div className={styles.storyCountLikes}>
                    {likeArray[0] > 0 && (
                        <label className={styles.likeLabel}>
                            ❤️
                        </label>
                    )}
                    {likeArray[1] > 0 && (
                        <label className={styles.likeLabel}>
                            🌭
                        </label>
                    )}
                    {likeArray[2] > 0 && (
                        <label className={styles.likeLabel}>
                            👻
                        </label>
                    )}
                    {likeArray[3] > 0 && (
                        <label className={styles.likeLabel}>
                            🚀
                        </label>
                    )}
                    <div className={styles.likeLabelText}><font>{totalLikes}</font> Reaction</div>
                </div>
            )}
        </>
    )
}

export default ReactionButton;