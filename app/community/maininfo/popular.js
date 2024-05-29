import { clsx } from 'clsx';
import styles from '@/styles/community/Maininfo01.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import RippleEffect from '../../../components/widget/RippleEffect';
import ReactionButton from '../../../components/blogs/ReactionButton';

const PUBLIC_URL = process.env.NEXT_PUBLIC_SUPABASE_URL +'/storage/v1/object/public/deepcosmo_img/';
export default function Popular({ posts }) {

    return (
        <div className={styles.topItems}>
            {posts && posts.map((post, index) => (
                <RippleEffect key={post.id} className={clsx([styles.feedItemPro, styles.storyItem])}>
                    <Link href={`/blogs/${post.id}`} className={clsx([styles.feedItem])}>

                        <div className={styles.storyTextLink}>
                            <h3>{post.title}</h3>
                            <p>{post.description}</p>
                        </div>

                        {post.banner_img_url && (<div className={styles.storyImageLink}>
                            <Image
                                width={175}
                                height={116}
                                alt={post.title}
                                src={PUBLIC_URL+post.banner_img_url}
                            />
                        </div>)}

                        <div className={styles.storyCounts}>
                            <ReactionButton post={post} />
                            {post.comment_record_num > 0 && (
                                <div className={styles.storyCount}>
                                    <MessageCircle className={styles.storyCountsIcon} />
                                    <font>{post.comment_record_num}</font>
                                </div>
                            )}
                        </div>

                    </Link>
                </RippleEffect>
            ))}
        </div>
    );
}


