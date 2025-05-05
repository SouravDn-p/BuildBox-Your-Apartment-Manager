import { useContext, useState, useEffect } from "react";
import { AuthContexts } from "../../../authProvider/AuthProvider";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLoaderData, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import LoadingSpinner from "../../shared/LoadingSpinner";
import {
  Mail,
  Building,
  Hash,
  DollarSign,
  Calendar,
  Tag,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 flex max-w-sm p-4 text-white rounded-lg shadow-lg animate-slideIn">
      <div
        className={`p-2 rounded-l-lg ${
          type === "success"
            ? "bg-green-500"
            : type === "error"
            ? "bg-red-500"
            : "bg-blue-500"
        }`}
      >
        {type === "success" ? (
          <CheckCircle size={20} />
        ) : (
          <AlertCircle size={20} />
        )}
      </div>
      <div className="flex-1 p-4 bg-gray-800 rounded-r-lg">
        <p className="text-gray-200">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="absolute top-1 right-1 text-gray-400 hover:text-gray-200"
      >
        <X size={16} />
      </button>
    </div>
  );
};

const Payment = () => {
  const coupons = useLoaderData();
  const navigate = useNavigate();
  const { currentPaymentId, user, couponCode, setCouponCode } =
    useContext(AuthContexts);
  const [apartmentDetails, setApartmentDetails] = useState({});
  const [discount, setDiscount] = useState(0);
  const [isCouponValid, setIsCouponValid] = useState(true);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [toast, setToast] = useState(null);
  const isDarkMode = true;

  useEffect(() => {
    const fetchApartmentDetails = async () => {
      if (!currentPaymentId) {
        setToast({ message: "No payment ID provided", type: "error" });
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await fetch(
          `https://buildbox-server-side.vercel.app/agreements/${currentPaymentId}`
        );
        if (!response.ok) throw new Error("Failed to fetch apartment details");
        const data = await response.json();
        setApartmentDetails(data);
        setSelectedDate(data.updatedAt ? new Date(data.updatedAt) : new Date());
      } catch (error) {
        setToast({
          message: "Error fetching apartment details",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchApartmentDetails();
  }, [currentPaymentId]);

  const validateCoupon = () => {
    const code = couponCode.trim();
    if (!code) {
      setToast({ message: "Please enter a coupon code", type: "error" });
      return;
    }
    setIsCouponApplied(true);
    const matchedCoupon = coupons.find(
      (coupon) => coupon.code.toUpperCase() === code.toUpperCase()
    );
    if (matchedCoupon) {
      setDiscount(parseInt(matchedCoupon.discount || 0));
      setIsCouponValid(true);
      setToast({ message: "Coupon applied successfully", type: "success" });
    } else {
      setDiscount(0);
      setIsCouponValid(false);
      setToast({ message: "Invalid coupon code", type: "error" });
    }
  };

  const clearCoupon = () => {
    setCouponCode("");
    setIsCouponApplied(false);
    setIsCouponValid(true);
    setDiscount(0);
    setToast({ message: "Coupon cleared", type: "info" });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate) {
      setToast({ message: "Please select a payment month", type: "error" });
      return;
    }
    if (isCouponApplied && !isCouponValid) {
      Swal.fire({
        icon: "error",
        title: "Invalid Coupon",
        text: "The entered coupon code is not valid.",
      });
      return;
    }

    const paymentData = {
      status: "Paid",
      user_name: user?.displayName || "N/A",
      user_email: apartmentDetails.user_email || "N/A",
      floor_no: apartmentDetails.floor_no || "N/A",
      block_name: apartmentDetails.block_name || "N/A",
      apartment_no: apartmentDetails.apartment_no || "N/A",
      month: selectedDate.toISOString().slice(0, 7),
      rent:
        isCouponApplied && isCouponValid
          ? apartmentDetails.rent - (apartmentDetails.rent * discount) / 100
          : apartmentDetails.rent,
      updatedAt: new Date(selectedDate).toISOString(),
    };

    try {
      const response = await fetch(
        "https://buildbox-server-side.vercel.app/paymentHistory",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(paymentData),
        }
      );
      const agreementResponse = await fetch(
        `https://buildbox-server-side.vercel.app/updateAgreement/${currentPaymentId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            billStatus: "Paid",
            status: "Booked",
          }),
        }
      );

      const result = await response.json();
      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Payment Successful",
          text: "Your payment has been processed successfully!",
        });
        navigate("/dashboard/profile");
      } else {
        Swal.fire({
          icon: "error",
          title: "Payment Failed",
          text: result.message || "Something went wrong.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: "An unexpected error occurred.",
      });
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <section className="w-full min-h-screen bg-gray-900 text-white">
      <style jsx="true">{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideIn {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        .react-datepicker__input-container input {
          width: 100%;
          padding: 0.5rem 2.5rem 0.5rem 2.5rem;
          border: 1px solid #4b5563;
          background: #1f2937;
          color: #f3f4f6;
          border-radius: 0.5rem;
        }
        .react-datepicker__input-container input:focus {
          outline: none;
          ring: 2px solid #3b82f6;
        }
      `}</style>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="max-w-3xl mx-auto pt-24 px-4">
        <div className="relative rounded-2xl mb-12 p-8 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 animate-fadeIn">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-white opacity-10 blur-xl"></div>
            <div className="absolute top-1/2 -right-24 w-80 h-80 rounded-full bg-white opacity-10 blur-xl"></div>
          </div>
          <div className="relative text-center">
            <h1 className="text-4xl font-extrabold text-white mb-4">
              Make Payment
            </h1>
            <p className="text-xl text-purple-100">
              Complete your apartment payment securely.
            </p>
          </div>
        </div>

        <div className="rounded-lg shadow-lg bg-gray-800 p-6 animate-slideIn">
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label
                  className="block text-sm font-medium text-gray-300 mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <Mail
                  className="absolute left-3 top-10 text-gray-400"
                  size={18}
                />
                <input
                  id="email"
                  type="email"
                  value={apartmentDetails.user_email || "N/A"}
                  readOnly
                  className="pl-10 pr-4 py-2 rounded-lg border-gray-700 bg-gray-700 text-gray-200 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative">
                <label
                  className="block text-sm font-medium text-gray-300 mb-2"
                  htmlFor="floor"
                >
                  Floor
                </label>
                <Building
                  className="absolute left-3 top-10 text-gray-400"
                  size={18}
                />
                <input
                  id="floor"
                  type="text"
                  value={apartmentDetails.floor_no || "N/A"}
                  readOnly
                  className="pl-10 pr-4 py-2 rounded-lg border-gray-700 bg-gray-700 text-gray-200 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative">
                <label
                  className="block text-sm font-medium text-gray-300 mb-2"
                  htmlFor="block"
                >
                  Block
                </label>
                <Hash
                  className="absolute left-3 top-10 text-gray-400"
                  size={18}
                />
                <input
                  id="block"
                  type="text"
                  value={apartmentDetails.block_name || "N/A"}
                  readOnly
                  className="pl-10 pr-4 py-2 rounded-lg border-gray-700 bg-gray-700 text-gray-200 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative">
                <label
                  className="block text-sm font-medium text-gray-300 mb-2"
                  htmlFor="apartmentNo"
                >
                  Apartment No.
                </label>
                <Building
                  className="absolute left-3 top-10 text-gray-400"
                  size={18}
                />
                <input
                  id="apartmentNo"
                  type="text"
                  value={apartmentDetails.apartment_no || "N/A"}
                  readOnly
                  className="pl-10 pr-4 py-2 rounded-lg border-gray-700 bg-gray-700 text-gray-200 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative">
                <label
                  className="block text-sm font-medium text-gray-300 mb-2"
                  htmlFor="rent"
                >
                  Rent
                </label>
                <DollarSign
                  className="absolute left-3 top-10 text-gray-400"
                  size={18}
                />
                <input
                  id="rent"
                  type="text"
                  value={
                    apartmentDetails.rent
                      ? `${apartmentDetails.rent.toLocaleString()} Tk`
                      : "Not Specified"
                  }
                  readOnly
                  className="pl-10 pr-4 py-2 rounded-lg border-gray-700 bg-gray-700 text-gray-200 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative">
                <label
                  className="block text-sm font-medium text-gray-300 mb-2"
                  htmlFor="month"
                >
                  Month
                </label>
                <Calendar
                  className="absolute left-3 top-10 text-gray-400"
                  size={18}
                />
                <DatePicker
                  id="month"
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="yyyy-MM"
                  showMonthYearPicker
                  className="pl-10 pr-4 py-2 rounded-lg border-gray-700 bg-gray-700 text-gray-200 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <label
                  className="block text-sm font-medium text-gray-300 mb-2"
                  htmlFor="couponCode"
                >
                  Coupon Code
                </label>
                <Tag
                  className="absolute left-3 top-10 text-gray-400"
                  size={18}
                />
                <input
                  id="couponCode"
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg border-gray-700 bg-gray-700 text-gray-200 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter Coupon Code"
                  disabled={isCouponApplied && isCouponValid}
                />
              </div>
              <button
                type="button"
                onClick={
                  isCouponApplied && isCouponValid
                    ? clearCoupon
                    : validateCoupon
                }
                className="mt-8 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                {isCouponApplied && isCouponValid
                  ? "Clear Coupon"
                  : "Apply Coupon"}
              </button>
            </div>
            {isCouponApplied && (
              <p
                className={`mt-2 text-sm ${
                  isCouponValid ? "text-green-400" : "text-red-400"
                }`}
              >
                {isCouponValid
                  ? `Coupon applied: ${discount}% discount (${(
                      apartmentDetails.rent -
                      (apartmentDetails.rent * discount) / 100
                    ).toLocaleString()} Tk)`
                  : "Invalid coupon code"}
              </p>
            )}

            <div className="flex justify-between gap-4">
              <button
                type="button"
                onClick={() => navigate("/dashboard/profile")}
                className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 w-full"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 w-full"
              >
                Pay Now
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Payment;
