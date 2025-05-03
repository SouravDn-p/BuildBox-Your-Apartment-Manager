import { Outlet, useLocation } from "react-router-dom";
import Footer from "../pages/Footer";
import Navbar from "../pages/Navbar";

export default function Main() {
  const location = useLocation();
  const isLogin = location.pathname.includes('login');
  return (
    <div>
     {isLogin || <Navbar />}
      <Outlet />
     { isLogin || <Footer />}
    </div>
  );
}
