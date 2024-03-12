import Link from 'next/link';
import styles from './footer.module.css';

import { TbBrandBilibili, TbBrandZhihu, TbArrowRight } from "react-icons/tb";

export default function Footer() {
    return (
      <footer className={styles.siteFooter}>
        <div className={styles.footerContent}>
          <div className={styles.footerInfo}>
            <div className={styles.footerAttribution}>
              <h2>DeepCosmo</h2>
            </div>

            <p className={styles.footeExplanation}>
              我们鼓励合作和协作，相信在这个社区中，你将找到同样热爱创作的人们，与他们一起创造出更加令人惊叹的作品
            </p>

            <div className={styles.footerInfoFooter}>
              <a className={styles.footerLink}>
                <font>
                  <font>隐私</font>
                </font>
              </a>
              <span className={styles.footerSeparator}>
                <font>
                  <font>·</font>
                </font>
              </span>
              <a className={styles.footerLink}>
                <font>
                  <font>Cookie 设置</font>
                </font>
              </a>
              <font className={styles.footerSeparator}>
                <font>/</font>
              </font>
              <a className={styles.footerLink}>
                <font>
                  <font>政策</font>
                </font>
              </a>
              <span className={styles.footerSeparator}>
                <font>
                  <font>·</font>
                </font>
              </span>
              <a className={styles.footerSocialLink}>
                <TbBrandBilibili />
              </a>
              <a className={styles.footerSocialLink}>
                <TbBrandZhihu />
              </a>
            </div>
          </div>

          <div className={styles.footerColumn}>
            <h4>
              <Link className={styles.footerHeaderLink} href="/community">
                社区
              </Link>
            </h4>
            <div className={styles.footerListOfLinks}>
              <a>团队</a>
              <Link className={styles.footerActive} href="/community">
                热门
              </Link>
              <Link className={styles.footerActive} href="/ai">
                AI聊天
              </Link>
              <a>社区板块</a>
              <a className={styles.footerAction}>
                加入他们
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  {" "}
                  <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"></path>
                </svg>
              </a>
            </div>
          </div>

          <div className={styles.footerColumn}>
            <h4>
              <a className={styles.footerHeaderLink}>像素块</a>
            </h4>
            <div className={styles.footerListOfLinks}>
              <a>热门像素块</a>
              <a>闲置</a>
              <a>道具</a>
              <a className={styles.footerAction}>
                兑换
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  {" "}
                  <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"></path>
                </svg>
              </a>
            </div>
          </div>

          <div className={styles.footerColumn}>
            <h4>
              <a className={styles.footerHeaderLink}>产品</a>
            </h4>
            <div className={styles.footerListOfLinks}>
              <a>所有产品</a>
              <a>优秀产品</a>
              <a>免费</a>
              <a>付费</a>
              <a className={styles.footerAction}>
                添加你的
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  {" "}
                  <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    );
}