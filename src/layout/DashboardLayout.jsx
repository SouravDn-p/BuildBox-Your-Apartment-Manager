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
  FaChevronDown,
  FaChevronUp,
  FaBuilding,
} from "react-icons/fa";
import { MdApartment } from "react-icons/md";
import { ImHammer2 } from "react-icons/im";
import LoadingSpinner from "../pages/shared/LoadingSpinner";

const DashboardLayout = () => {
  const { user, userData, setUserData, loading, signOutUser } = authHook();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [openDropdown, setOpenDropdown] = useState({
    profile: false,
    announcements: false,
    payments: false,
    adminControls: false,
  });

  useEffect(() => {
    if (user?.email) {
      fetch(`https://buildbox-server-side.vercel.app/user/${user.email}`)
        .then((res) => res.json())
        .then((data) => {
          setUserData(data);
          setFetchError(null);
        })
        .catch((err) => {
          console.error("Fetch user data error:", err.message);
          setFetchError("Failed to load user data");
        });
    }
  }, [user, setUserData]);

  const handleSignOut = () => {
    signOutUser()
      .then(() => {
        navigate("/login", { state: { from: location } });
      })
      .catch((err) => {
        console.error("Sign-Out error:", err.message);
      });
  };

  const toggleDropdown = (dropdown) => {
    setOpenDropdown((prev) => ({
      ...prev,
      [dropdown]: !prev[dropdown],
    }));
  };

  const isAdmin = userData?.role === "admin";
  const isMember = userData?.role === "member";
  const isUser = userData?.role === "user";
  const isDarkMode = true; // Adjust based on your app's theme logic

  const roleColors = {
    admin: {
      primary: isDarkMode ? "indigo" : "indigo",
      secondary: isDarkMode ? "purple" : "purple",
      text: isDarkMode ? "indigo-100" : "indigo-800",
      icon: isDarkMode ? "indigo-300" : "indigo-700",
      hover: isDarkMode ? "indigo-800/40" : "indigo-100",
      active: isDarkMode ? "purple-300/50" : "purple-200/70",
    },
    member: {
      primary: isDarkMode ? "amber" : "amber",
      secondary: isDarkMode ? "orange" : "orange",
      text: isDarkMode ? "amber-100" : "amber-800",
      icon: isDarkMode ? "amber-300" : "amber-700",
      hover: isDarkMode ? "amber-800/40" : "amber-100",
      active: isDarkMode ? "orange-300/50" : "orange-200/70",
    },
    user: {
      primary: isDarkMode ? "emerald" : "blue",
      secondary: isDarkMode ? "teal" : "sky",
      text: isDarkMode ? "emerald-100" : "blue-700",
      icon: isDarkMode ? "emerald-300" : "blue-700",
      hover: isDarkMode ? "emerald-800/40" : "blue-100",
      active: isDarkMode ? "teal-300/50" : "teal-200/70",
    },
    common: {
      text: isDarkMode ? "gray-100" : "gray-800",
      icon: isDarkMode ? "gray-300" : "gray-700",
      hover: isDarkMode ? "gray-800/40" : "gray-200",
      active: isDarkMode ? "purple-300/50" : "purple-200/70",
    },
  };

  const colors = isAdmin
    ? roleColors.admin
    : isMember
    ? roleColors.member
    : isUser
    ? roleColors.user
    : roleColors.common;

  const navLinks = {
    user: [
      {
        path: "profile",
        label: "My Profile",
        icon: <FaUser size={18} />,
        dropdown: true,
        subLinks: [
          {
            path: "profile",
            label: "View Profile",
            icon: <FaUser size={16} />,
          },
        ],
      },
      {
        path: "announcements",
        label: "Announcements",
        icon: <FaBullhorn size={18} />,
      },
    ],
    member: [
      {
        path: "profile",
        label: "My Profile",
        icon: <FaUser size={18} />,
        dropdown: true,
        subLinks: [
          {
            path: "profile",
            label: "View Profile",
            icon: <FaUser size={16} />,
          },
        ],
      },
      {
        path: "make-payment",
        label: "Make Payment",
        icon: <FaMoneyBill size={18} />,
        dropdown: true,
        subLinks: [
          {
            path: "make-payment",
            label: "New Payment",
            icon: <FaMoneyBill size={16} />,
          },
        ],
      },
      {
        path: "payment-history",
        label: "Payment History",
        icon: <FaHistory size={18} />,
      },
      {
        path: "announcements",
        label: "Announcements",
        icon: <FaBullhorn size={18} />,
      },
    ],
    admin: [
      {
        path: "adminControls",
        label: "Admin Controls",
        icon: <FaUserShield size={18} />,
        dropdown: true,
        subLinks: [
          {
            path: "profile",
            label: "Admin Profile",
            icon: <FaUserShield size={16} />,
          },
          {
            path: "manage-members",
            label: "Manage Members",
            icon: <FaUser size={16} />,
          },
          {
            path: "make-announcement",
            label: "Make Announcement",
            icon: <FaBullhorn size={16} />,
          },
          {
            path: "agreement-requests",
            label: "Agreement Requests",
            icon: <FaHistory size={16} />,
          },
          {
            path: "manage-coupons",
            label: "Manage Coupons",
            icon: <FaMoneyBill size={16} />,
          },
        ],
      },
    ],
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-900">
      <aside
        className={`fixed top-0 left-0 z-20 min-h-screen overflow-y-auto w-64 p-6 shadow-xl transition-transform duration-300 md:static md:w-64 md:min-h-screen md:translate-x-0 ${
          isSidebarVisible ? "translate-x-0" : "-translate-x-full"
        } ${
          isDarkMode
            ? "bg-gradient-to-b from-gray-900 to-gray-800 text-white"
            : "bg-gradient-to-b from-violet-50 to-violet-100 text-gray-800"
        }`}
      >
        <div className="flex flex-col min-h-screen overflow-y-auto">
          {/* Logo and Title */}
          <div
            className="flex items-center gap-3 mb-8 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <div className="flex items-center space-x-4">
              <img
                src="https://i.ibb.co.com/7VL47P9/buld-Box-Logo.png"
                alt="BuildBox Logo"
                className="h-10 rounded-3xl"
              />
              <h1 className="text-xl font-bold text-white">BuildBox</h1>
            </div>
          </div>

          {/* User Profile Card */}
          <div
            className={`rounded-xl p-4 mb-8 backdrop-blur-sm transition-all hover:shadow-xl ${
              isDarkMode
                ? `bg-${colors.primary}-800/50 border-b border-${colors.primary}-700/50 hover:border-${colors.primary}-500/50`
                : `bg-white/80 border border-${colors.primary}-200/50 hover:border-${colors.primary}-300/50`
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  className="w-12 h-12 rounded-full border-2 border-pink-400 p-0.5 hover:scale-110 transition-transform"
                  src={
                    user?.photoURL ||
                    "https://i.ibb.co.com/Y75m1Mk9/Final-Boss.jpg"
                  }
                  alt="User"
                />
                <div
                  className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${
                    isDarkMode ? "border-gray-900" : "border-white"
                  } ${
                    userData?.status === "active"
                      ? "bg-green-500"
                      : "bg-yellow-500"
                  }`}
                ></div>
              </div>
              <div>
                <p
                  className={`font-bold text-sm ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  {user?.displayName || "User"}
                </p>
                <div className="flex gap-1 items-center">
                  <span
                    className={`inline-block px-2 py-0.5 bg-gradient-to-r from-${
                      colors.primary
                    }-500 to-${colors.secondary}-500 rounded-full ${
                      isDarkMode ? "text-white" : "text-black"
                    } text-xs font-semibold mt-1 capitalize`}
                  >
                    {userData?.role || "Guest"}
                  </span>
                  <span
                    className={`text-xs opacity-70 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    v1.2.0
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Fetch Error Message */}
          {fetchError && (
            <div className="text-red-400 text-sm mb-4">{fetchError}</div>
          )}

          {/* Navigation Links Section */}
          <div className="space-y-1 flex-1">
            {isAdmin && (
              <div className="space-y-1">
                <p
                  className={`text-xs font-semibold uppercase tracking-wider mb-2 pl-2 text-${colors.icon}`}
                >
                  Admin Controls
                </p>
                {navLinks.admin.map((link) => (
                  <div key={link.path}>
                    {link.dropdown ? (
                      <>
                        <button
                          onClick={() => toggleDropdown(link.path)}
                          className={`flex items-center justify-between w-full py-2.5 px-3 rounded-lg transition-all duration-200 hover:bg-${colors.hover} text-${colors.text}`}
                        >
                          <div className="flex items-center gap-3">
                            {link.icon}
                            <span>{link.label}</span>
                          </div>
                          {openDropdown[link.path] ? (
                            <FaChevronUp
                              size={14}
                              className={`text-${colors.icon}`}
                            />
                          ) : (
                            <FaChevronDown
                              size={14}
                              className={`text-${colors.icon}`}
                            />
                          )}
                        </button>
                        {openDropdown[link.path] && (
                          <div className="ml-4 space-y-1 mt-1">
                            {link.subLinks.map((subLink) => (
                              <NavLink
                                key={subLink.path}
                                to={`/dashboard/${subLink.path}`}
                                className={({ isActive }) =>
                                  `flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-200 shadow-sm hover:scale-105 ${
                                    isActive
                                      ? `bg-${colors.active} ${
                                          isDarkMode
                                            ? "text-white"
                                            : "text-gray-800"
                                        } font-bold`
                                      : `hover:bg-${colors.hover} text-${colors.text}`
                                  }`
                                }
                              >
                                {subLink.icon}
                                <span>{subLink.label}</span>
                              </NavLink>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <NavLink
                        to={`/dashboard/${link.path}`}
                        className={({ isActive }) =>
                          `flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 shadow-sm hover:scale-105 ${
                            isActive
                              ? `bg-${colors.active} ${
                                  isDarkMode ? "text-white" : "text-gray-800"
                                } font-bold`
                              : `hover:bg-${colors.hover} text-${colors.text}`
                          }`
                        }
                      >
                        {link.icon}
                        <span>{link.label}</span>
                      </NavLink>
                    )}
                  </div>
                ))}
              </div>
            )}

            {isMember && (
              <div className="space-y-1 w-full">
                <p
                  className={`text-xs font-semibold uppercase tracking-wider mb-2 pl-2 text-${colors.icon}`}
                >
                  Member Dashboard
                </p>
                {navLinks.member.map((link) => (
                  <div key={link.path}>
                    {link.dropdown ? (
                      <>
                        <button
                          onClick={() => toggleDropdown(link.path)}
                          className={`flex items-center justify-between w-full py-2.5 px-3 rounded-lg transition-all duration-200 hover:bg-${colors.hover} text-${colors.text}`}
                        >
                          <div className="flex items-center gap-3">
                            {link.icon}
                            <span>{link.label}</span>
                          </div>
                          {openDropdown[link.path] ? (
                            <FaChevronUp
                              size={14}
                              className={`text-${colors.icon}`}
                            />
                          ) : (
                            <FaChevronDown
                              size={14}
                              className={`text-${colors.icon}`}
                            />
                          )}
                        </button>
                        {openDropdown[link.path] && (
                          <div className="ml-4 space-y-1 mt-1">
                            {link.subLinks.map((subLink) => (
                              <NavLink
                                key={subLink.path}
                                to={`/dashboard/${subLink.path}`}
                                className={({ isActive }) =>
                                  `flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-200 shadow-sm hover:scale-105 ${
                                    isActive
                                      ? `bg-${colors.active} ${
                                          isDarkMode
                                            ? "text-white"
                                            : "text-gray-800"
                                        } font-bold`
                                      : `hover:bg-${colors.hover} text-${colors.text}`
                                  }`
                                }
                              >
                                {subLink.icon}
                                <span>{subLink.label}</span>
                              </NavLink>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <NavLink
                        to={`/dashboard/${link.path}`}
                        className={({ isActive }) =>
                          `flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 shadow-sm hover:scale-105 ${
                            isActive
                              ? `bg-${colors.active} ${
                                  isDarkMode ? "text-white" : "text-gray-800"
                                } font-bold`
                              : `hover:bg-${colors.hover} text-${colors.text}`
                          }`
                        }
                      >
                        {link.icon}
                        <span>{link.label}</span>
                      </NavLink>
                    )}
                  </div>
                ))}
              </div>
            )}

            {isUser && (
              <div className="space-y-1 h-full">
                <p
                  className={`text-xs font-semibold uppercase tracking-wider mb-2 pl-2 text-${colors.icon}`}
                >
                  User Dashboard
                </p>
                {navLinks.user.map((link) => (
                  <div key={link.path}>
                    {link.dropdown ? (
                      <>
                        <button
                          onClick={() => toggleDropdown(link.path)}
                          className={`flex items-center justify-between w-full py-2.5 px-3 rounded-lg transition-all duration-200 hover:bg-${colors.hover} text-${colors.text}`}
                        >
                          <div className="flex items-center gap-3">
                            {link.icon}
                            <span>{link.label}</span>
                          </div>
                          {openDropdown[link.path] ? (
                            <FaChevronUp
                              size={14}
                              className={`text-${colors.icon}`}
                            />
                          ) : (
                            <FaChevronDown
                              size={14}
                              className={`text-${colors.icon}`}
                            />
                          )}
                        </button>
                        {openDropdown[link.path] && (
                          <div className="ml-4 space-y-1 mt-1">
                            {link.subLinks.map((subLink) => (
                              <NavLink
                                key={subLink.path}
                                to={`/dashboard/${subLink.path}`}
                                className={({ isActive }) =>
                                  `flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-200 shadow-sm hover:scale-105 ${
                                    isActive
                                      ? `bg-${colors.active} ${
                                          isDarkMode
                                            ? "text-white"
                                            : "text-gray-800"
                                        } font-bold`
                                      : `hover:bg-${colors.hover} text-${colors.text}`
                                  }`
                                }
                              >
                                {subLink.icon}
                                <span>{subLink.label}</span>
                              </NavLink>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <NavLink
                        to={`/dashboard/${link.path}`}
                        className={({ isActive }) =>
                          `flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 shadow-sm hover:scale-105 ${
                            isActive
                              ? `bg-${colors.active} ${
                                  isDarkMode ? "text-white" : "text-gray-800"
                                } font-bold`
                              : `hover:bg-${colors.hover} text-${colors.text}`
                          }`
                        }
                      >
                        {link.icon}
                        <span>{link.label}</span>
                      </NavLink>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Fallback for No Role */}
            {!isAdmin && !isMember && !isUser && (
              <div className="space-y-1">
                <p
                  className={`text-xs font-semibold uppercase tracking-wider mb-2 pl-2 text-${colors.icon}`}
                >
                  Dashboard
                </p>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 shadow-sm hover:scale-105 ${
                      isActive
                        ? `bg-${colors.active} ${
                            isDarkMode ? "text-white" : "text-gray-800"
                          } font-bold`
                        : `hover:bg-${colors.hover} text-${colors.text}`
                    }`
                  }
                >
                  <FaHome size={18} className={`text-${colors.icon}`} />
                  <span>Dashboard</span>
                </NavLink>
              </div>
            )}
          </div>

          {/* Common Links */}
          <div
            className={`mt-6 pt-6 border-t ${
              isDarkMode ? "border-indigo-700/50" : "border-indigo-200/50"
            }`}
          >
            <p
              className={`text-xs font-semibold uppercase tracking-wider mb-2 pl-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Common
            </p>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 shadow-sm hover:scale-105 ${
                  isActive
                    ? `bg-${roleColors.common.active} ${
                        isDarkMode ? "text-white" : "text-gray-800"
                      } font-bold`
                    : `hover:bg-${roleColors.common.hover} text-${roleColors.common.text}`
                }`
              }
            >
              <FaHome size={20} className={`text-${roleColors.common.icon}`} />
              <span>Home</span>
            </NavLink>
            <NavLink
              to="/apartment"
              className={({ isActive }) =>
                `flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 shadow-sm hover:scale-105 ${
                  isActive
                    ? `bg-${roleColors.common.active} ${
                        isDarkMode ? "text-white" : "text-gray-800"
                      } font-bold`
                    : `hover:bg-${roleColors.common.hover} text-${roleColors.common.text}`
                }`
              }
            >
              <MdApartment
                size={20}
                className={`text-${roleColors.common.icon}`}
              />
              <span>Apartment</span>
            </NavLink>
          </div>

          {/* Logout Button */}
          <div className="p-4 mt-auto">
            {user ? (
              <button
                onClick={handleSignOut}
                className={`w-full py-3 px-4 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-lg hover:from-red-600 hover:to-red-800 shadow-md transition-all`}
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className={`w-full py-3 px-4 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg hover:from-green-600 hover:to-green-800 shadow-md transition-all block text-center`}
              >
                Login
              </Link>
            )}
          </div>

          {/* Version Info */}
          <div
            className={`mt-auto pt-6 text-center text-xs ${
              isDarkMode ? "text-indigo-300/70" : "text-indigo-600/70"
            }`}
          >
            <p>BuildBox v1.2.0</p>
            <p className="text-[10px] mt-1">© 2025 All Rights Reserved</p>
          </div>
        </div>
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
              d={
                isSidebarVisible
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h7"
              }
            />
          </svg>
        </button>
      </div>

      <div className="flex-1">
        <nav className="bg-gray-900 p-4 shadow-lg">
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
              <div className="flex items-center space-x-2">
                <img
                  src={user?.photoURL}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full border-2 border-purple-500"
                />

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
              </div>
            </div>
          </div>
        </nav>

        <main className="bg-gray-800/50 backdrop-blur-md shadow-inner ">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
