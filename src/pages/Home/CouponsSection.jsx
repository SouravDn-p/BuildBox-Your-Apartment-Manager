import { useContext } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Tag, AlertCircle } from "lucide-react";
import { AuthContexts } from "../../authProvider/AuthProvider";

const CouponsSection = ({ coupons }) => {
  // Fallback to isDarkMode = true if ThemeContext is unavailable
  const { isDarkMode = true } = useContext(AuthContexts) || {};

  const handleCopyToClipboard = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Coupon code copied to clipboard!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      toast.error("Failed to copy coupon code", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const couponStyles = [
    {
      color: "bg-gradient-to-br from-pink-500 to-rose-500",
      shadowColor: "shadow-pink-500/20",
    },
    {
      color: "bg-gradient-to-br from-purple-500 to-indigo-600",
      shadowColor: "shadow-purple-500/20",
    },
    {
      color: "bg-gradient-to-br from-emerald-500 to-teal-500",
      shadowColor: "shadow-emerald-500/20",
    },
  ];

  return (
    <section
      className={`w-full py-16 transition-all duration-300 ${
        isDarkMode
          ? "bg-gray-950 text-white"
          : "bg-gradient-to-b from-violet-50 to-violet-100 text-gray-800"
      }`}
    >
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
      `}</style>

      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2
            className={`text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 animate-fadeIn`}
          >
            Exclusive Coupons
          </h2>
          <p
            className={`mt-4 max-w-2xl mx-auto ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            } animate-fadeIn`}
          >
            Unlock special discounts with our limited-time coupon offers.
          </p>
        </div>

        {coupons && coupons.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {coupons.map((coupon, index) => {
              const style = couponStyles[index % couponStyles.length];
              return (
                <div
                  key={coupon._id}
                  className={`relative group rounded-xl p-6 transition-all duration-300 hover:translate-y-[-8px] hover:shadow-xl ${
                    isDarkMode ? "bg-gray-900" : "bg-white"
                  } animate-slideIn`}
                >
                  <div
                    className={`absolute inset-0 rounded-xl transition-opacity duration-300 opacity-0 group-hover:opacity-100 ${
                      isDarkMode
                        ? "bg-gradient-to-r from-slate-800 to-gray-800"
                        : "bg-gradient-to-r from-violet-100 to-indigo-100"
                    }`}
                  />
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div
                      className={`${style.color} ${style.shadowColor} text-white p-4 rounded-xl shadow-lg mb-5`}
                    >
                      <Tag className="h-8 w-8" />
                    </div>
                    <h3
                      className={`font-bold text-xl mb-3 ${
                        isDarkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {coupon.title}
                    </h3>
                    <p
                      className={`${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      } mb-4`}
                    >
                      {coupon.description}
                    </p>
                    <div className="flex items-center justify-between w-full">
                      <span
                        className={`font-mono text-lg ${
                          isDarkMode
                            ? "bg-gray-700 text-gray-200"
                            : "bg-gray-200 text-gray-800"
                        } px-4 py-2 rounded-lg shadow-inner`}
                      >
                        {coupon.code}
                      </span>
                      <button
                        type="button"
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold hover:from-blue-600 hover:to-indigo-600 transition duration-300"
                        onClick={() => handleCopyToClipboard(coupon.code)}
                      >
                        Copy Code
                      </button>
                    </div>
                    <div className="w-12 h-1 rounded-full bg-gradient-to-r from-violet-400 to-indigo-400 mt-5 group-hover:w-20 transition-all duration-300" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center py-12 bg-gray-800 rounded-lg shadow-md animate-slideIn">
            <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-300">No coupons available at this time.</p>
          </div>
        )}
      </div>
      <ToastContainer />
    </section>
  );
};

export default CouponsSection;
