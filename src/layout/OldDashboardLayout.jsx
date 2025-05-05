import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import authHook from "../pages/useHook/authHook";
import {
  FaUser,
  FaBullhorn,
  FaMoneyBill,
  FaHistory,
  FaUserShield,
  FaHome,
} from "react-icons/fa";
import { MdApartment } from "react-icons/md";
import LoadingSpinner from "../pages/shared/LoadingSpinner";

const OldDashboardLayout = () => {
  const { user, userData, setUserData, loading, signOutUser } = authHook();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  useEffect(() => {
    fetch(`https://buildbox-server-side.vercel.app/user/${user?.email}`)
      .then((res) => res.json())
      .then((data) => setUserData(data));
  }, [user]);

  const handleSignOut = () => {
    signOutUser()
      .then(() => {
        navigate("/login", { state: { from: location } });
      })
      .catch((err) => {
        console.error("Sign-Out error:", err.message);
      });
  };

  const navLinks = {
    user: [
      { path: "profile", label: "My Profile", icon: <FaUser /> },
      { path: "announcements", label: "Announcements", icon: <FaBullhorn /> },
    ],
    member: [
      { path: "profile", label: "My Profile", icon: <FaUser /> },
      { path: "make-payment", label: "Make Payment", icon: <FaMoneyBill /> },
      {
        path: "payment-history",
        label: "Payment History",
        icon: <FaHistory />,
      },
      { path: "announcements", label: "Announcements", icon: <FaBullhorn /> },
    ],
    admin: [
      { path: "profile", label: "Admin Profile", icon: <FaUserShield /> },
      { path: "manage-members", label: "Manage Members", icon: <FaUser /> },
      {
        path: "make-announcement",
        label: "Make Announcement",
        icon: <FaBullhorn />,
      },
      {
        path: "agreement-requests",
        label: "Agreement Requests",
        icon: <FaHistory />,
      },
      {
        path: "manage-coupons",
        label: "Manage Coupons",
        icon: <FaMoneyBill />,
      },
    ],
  };

  const navOptions = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center py-3 px-5 rounded-lg transition-all duration-300 ${
              isActive
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-300 hover:bg-blue-700/50 hover:text-white"
            }`
          }
        >
          <span className="mr-3 text-lg">
            <FaHome />
          </span>
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/apartment"
          className={({ isActive }) =>
            `flex items-center py-3 px-5 rounded-lg transition-all duration-300 ${
              isActive
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-300 hover:bg-blue-700/50 hover:text-white"
            }`
          }
        >
          <span className="mr-3 text-lg">
            <MdApartment />
          </span>
          Apartment
        </NavLink>
      </li>
    </>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-blue-950">
      <aside
        className={`fixed top-0 left-0 h-full bg-gray-900/95 backdrop-blur-md text-white shadow-2xl z-50 md:static md:translate-x-0 w-72 flex flex-col border-r border-blue-800/30 transition-transform ${
          isSidebarVisible ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-blue-800/50 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            {userData?.role === "admin"
              ? "Admin Dashboard"
              : userData?.role === "member"
              ? "Member Dashboard"
              : "User Dashboard"}
          </h1>
          {user && (
            <img
              src={user?.photoURL}
              alt="User Avatar"
              className="w-12 h-12 rounded-full border-2 border-blue-500 shadow-lg"
            />
          )}
        </div>
        <nav className="mt-6 flex-1 overflow-y-auto px-4">
          <ul className="border-b border-blue-800/50 pb-4">{navOptions}</ul>
          <ul className="space-y-2 mt-4">
            {navLinks[userData?.role]?.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={`/dashboard/${link.path}`}
                  className={({ isActive }) =>
                    `flex items-center py-3 px-5 rounded-lg transition-all duration-300 ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-gray-300 hover:bg-blue-700/50 hover:text-white"
                    }`
                  }
                >
                  <span className="mr-3 text-lg">{link.icon}</span>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="p-4 mt-auto">
            {user ? (
              <button
                onClick={handleSignOut}
                className="w-full py-3 px-4 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-lg hover:from-red-600 hover:to-red-800 shadow-md transition-all"
              >
                Logout
              </button>
            ) : (
              <Link
                to={"/login"}
                className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg hover:from-green-600 hover:to-green-800 shadow-md transition-all block text-center"
              >
                Login
              </Link>
            )}
          </div>
        </nav>
      </aside>

      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarVisible(!isSidebarVisible)}
          className="p-2 bg-blue-600 rounded-full shadow-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        </button>
      </div>

      <div className="flex-1">
        <nav className="bg-gray-950 p-4 shadow-lg">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <img
                src="https://i.ibb.co.com/7VL47P9/buld-Box-Logo.png"
                alt="BuildBox Logo"
                className="h-10 rounded-3xl"
              />
              <h1 className="text-xl font-bold text-white">BuildBox</h1>
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-gray-400">
                Welcome back to your dashboard
              </span>
              <div className="flex items-center space-x-2">
                <img
                  src={user?.photoURL}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full border-2 border-purple-500"
                />
                <span className="text-white">
                  {user?.displayName || "Admin"}
                </span>
                <button className="bg-gray-700 text-white p-2 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </button>
                <button className="bg-yellow-400 text-white p-2 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="bg-gray-800/50 backdrop-blur-md  shadow-inner">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default OldDashboardLayout;
