import { useState } from "react";

const PromoBanner = () => {
  const promoData = {
    title: "15% OFF on App Bookings",
    code: "APP15",
    description: "Book via our mobile app and enjoy an extra 15% discount.",
    bgColor: "bg-gradient-to-r from-red-400 to-yellow-500",
    discount: 15,
  };

  const [isCopied, setIsCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(promoData.code).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className={`p-6 rounded-lg text-white shadow-lg ${promoData.bgColor}`}>
      <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-center">
        {promoData.title}
      </h2>
      <p className="text-lg sm:text-xl text-center mb-4">
        {promoData.description}
      </p>
      <div className="flex items-center justify-center space-x-4">
        <span className="bg-black bg-opacity-50 px-4 py-2 rounded-lg font-bold text-lg sm:text-xl">
          {promoData.discount}% OFF
        </span>
        <button
          className="bg-white text-black px-4 py-2 rounded-lg font-bold shadow hover:opacity-90 transition"
          onClick={handleCopyCode}
        >
          {isCopied ? "Copied!" : `Use Code: ${promoData.code}`}
        </button>
      </div>
    </div>
  );
};

export default PromoBanner;
