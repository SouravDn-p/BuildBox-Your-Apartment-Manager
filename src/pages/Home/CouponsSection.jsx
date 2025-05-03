import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CouponsSection({ coupons }) {
  const handleCopyToClipboard = async (code) => {
    await navigator.clipboard.writeText(code);
    toast.success("Coupon code copied to clipboard!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return (
    <section className="py-16 bg-gradient-to-br from-purple-900 via-purple-800 to-gray-900">
      <div className="container mx-auto px-6 lg:px-20">
        <h2 className="text-5xl font-extrabold text-center text-white bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500 mb-12">
          Special Coupons for You
        </h2>
        <div className="grid gap-8 lg:grid-cols-3">
          {coupons.map((coupon) => (
            <div
            key={coupon._id}
              className="relative border-b-orange-700 bg-gradient-to-r from-pink-400 to-purple-600 text-white p-6 rounded-lg shadow-xl transform transition duration-500 hover:scale-105 hover:shadow-2xl"
            >
              <h3 className="text-3xl font-bold mb-4 text-white">
                {coupon.title}
              </h3>
              <p className="mb-6 text-lg text-gray-300">{coupon.description}</p>
              <div className="flex items-center justify-between">
                <span className="font-mono text-lg bg-yellow-300 text-gray-800 px-4 py-2 rounded-lg shadow-inner">
                  {coupon.code}
                </span>
                <button
                  type="button"
                  className="btn bg-white text-gray-800 font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-yellow-400 transition duration-300"
                  onClick={() => handleCopyToClipboard(coupon.code)}
                >
                  Redeem
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ToastContainer />
    </section>
  );
}
