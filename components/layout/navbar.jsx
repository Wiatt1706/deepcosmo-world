import styles from "./navbar.module.css";
import AuthButtonServer from "../auth-button-server";
import { TbBell } from "react-icons/tb";

export const Navbar = () => {
  return (
    <div className={styles.toolbar_view}>
      <div className="flex items-center">{/* <NavLeftClient /> */}</div>
      <div></div>

      <div className="flex items-center">
        <div className={styles.navbar_box_item}>
          <TbBell size={20}/>
        </div>
        <AuthButtonServer />
      </div>
    </div>
  );
};
