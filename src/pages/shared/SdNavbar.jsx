import { useContext, useEffect, useState, useRef } from "react";
import {
  FaSun,
  FaMoon,
  FaUserCircle,
  FaGavel,
  FaBloggerB,
} from "react-icons/fa";
import { IoMdContact } from "react-icons/io";
import { FiInfo } from "react-icons/fi";
import { Bell } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { AuthContexts } from "../authProvider/AuthProvider";

const SdNavbar = () => {
  const { user, theme, toggleTheme } = useContext(AuthContexts);
  const isDarkMode = true;
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const getNavLinkClass = (path) =>
    location.pathname === path
      ? isDarkMode
        ? "flex items-center gap-3 py-2 px-3 rounded-lg bg-indigo-700/60 text-white font-bold shadow-md"
        : "flex items-center gap-3 py-2 px-3 rounded-lg bg-indigo-200 text-indigo-900 font-bold shadow-md"
      : isDarkMode
      ? "flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-indigo-800/40 text-indigo-100"
      : "flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-indigo-100 text-indigo-800";

  const navRoutes = [
    { path: "/", label: "Home", icon: null },
    ...(user?.email
      ? [
          {
            path: "/auction",
            label: "Auction",
            icon: <FaGavel className="w-5 h-5" />,
          },
        ]
      : []),
    {
      path: "/aboutUs",
      label: "About Us",
      icon: <FiInfo className="w-5 h-5" />,
    },
    { path: "/blogs", label: "Blog", icon: <FaBloggerB className="w-5 h-5" /> },
    {
      path: "/contactUs",
      label: "Contact Us",
      icon: <IoMdContact className="w-5 h-5" />,
    },
  ];

  return (
    <div>
      <nav
        className={`fixed top-0 w-full z-50 shadow-lg transition-all duration-300 ${
          isScrolled
            ? isDarkMode
              ? "backdrop-blur-md bg-gray-900/30 shadow-lg"
              : "backdrop-blur-md bg-purple-800/80 shadow-lg"
            : isDarkMode
            ? "bg-gray-900/90"
            : "bg-purple-800/70"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center px-4 py-2">
          <Link to="/" className="relative group">
            <div className="flex items-center">
              <div className="relative overflow-hidden rounded-full">
                <img
                  className="w-14 mt-4 lg:w-14 transition-transform duration-300 group-hover:scale-110"
                  src="https://i.ibb.co.com/7VL47P9/buld-Box-Logo.png"
                  alt="Build Box Logo"
                />
              </div>
              <h1 className="font-bold text-lg md:text-xl lg:text-2xl tracking-tight">
                <span
                  className={`${
                    isDarkMode
                      ? "text-transparent bg-clip-text bg-white border-b-2 border-purple-600"
                      : "text-transparent bg-clip-text bg-white border-purple-600 border-b-2"
                  } font-serif`}
                >
                  Build
                </span>
                <span className="text-white transition-all duration-500 group-hover:tracking-wider">
                  {" "}
                  Box
                </span>
              </h1>
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/0 to-purple-700/0 group-hover:from-purple-500/10 group-hover:to-purple-700/10 rounded-lg blur-lg transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
          </Link>

          <div className="hidden lg:flex justify-center flex-grow">
            <div className="flex items-center space-x-6">
              {navRoutes.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center gap-2 py-2 px-4 rounded-lg transition-all duration-300 group ${
                    location.pathname === item.path
                      ? "text-white font-bold border-b-2 border-purple-400"
                      : isDarkMode
                      ? "text-white hover:text-purple-200"
                      : "text-white hover:text-purple-100"
                  }`}
                >
                  {item.icon && (
                    <span className="transition-transform duration-300 group-hover:scale-110">
                      {item.icon}
                    </span>
                  )}
                  <span className="relative z-10 transition-transform duration-300 group-hover:transform group-hover:translate-y-[-2px]">
                    {item.label}
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-pink-500/0 to-purple-400/0 group-hover:from-pink-500/5 group-hover:to-purple-400/5 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100"></span>
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-3">
            {user?.email ? (
              <>
                <div className="relative" ref={notificationsRef}>
                  <button
                    className={`p-2 rounded-full transition-all duration-300 relative overflow-hidden ${
                      isDarkMode
                        ? "bg-indigo-800/50 text-purple-400 hover:bg-indigo-700/70"
                        : "bg-indigo-100/50 text-indigo-700 hover:bg-indigo-200/70"
                    } hover:scale-110`}
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    aria-label="Notifications"
                  >
                    <Bell className="h-5 w-5 relative z-10 transition-transform duration-300 hover:rotate-12" />
                    <div
                      className={`absolute inset-0 rounded-full transition-all duration-300 opacity-0 hover:opacity-100 ${
                        isDarkMode ? "bg-purple-400/10" : "bg-indigo-700/10"
                      }`}
                    ></div>
                  </button>
                </div>

                <button
                  className={`p-2 lg:p-2 rounded-full transition-all duration-300 relative overflow-hidden ${
                    isDarkMode
                      ? "bg-indigo-800/50 text-purple-400 hover:bg-indigo-700/70"
                      : "bg-indigo-100/50 text-indigo-700 hover:bg-indigo-200/70"
                  } hover:scale-110`}
                  onClick={toggleTheme}
                  aria-label={
                    isDarkMode ? "Switch to light mode" : "Switch to dark mode"
                  }
                >
                  {isDarkMode ? (
                    <FaSun className="text-purple-400 relative z-10 transition-transform duration-300 hover:rotate-12" />
                  ) : (
                    <FaMoon className="text-indigo-700 relative z-10 transition-transform duration-300 hover:rotate-12" />
                  )}
                  <div
                    className={`absolute inset-0 rounded-full transition-all duration-300 opacity-0 hover:opacity-100 ${
                      isDarkMode ? "bg-purple-400/10" : "bg-indigo-700/10"
                    }`}
                  ></div>
                </button>

                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center justify-center p-1 rounded-full transition-all duration-300 hover:scale-110 relative"
                  >
                    <img
                      src={
                        user?.photoURL ||
                        "https://i.ibb.co/Y75m1Mk9/Final-Boss.jpg" ||
                        "/placeholder.svg"
                      }
                      alt="Profile"
                      className="w-9 h-9 rounded-full border-2 border-pink-400 transition-all duration-300 hover:border-purple-400"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500/0 to-purple-400/0 hover:from-pink-500/20 hover:to-purple-400/20 transition-all duration-300 opacity-0 hover:opacity-100 blur-sm"></div>
                  </button>

                  {showProfileMenu && (
                    <div
                      className={`absolute right-0 mt-2 w-56 rounded-xl shadow-2xl overflow-hidden z-50 backdrop-blur-lg animate-fadeIn ${
                        isDarkMode
                          ? "bg-gradient-to-b from-indigo-800/90 to-gray-900/90 border border-indigo-700/40"
                          : "bg-gradient-to-b from-white/90 to-indigo-100/90 border border-indigo-200/40"
                      }`}
                    >
                      <div
                        className={`px-4 py-3 ${
                          isDarkMode
                            ? "border-b border-indigo-700/50"
                            : "border-b border-indigo-200/50"
                        }`}
                      >
                        <p
                          className={`font-semibold text-sm ${
                            isDarkMode ? "text-white" : "text-gray-800"
                          }`}
                        >
                          {user?.displayName || "User"}
                        </p>
                        <p
                          className={`text-xs truncate ${
                            isDarkMode ? "text-indigo-200" : "text-indigo-600"
                          }`}
                        >
                          {user?.email}
                        </p>
                      </div>

                      <Link
                        to="/dashboard"
                        className={`flex items-center gap-3 py-2 px-4 transition-all duration-200 relative overflow-hidden ${
                          isDarkMode
                            ? "text-indigo-100 hover:bg-indigo-700/70 hover:text-white"
                            : "text-indigo-800 hover:bg-indigo-100 hover:text-indigo-900"
                        }`}
                      >
                        <FaUserCircle
                          className={`${
                            isDarkMode ? "text-indigo-300" : "text-indigo-700"
                          }`}
                        />
                        <span className="relative z-10">Dashboard</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent hover:from-pink-500/5 hover:to-purple-400/5 transition-all duration-200 opacity-0 hover:opacity-100"></div>
                      </Link>

                      <Link
                        to="/dashboard/profile"
                        className={`flex items-center gap-3 py-2 px-4 transition-all duration-200 relative overflow-hidden ${
                          isDarkMode
                            ? "text-indigo-100 hover:bg-indigo-700/70 hover:text-white"
                            : "text-indigo-800 hover:bg-indigo-100 hover:text-indigo-900"
                        }`}
                      >
                        <FaUserCircle
                          className={`${
                            isDarkMode ? "text-indigo-300" : "text-indigo-700"
                          }`}
                        />
                        <span className="relative z-10">Your Profile</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent hover:from-pink-500/5 hover:to-purple-400/5 transition-all duration-200 opacity-0 hover:opacity-100"></div>
                      </Link>

                      <Link
                        to="/dashboard"
                        className={`flex items-center gap-3 py-2 px-4 transition-all duration-200 relative overflow-hidden ${
                          isDarkMode
                            ? "text-indigo-100 hover:bg-indigo-700/70 hover:text-white"
                            : "text-indigo-800 hover:bg-indigo-100 hover:text-indigo-900"
                        }`}
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <FaUserCircle
                          className={`${
                            isDarkMode ? "text-indigo-300" : "text-indigo-700"
                          }`}
                        />
                        <span className="relative z-10">Logout</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent hover:from-pink-500/5 hover:to-purple-400/5 transition-all duration-200 opacity-0 hover:opacity-100"></div>
                      </Link>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className={`relative flex items-center gap-2 py-2 px-4 rounded-lg transition-all duration-300 group ${
                  location.pathname === "/login"
                    ? "text-white font-bold border-b-2 border-purple-500"
                    : isDarkMode
                    ? "text-white hover:text-purple-200"
                    : "text-white hover:text-purple-100"
                }`}
              >
                <FaUserCircle className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                <span className="relative z-10 transition-transform duration-300 group-hover:transform group-hover:translate-y-[-2px]">
                  Login
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-pink-500/0 to-purple-400/0 group-hover:from-pink-500/5 group-hover:to-purple-400/5 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100"></span>
              </Link>
            )}
          </div>

          <div className="lg:hidden flex items-center space-x-2">
            <button
              className={`p-2 rounded-full transition-all duration-300 relative overflow-hidden ${
                mobileMenuOpen
                  ? isDarkMode
                    ? "bg-indigo-700/70 text-purple-400 border border-purple-400/40"
                    : "bg-indigo-200/70 text-indigo-900 border border-indigo-400/40"
                  : isDarkMode
                  ? "bg-indigo-800/50 text-purple-400 hover:bg-indigo-700/70"
                  : "bg-indigo-100/50 text-indigo-700 hover:bg-indigo-200/70"
              } hover:scale-110`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <svg
                  className="w-6 h-6 relative z-10 transition-transform duration-300 hover:rotate-90"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 relative z-10 transition-transform duration-300 hover:rotate-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
              <div
                className={`absolute inset-0 rounded-full transition-all duration-300 opacity-0 hover:opacity-100 ${
                  isDarkMode ? "bg-purple-400/10" : "bg-indigo-700/10"
                }`}
              ></div>
            </button>
          </div>
        </div>

        <div
          className={`lg:hidden fixed top-0 left-0 w-64 h-screen z-50 transform transition-transform duration-200 ease-in-out ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } ${
            isDarkMode
              ? "bg-gradient-to-b from-gray-900 to-indigo-900"
              : "bg-gradient-to-b from-indigo-50 to-purple-100"
          } rounded-r-xl shadow-2xl`}
        >
          <div className="relative h-full flex flex-col">
            <div className="absolute top-4 right-4 z-10">
              <button
                className={`p-2 rounded-full transition-all duration-200 ${
                  isDarkMode
                    ? "text-indigo-300 hover:bg-indigo-800/50"
                    : "text-indigo-700 hover:bg-indigo-200"
                }`}
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-transparent p-5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 flex items-center justify-center">
                  <img
                    className="w-10 h-10 mt-3 animate-pulse"
                    src="https://i.ibb.co.com/7VL47P9/buld-Box-Logo.png"
                    alt="Build Box Logo"
                  />
                </div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-400">
                  Build Box
                </h1>
              </div>

              {user?.email && (
                <div
                  className={`rounded-xl p-3 mb-6 shadow-lg ${
                    isDarkMode
                      ? "bg-indigo-800/60 border border-indigo-700/40"
                      : "bg-white/90 border border-indigo-200/40"
                  } transition-all duration-200 hover:shadow-xl`}
                >
                  <div className="flex items-center gap-2">
                    <img
                      className="w-10 h-10 rounded-full border-2 border-pink-400 p-0.5"
                      src={
                        user?.photoURL ||
                        "https://i.ibb.co/Y75m1Mk9/Final-Boss.jpg" ||
                        "/placeholder.svg"
                      }
                      alt="User profile"
                    />
                    <div>
                      <p
                        className={`font-bold text-sm ${
                          isDarkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {user?.displayName || "User"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <p
                  className={`text-xs font-semibold uppercase tracking-wider mb-2 pl-2 ${
                    isDarkMode ? "text-indigo-300" : "text-indigo-700"
                  }`}
                >
                  Navigation
                </p>
                {navRoutes.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={getNavLinkClass(item.path)}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.icon && (
                      <span
                        className={`${
                          isDarkMode ? "text-indigo-300" : "text-indigo-700"
                        }`}
                      >
                        {item.icon}
                      </span>
                    )}
                    <span>{item.label}</span>
                  </Link>
                ))}

                {user?.email && (
                  <>
                    <p
                      className={`text-xs font-semibold uppercase tracking-wider mt-4 mb-2 pl-2 ${
                        isDarkMode ? "text-indigo-300" : "text-indigo-700"
                      }`}
                    >
                      User
                    </p>
                    <Link
                      to="/dashboard"
                      className={getNavLinkClass("/dashboard")}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FaUserCircle
                        className={`${
                          isDarkMode ? "text-indigo-300" : "text-indigo-700"
                        }`}
                      />
                      <span>Dashboard</span>
                    </Link>
                  </>
                )}
              </div>

              <div
                className={`mt-4 pt-4 border-t ${
                  isDarkMode ? "border-indigo-700/40" : "border-indigo-200/40"
                }`}
              >
                {user?.email ? (
                  <Link
                    to="/dashboard"
                    className={`w-full flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-200 ${
                      isDarkMode
                        ? "bg-red-900/50 text-red-300 hover:bg-red-900/70"
                        : "bg-red-50 text-red-600 hover:bg-red-100"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FaUserCircle
                      className={`${
                        isDarkMode ? "text-red-300" : "text-red-600"
                      }`}
                    />
                    <span>Logout</span>
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className={`w-full flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-200 ${
                      isDarkMode
                        ? "bg-indigo-700/70 text-white hover:bg-indigo-700/90"
                        : "bg-indigo-200 text-indigo-900 hover:bg-indigo-300"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FaUserCircle
                      className={`${
                        isDarkMode ? "text-indigo-300" : "text-indigo-700"
                      }`}
                    />
                    <span>Login</span>
                  </Link>
                )}
              </div>

              <div
                className={`mt-4 text-center text-xs ${
                  isDarkMode ? "text-indigo-300/70" : "text-indigo-600/70"
                }`}
              >
                <p>Build Box v1.2.0</p>
              </div>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-200"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
        )}
      </nav>

      <style jsx>{`
        .shadow-glow {
          box-shadow: 0 0 8px 1px rgba(147, 51, 234, 0.3);
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: #6366f1;
          border-radius: 9999px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
};

export default SdNavbar;
