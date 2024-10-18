import { Outlet } from "react-router-dom";
import { ModeToggle } from "./components/ui/mode-toggle";

const Layout = () => {
  return (
    <div className="h-screen">
      <Outlet />
      <div className="z-50 fixed top-4 md:top-5 right-5">
        <ModeToggle />
      </div>
    </div>
  );
};

export default Layout;
