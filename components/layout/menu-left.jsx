"use client";
import styles from "./menu-left.module.css";
import { LogoSvg } from "../utils/icons";
import { TbChevronsLeft, TbChevronsRight } from "react-icons/tb";
import { useState } from "react";
import { Link } from "@nextui-org/link";

export default function MenuLeft() {
  const [menuVisible, setMenuVisible] = useState(true);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <>
      {menuVisible ? (
        <div
          className={styles.menuLeft}
          style={{ display: menuVisible ? "block" : "none" }}
        >
          <div className=" w-full flex items-center justify-between p-3 mb-2">
            <LogoSvg width={25} height={25} />
            <div className="cursor-pointer" onClick={toggleMenu}>
              <TbChevronsLeft size={23} />
            </div>
          </div>
          <div className="px-3 pb-2">
            <div className={styles.menuItemActive}>
              <div className="px-2">🎪</div>
              Home
            </div>
          </div>
          <hr />
          <div className="px-3 pt-2">
            <Link href="/community" color="foreground" className={styles.menuItem}>
              <div className="px-2">🌲</div>
              社区
            </Link>
            <Link href="/ai" color="foreground" className={styles.menuItem}>
              <div className="px-2">✨</div>
              Gemini人工智能
            </Link>
            {/* <div className={styles.menuItem}>
              <div className="px-2">🌲</div>
              My Land
            </div>
            <div className={styles.menuItem}>
              <div className="px-2">💎</div>
              Resource
            </div> */}
          </div>
        </div>
      ) : (
        <div
          className={
            styles.menuChevronsRight +
            " absolute top-0 left-0 flex items-center justify-between p-3 mb-2"
          }
        >
          <div className="cursor-pointer" onClick={toggleMenu}>
            <TbChevronsRight size={23} />
          </div>
        </div>
      )}
    </>
  );
}
