import { clsx } from 'clsx';
import Link from 'next/link';
import styles from '@/styles/community/Groups.module.css';

export default function Groups({ allPostsData }) {
    return (

        <div className={clsx([styles.communityTrending, styles.communitySidebarSection])} >
            <h2 className={styles.sidebarHeader}>
                <a href="/meetups" id="ember41" className={styles.sidebarHeaderlink}>
                    <label>Groups</label>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="ember42">
                        <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"></path>
                    </svg>
                </a>
            </h2>

            <div className={styles.communityGroupsList}>
               
                <div className={styles.communityGroup}>
                    <a className={styles.communityGroupsLink}>

                     

                        <span>ge.googleapis</span>

                        <button className={styles.communityGroupsButton}>Join</button>
                    </a>
                </div>
            </div>
        </div>

    );
}