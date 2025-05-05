import { Outlet, useLocation } from "react-router-dom";
import Footer from "../pages/Footer";
import SdNavbar from "../pages/shared/SdNavbar";

export default function Main() {
  const location = useLocation();
  const isLogin =
    location.pathname.includes("login") ||
    location.pathname.includes("register") ||
    location.pathname.includes("dashboard");
  return (
    <div>
      {isLogin || <SdNavbar />}
      <Outlet />
      {isLogin || <Footer />}
    </div>
  );
}
