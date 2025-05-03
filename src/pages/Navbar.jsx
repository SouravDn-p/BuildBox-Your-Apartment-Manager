import { useContext } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { AuthContexts } from "../authProvider/AuthProvider";

const Navbar = () => {
  const { user, signOutUser } = useContext(AuthContexts);
  const navigate = useNavigate();
  const location = useLocation();
  const navOptions = (
    <>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      <li>
        <NavLink to="/apartment">Apartment</NavLink>
      </li>
      <li>
        <NavLink to="/dashboard">Dashboard</NavLink>
      </li>
    </>
  );

  const handleSignOut = () => {
    signOutUser()
      .then(() => {
        navigate("/login", { state: { from: location } });
      })
      .catch((err) => {
        console.error("Sign-Out error:", err.message);
      });
  };

  const isDashboard = location.pathname === "/dashboard";
  return (
    <div
      className="mx-auto max-w-screen-lg"
      style={{ backgroundColor: "#9538E2" }}
    >
      {!isDashboard && (
        <div className="navbar fixed z-10 bg-opacity-30 max-w-screen-lg bg-black text-white">
          <div className="navbar-start">
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle md:hidden"
              >
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
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow md:hidden"
              >
                {navOptions}
              </ul>
            </div>

            <NavLink to="/">
              <img
                src="https://i.ibb.co.com/7VL47P9/buld-Box-Logo.png"
                alt="Ride BD Logo"
                className="h-12 ml-2 rounded-full"
              />
            </NavLink>
            <NavLink
              to="/"
              className="text-sm md:text-2xl font-bold text-primary ml-2"
              style={{ color: "white" }}
            >
              BUILD BOX
            </NavLink>
          </div>
          <div className="hidden md:flex navbar-center gap-5">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-lg ${
                  isActive ? "text-primary font-semibold" : "hover:text-primary"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/apartment"
              className={({ isActive }) =>
                `text-lg ${
                  isActive ? "text-primary font-semibold" : "hover:text-primary"
                }`
              }
            >
              Apartment
            </NavLink>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `text-lg ${
                  isActive ? "text-primary font-semibold" : "hover:text-primary"
                }`
              }
            >
              Dashboard
            </NavLink>
          </div>
          <div className="navbar-end">
            {user ? (
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <img
                    src={user?.photoURL}
                    alt="User Avatar"
                    className="w-10 rounded-full"
                  />
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                >
                  <li>
                    <span className="text-gray-700 font-semibold">
                      {user?.name}
                    </span>
                  </li>
                  <li>
                    <NavLink to="/dashboard">Dashboard</NavLink>
                  </li>
                  <li>
                    <button onClick={handleSignOut}>Logout</button>
                  </li>
                </ul>
              </div>
            ) : (
              <NavLink to="/login" className="btn">
                Login
              </NavLink>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
