"use client";
import styles from "./menu-left.module.css";
import { useState } from "react";

export default function MenuLeft({ children }: { children: React.ReactNode }) {
  const [menuVisible, setMenuVisible] = useState(true);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <>{menuVisible && <div className={styles.menuLeft}>{children}</div>}</>
  );
}
