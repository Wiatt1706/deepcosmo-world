import styles from "./navbar.module.css";
import AuthButtonServer from "./auth-button-server";
import SearchNav from "./nav-search";
import { TbBell } from "react-icons/tb";
import { LogoSvg } from "../utils/icons";
import { Link } from "@nextui-org/link";
import { HiOutlineQueueList } from "react-icons/hi2";

export const Navbar = () => {
  return (
    <div className={styles.toolbar_view}>
      <div className="flex items-center">
        <div className="border-r border-conditionalborder-transparent  h-[48px] flex items-center px-3">
          <Link href="/">
            <LogoSvg width={25} height={25} />
          </Link>
        </div>

        <Link
          href="/community"
          className={`navbar_box_item h-[48px] flex items-center px-3 text-[#6B7280] text-[14px] hover:text-[#000]`}
        >
          <div className="px-2">🎪</div>
          社区
        </Link>

        <Link
          href="/community"
          className={`navbar_box_item h-[48px] flex items-center px-3 text-[#6B7280] text-[14px] hover:text-[#000]`}
        >
          <div className="px-2">🌲</div>
          AI工具
        </Link>

        <Link
          href="/canvas"
          className={`navbar_box_item h-[48px] flex items-center px-3 text-[#6B7280] text-[14px] hover:text-[#000]`}
        >
          <div className="px-2">🗡️</div>
          画板
        </Link>

        <Link
          href="/canvas/editor"
          className={`navbar_box_item h-[48px] flex items-center px-3 text-[#6B7280] text-[14px] hover:text-[#000]`}
        >
          <div className="px-2">📝</div>
          编辑器
        </Link>
      </div>
      <SearchNav />

      <div className="flex items-center">
        <Link
          href="/ai"
          className={`navbar_box_item h-[48px] flex items-center px-3 text-[#6B7280] text-[14px] hover:text-[#000]`}
        >
          <div className="px-2">✨</div>
        </Link>
        {/* <div className={styles.navbar_box_item}>
          <TbBell size={20} />
        </div> */}
        <AuthButtonServer />
      </div>
    </div>
  );
};
