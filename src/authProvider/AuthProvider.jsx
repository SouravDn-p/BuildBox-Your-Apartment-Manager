// AuthProvider.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import auth from "../firebase/firebase.init";
import axios from "axios";
import { Vortex } from "react-loader-spinner";
import useAxiosPublic from "../pages/useHook/useAxiosPublic";

export const AuthContexts = createContext(null);

const AuthProvider = ({ children }) => {
  const axiosPublic = useAxiosPublic();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [couponData, setCouponData] = useState(null);
  const [currentPaymentId, setCurrentPaymentId] = useState(null);
  const [couponCode, setCouponCode] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [member, setMember] = useState([]);
  const [userData, setUserData] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Toggle between light and dark themes
    const toggleTheme = () => {
      const newTheme = theme === "light" ? "dark" : "light";
      setTheme(newTheme);
      localStorage.setItem("theme", newTheme);
      document.documentElement.setAttribute("data-theme", newTheme);
    };

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signOutUser = () => {
    setLoading(true);
    return signOut(auth).finally(() => setLoading(false));
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const user = { email: currentUser.email };
        axiosPublic
          .post("/jwt", user, {
            withCredentials: true,
          })
          .then((res) => {
            if (res.data.token) {
              localStorage.setItem("access-token", res.data.token);
            }
          });
      } else {
        setUser(null);
        axios
          .post(
            "https://buildbox-server-side.vercel.app/logout",
            {},
            { withCredentials: true }
          )
          .then((res) => console.log("Logout successful:", res.data))
          .catch((err) => console.error("Error logging out:", err));
        localStorage.removeItem("access-token");
      }
      setLoading(false);
    });

    return () => unSubscribe();
  }, []);

  const authInfo = {
    createUser,
    signInUser,
    signOutUser,
    user,
    setUser,
    loading,
    setLoading,
    couponData,
    setCouponData,
    userData,
    setUserData,
    requests,
    setRequests,
    coupons,
    setCoupons,
    member,
    setMember,
    currentPaymentId,
    setCurrentPaymentId,
    couponCode,
    setCouponCode,
  };

  return (
    <AuthContexts.Provider value={authInfo}>{children}</AuthContexts.Provider>
  );
};

export default AuthProvider;
