import AuthButtonServer from "./auth-button-server";
import NavLeftClient from "./nav-left-client";
export const Navbar = () => {
  return (
    <div className="toolbar_view">
      <div className="flex items-center">
        {/* <NavLeftClient /> */}
      </div>
      <div></div>

      <div className="flex items-center">
        <AuthButtonServer />
      </div>
    </div>
  );
};
