import { useContext, useState, useEffect } from "react";
import { AuthContexts } from "../../../authProvider/AuthProvider";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLoaderData, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Vortex } from "react-loader-spinner";

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

  useEffect(() => {
    const fetchApartmentDetails = async () => {
      if (!currentPaymentId) {
        console.error("currentPaymentId is not set.");
        return;
      }
      try {
        setLoading(true);
        const response = await fetch(
          `https://buildbox-server-side.vercel.app/agreements/${currentPaymentId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch apartment details");
        }
        const data = await response.json();
        setApartmentDetails(data);
        setSelectedDate(data.updatedAt ? new Date(data.updatedAt) : null);
      } catch (error) {
        console.error("Error fetching apartment details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApartmentDetails();
  }, [currentPaymentId]);

  const validateCoupon = () => {
    setIsCouponApplied(true);
    const matchedCoupon = coupons.find(
      (coupon) => coupon.code.toUpperCase() === couponCode.trim().toUpperCase()
    );
    if (matchedCoupon) {
      setDiscount(parseInt(matchedCoupon.discount || 0));
      setIsCouponValid(true);
    } else {
      setDiscount(0);
      setIsCouponValid(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const paymentData = {
      status: "Paid",
      user_name: user?.displayName || "N/A",
      user_email: apartmentDetails.user_email || "N/A",
      floor_no: apartmentDetails.floor_no || "N/A",
      block_name: apartmentDetails.block_name || "N/A",
      apartment_no: apartmentDetails.apartment_no || "N/A",
      month: selectedDate ? selectedDate.toISOString().slice(0, 7) : null,
      rent:
        isCouponApplied && isCouponValid
          ? apartmentDetails.rent - (apartmentDetails.rent * discount) / 100
          : apartmentDetails.rent,
      updatedAt: new Date(selectedDate || new Date()).toISOString(),
    };

    if (isCouponApplied && !isCouponValid) {
      Swal.fire({
        icon: "error",
        title: "Invalid Coupon",
        text: "The entered coupon code is not valid. Please try again.",
      });
      return;
    }

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
      } else {
        Swal.fire({
          icon: "error",
          title: "Payment Failed",
          text: result.message || "Something went wrong. Please try again.",
        });
      }
      navigate("/dashboard/profile");
    } catch (error) {
      console.error("Error processing payment:", error);
      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: "An unexpected error occurred. Please try again.",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Vortex
          visible={true}
          height="180"
          width="180"
          ariaLabel="vortex-loading"
          colors={["red", "green", "blue", "yellow", "orange", "purple"]}
        />
      </div>
    );
  }

  return (
    <div className="bg-slate-700 py-8 px-8 md:px-24 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Make Payment</h2>
      <form className="space-y-4" onSubmit={handleFormSubmit}>
        <div>
          <label className="block text-sm font-semibold mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={apartmentDetails.user_email || "N/A"}
            readOnly
            className="input input-bordered w-full"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2" htmlFor="floor">
              Floor
            </label>
            <input
              id="floor"
              type="number"
              value={apartmentDetails.floor_no || "N/A"}
              readOnly
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" htmlFor="block">
              Block
            </label>
            <input
              id="block"
              type="text"
              value={apartmentDetails.block_name || "N/A"}
              readOnly
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label
              className="block text-sm font-semibold mb-2"
              htmlFor="apartmentNo"
            >
              Apartment No.
            </label>
            <input
              id="apartmentNo"
              type="text"
              value={apartmentDetails.apartment_no || "N/A"}
              readOnly
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" htmlFor="rent">
              Price
            </label>
            <input
              id="rent"
              type="text"
              value={apartmentDetails.rent || "Not Specified"}
              readOnly
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" htmlFor="month">
              Month
            </label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="yyyy-MM"
              showMonthYearPicker
              className="input input-bordered w-full"
              required
            />
          </div>

          {isCouponApplied && (
            <div>
              <label
                className="block text-sm font-semibold mb-2"
                htmlFor="rent"
              >
                Discount Price
              </label>
              <input
                id="rent"
                type="text"
                value={
                  apartmentDetails.rent
                    ? apartmentDetails.rent -
                      (apartmentDetails.rent * discount) / 100
                    : "Not Specified"
                }
                readOnly
                className="input input-bordered w-full"
              />
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1">
            <label
              className="block text-sm font-semibold mb-2"
              htmlFor="couponCode"
            >
              Coupon Code
            </label>
            <input
              id="couponCode"
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="input input-bordered w-full"
              placeholder="Enter Coupon Code"
              readOnly={isCouponApplied}
            />
          </div>
          <label className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              aria-label="Apply Coupon"
              className="btn"
              checked={isCouponApplied}
              onClick={validateCoupon}
              onChange={(e) => setIsCouponApplied(e.target.checked)}
            />
          </label>
        </div>
        {!isCouponValid && (
          <p className="text-red-500 mt-2">Invalid coupon code!</p>
        )}
        <button type="submit" className="btn btn-success w-full mt-4">
          Pay Now
        </button>
      </form>
    </div>
  );
};

export default Payment;
