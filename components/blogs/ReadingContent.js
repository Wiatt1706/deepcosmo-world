import Image from 'next/image';
import ReadEditor from '../../components/textEditor/ReadEditor';
import styles from '@/styles/blogs/Read.module.css';
import Link from 'next/link';
import DateComponent from '../../components/utils/DateComponent';
import { useLikes } from './LikesContext';

const PUBLIC_URL = process.env.NEXT_PUBLIC_SUPABASE_URL + '/storage/v1/object/public/deepcosmo_img/';
export default function PostPage({ post }) {
    const pageTitle = post?.title; // 从内容中获取页面标题
    const pageDescription = post?.description; // 从内容中获取页面描述
    const pageKeywords = post.Keyword; // 从内容中获取页面关键字
    const userName = post?.UserDetail?.full_name;
    const { likeArray } = useLikes();

    return (
        <div className={styles.readEditor}>
            {post?.banner_img_url ?
                (
                    <div>
                        <div className={styles.bannerImgUrl}>
                            <img
                                alt={post.title}
                                src={PUBLIC_URL + post.banner_img_url}
                            />
                        </div>
                        <div className={styles.bannerTitle}>
                            <div className={styles.avatarShow}>
                                <a className={styles.storyAvatarLink}>
                                    <Image
                                        src={post.UserDetail?.avatar_url} // Route of the image file
                                        width={40}
                                        height={40}
                                        alt={userName}
                                    />
                                </a>
                                <div className={styles.avatarInfo}>
                                    <Link href={`/blogs/${post.id}`} className={styles.storyTextLink}>{userName}</Link>
                                    <p className="fs-xs color-base-60">
                                        {post.createDate && (
                                            <DateComponent dateString={post.createDate} label="Posted on" />
                                        )}
                                        {post.createDate && post.updateDate && ' • '}
                                        {post.updateDate && (
                                            <DateComponent dateString={post.updateDate} label="Updated on" />
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className={styles.endorseLabelVo}>
                                {likeArray[0] > 0 && (
                                    <span>
                                        ❤️ <font>{likeArray[0]}</font>
                                    </span>
                                )}
                                {likeArray[1] > 0 && (
                                    <span>
                                        🌭 <font>{likeArray[1]}</font>
                                    </span>
                                )}
                                {likeArray[2] > 0 && (
                                    <span>
                                        👻 <font>{likeArray[2]}</font>
                                    </span>
                                )}
                                {likeArray[3] > 0 && (
                                    <span>
                                        🚀 <font>{likeArray[3]}</font>
                                    </span>
                                )}
                            </div>

                            <h1>
                                {pageTitle}
                            </h1>
                            <div className={styles['bannerTagList']}>
                                <div className={styles['selectedTags']}>
                                    {pageKeywords?.map((tag) => (
                                        <div
                                            className={styles['bannerTag']}
                                            key={tag.id}
                                        >
                                            <font style={{
                                                color: `rgba(${hexToRgb(tag?.color)},0.5)`,
                                            }}>#</font>
                                            {tag.label_name}
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                ) : (
                    <div className={styles.title}>
                        {pageTitle}
                        <p>
                            by <a>{userName}</a>
                        </p>
                    </div>
                )
            }

            {post?.content && <div className={styles['readEditorContent']}><ReadEditor content={JSON.parse(post.content)} /></div>}

            <div className={styles['tagList']}>
                <div className={styles['selectedTags']}>
                    {pageKeywords?.map((tag) => (
                        <div
                            className={styles['tag']}
                            style={{
                                backgroundColor: `rgba(${hexToRgb(tag?.color)},0.5)`,
                            }}
                            key={tag.id}
                        >
                            {tag.label_name}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
}
