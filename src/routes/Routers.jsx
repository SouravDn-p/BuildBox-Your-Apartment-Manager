import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import DashboardLayout from "../layout/DashboardLayout.jsx";
import ErrorPage from "../pages/ErrorPage";
import Login from "../authPages/Login";
import Register from "../authPages/Register";
import PrivateRoute from "./PrivateRoute";
import axios from "axios";
import Home from "../pages/home/Home.jsx";
import Apartment from "../pages/Apartment/Apartment.jsx";
import MyProfileInfo from "../pages/dashboard/DashboardShared/MyProfileInfo.jsx";
import Announcements from "../pages/dashboard/DashboardShared/Announcements";
import MakePayment from "../pages/dashboard/member/MakePayment";
import PaymentHistory from "../pages/dashboard/member/PaymentHistory";
import ManageCoupons from "../pages/dashboard/admin/ManageCoupons";
import AgreementRequests from "../pages/dashboard/admin/AgreementRequests";
import MakeAnnouncement from "../pages/dashboard/admin/MakeAnnouncement";
import ManageMembers from "../pages/dashboard/admin/ManageMembers.jsx";
import Payment from "../pages/dashboard/member/Payment.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        index: true,
        element: <Home />,
        loader: () => fetch(`https://buildbox-server-side.vercel.app/coupons`),
      },
      {
        path: "/home",
        element: <Home />,
        loader: () => fetch(`https://buildbox-server-side.vercel.app/coupons`),
      },
      {
        path: "/apartment",
        element: <Apartment />,
        loader: () =>
          fetch("https://buildbox-server-side.vercel.app/apartments"),
      },
      {
        path: "/dashboard",
        element: (
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        ),
        loader: () => fetch(`https://buildbox-server-side.vercel.app/users`),
        children: [
          {
            index: true,
            element: (
              <PrivateRoute>
                <MyProfileInfo />
              </PrivateRoute>
            ),
            loader: () =>
              fetch("https://buildbox-server-side.vercel.app/apartments"),
          },
        ],
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        path: "profile",
        element: <MyProfileInfo />,
        loader: () =>
          fetch("https://buildbox-server-side.vercel.app/apartments"),
      },
      {
        path: "announcements",
        element: (
          <PrivateRoute>
            <Announcements />
          </PrivateRoute>
        ),
        loader: () =>
          fetch("https://buildbox-server-side.vercel.app/announcements"),
      },
      {
        path: "make-payment",
        element: (
          <PrivateRoute>
            <MakePayment />
          </PrivateRoute>
        ),
        loader: () =>
          fetch("https://buildbox-server-side.vercel.app/agreements"),
      },
      {
        path: "payment",
        element: (
          <PrivateRoute>
            <Payment />
          </PrivateRoute>
        ),
        loader: () => fetch("https://buildbox-server-side.vercel.app/coupons"),
      },
      {
        path: "payment-history",
        element: (
          <PrivateRoute>
            <PaymentHistory />
          </PrivateRoute>
        ),
        loader: () =>
          fetch("https://buildbox-server-side.vercel.app/paymentHistory"),
      },
      {
        path: "manage-members",
        element: (
          <PrivateRoute>
            <ManageMembers />
          </PrivateRoute>
        ),
        loader: () => fetch("https://buildbox-server-side.vercel.app/users"),
      },
      {
        path: "make-announcement",
        element: (
          <PrivateRoute>
            <MakeAnnouncement />
          </PrivateRoute>
        ),
      },
      {
        path: "agreement-requests",
        element: (
          <PrivateRoute>
            <AgreementRequests />
          </PrivateRoute>
        ),
        loader: () =>
          fetch("https://buildbox-server-side.vercel.app/apartments"),
      },
      {
        path: "manage-coupons",
        element: (
          <PrivateRoute>
            <ManageCoupons />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);
