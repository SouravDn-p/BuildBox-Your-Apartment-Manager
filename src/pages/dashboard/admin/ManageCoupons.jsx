import { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { AuthContexts } from "../../../authProvider/AuthProvider";
import LoadingSpinner from "../../shared/LoadingSpinner";
import { FaSortAmountUp, FaSortAmountDown } from "react-icons/fa";

const ManageCoupons = () => {
  const { coupons, setCoupons } = useContext(AuthContexts);
  const [loading, setLoading] = useState(true);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discount: "",
    description: "",
    title: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [couponsPerPage] = useState(5);

  const isDarkMode = true; // Replace with useContext(ThemeContext) if available

  // Theme classes
  const bgMain = isDarkMode ? "bg-gray-800" : "bg-gray-50";
  const cardBg = isDarkMode ? "bg-gray-800" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200";
  const inputBg = isDarkMode ? "bg-gray-700" : "bg-white";

  // Fetch coupons
  const fetchCoupons = () => {
    setLoading(true);
    fetch("https://buildbox-server-side.vercel.app/coupons")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setCoupons(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch coupons.",
        });
      });
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // Handle form submission
  const handleAddCoupon = (e) => {
    e.preventDefault();
    if (
      !newCoupon.title ||
      !newCoupon.code ||
      !newCoupon.discount ||
      !newCoupon.description
    ) {
      Swal.fire({
        icon: "error",
        title: "Missing Information",
        text: "Please fill in all required fields",
      });
      return;
    }
    if (newCoupon.discount < 0 || newCoupon.discount > 100) {
      Swal.fire({
        icon: "error",
        title: "Invalid Discount",
        text: "Discount must be between 0 and 100%",
      });
      return;
    }

    fetch("https://buildbox-server-side.vercel.app/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCoupon),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.acknowledged) {
          Swal.fire({
            icon: "success",
            title: "Coupon Added Successfully!",
            showConfirmButton: false,
            timer: 1500,
          });
          setNewCoupon({ code: "", discount: "", description: "", title: "" });
          setIsModalOpen(false);
          fetchCoupons();
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to add coupon.",
          });
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while adding the coupon.",
        });
      });
  };

  // Sorting and pagination
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedCoupons = [...coupons].sort((a, b) => {
    if (!sortField) return 0;
    if (sortField === "discount") {
      return sortDirection === "asc"
        ? Number(a[sortField]) - Number(b[sortField])
        : Number(b[sortField]) - Number(a[sortField]);
    }
    return sortDirection === "asc"
      ? (a[sortField] || "").localeCompare(b[sortField] || "")
      : (b[sortField] || "").localeCompare(a[sortField] || "");
  });

  const indexOfLastCoupon = currentPage * couponsPerPage;
  const indexOfFirstCoupon = indexOfLastCoupon - couponsPerPage;
  const currentCoupons = sortedCoupons.slice(
    indexOfFirstCoupon,
    indexOfLastCoupon
  );
  const totalPages = Math.ceil(sortedCoupons.length / couponsPerPage);

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${bgMain}`}
      >
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <section
      className={`min-h-screen p-4 bg-gray-800 md:p-8 ${bgMain} ${textColor}`}
    >
      <div
        className={`max-w-4xl mx-auto bg-gray-900 p-6 rounded-lg ${cardBg} shadow-lg`}
      >
        {/* Header */}
        <div className="mb-8">
          <h2 className={`text-3xl font-bold ${textColor}`}>Manage Coupons</h2>
          <p
            className={`mt-2 text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Create and manage discount coupons for your users
          </p>
        </div>

        {/* Add Coupon Button */}
        <div className="mb-6">
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-4 py-2"
            onClick={() => setIsModalOpen(true)}
          >
            Add Coupon
          </button>
        </div>

        {/* Coupons Table */}
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className={isDarkMode ? "bg-gray-800" : "bg-gray-100"}>
              <tr>
                {["title", "code", "discount", "description"].map((field) => (
                  <th
                    key={field}
                    scope="col"
                    className={`px-4 py-3 text-left text-xs font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-500"
                    } uppercase tracking-wider`}
                  >
                    <div
                      className="flex items-center cursor-pointer hover:text-indigo-500 transition-colors duration-200"
                      onClick={() => handleSort(field)}
                    >
                      <span>
                        {field === "discount"
                          ? "Discount (%)"
                          : field.charAt(0).toUpperCase() + field.slice(1)}
                      </span>
                      {sortField === field && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? (
                            <FaSortAmountUp size={14} />
                          ) : (
                            <FaSortAmountDown size={14} />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody
              className={`divide-y divide-gray-200 dark:divide-gray-700 ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              {currentCoupons.length > 0 ? (
                currentCoupons.map((coupon) => (
                  <tr
                    key={coupon._id}
                    className={`hover:${
                      isDarkMode ? "bg-gray-700" : "bg-gray-50"
                    } transition-colors duration-200`}
                  >
                    <td
                      className={`px-4 py-4 whitespace-nowrap text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      {coupon.title || "N/A"}
                    </td>
                    <td
                      className={`px-4 py-4 whitespace-nowrap text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      {coupon.code || "N/A"}
                    </td>
                    <td
                      className={`px-4 py-4 whitespace-nowrap text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      {coupon.discount || "N/A"}
                    </td>
                    <td
                      className={`px-4 py-4 text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      <div className="max-w-xs truncate">
                        {coupon.description || "N/A"}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center">
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      No coupons found
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div
              className={`flex items-center justify-between px-4 py-3 sm:px-6 ${
                isDarkMode ? "bg-gray-800" : "bg-gray-100"
              } rounded-b-lg shadow-lg mt-4`}
            >
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Showing{" "}
                  <span className="font-medium">{indexOfFirstCoupon + 1}</span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastCoupon, sortedCoupons.length)}
                  </span>{" "}
                  of <span className="font-medium">{sortedCoupons.length}</span>{" "}
                  results
                </p>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
                      isDarkMode
                        ? "border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                    } text-sm font-medium ${
                      currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    ← Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page
                            ? isDarkMode
                              ? "bg-indigo-600 text-white border-indigo-600"
                              : "bg-indigo-100 text-indigo-600 border-indigo-500"
                            : isDarkMode
                            ? "border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600"
                            : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
                      isDarkMode
                        ? "border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                    } text-sm font-medium ${
                      currentPage === totalPages
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    Next →
                  </button>
                </nav>
              </div>
            </div>
          )}
        </div>

        {/* Add Coupon Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div
              className={`p-6 rounded-lg ${cardBg} max-w-md w-full shadow-xl`}
            >
              <h3 className={`font-bold text-lg ${textColor} mb-4`}>
                Add Coupon
              </h3>
              <form onSubmit={handleAddCoupon} className="space-y-4">
                <div>
                  <label
                    htmlFor="title"
                    className={`block text-sm font-medium mb-1 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Coupon Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    placeholder="Enter coupon title"
                    value={newCoupon.title}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, title: e.target.value })
                    }
                    className={`w-full ${inputBg} ${borderColor} ${textColor} rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="code"
                    className={`block text-sm font-medium mb-1 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Coupon Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="code"
                    placeholder="Enter coupon code"
                    value={newCoupon.code}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, code: e.target.value })
                    }
                    className={`w-full ${inputBg} ${borderColor} ${textColor} rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="discount"
                    className={`block text-sm font-medium mb-1 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Discount (%) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="discount"
                    placeholder="Enter discount percentage"
                    value={newCoupon.discount}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, discount: e.target.value })
                    }
                    className={`w-full ${inputBg} ${borderColor} ${textColor} rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    required
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className={`block text-sm font-medium mb-1 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    placeholder="Enter coupon description"
                    value={newCoupon.description}
                    onChange={(e) =>
                      setNewCoupon({
                        ...newCoupon,
                        description: e.target.value,
                      })
                    }
                    className={`w-full ${inputBg} ${borderColor} ${textColor} rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]`}
                    required
                  ></textarea>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    className={`${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 hover:bg-gray-600"
                        : "bg-white border-gray-300 hover:bg-gray-50"
                    } ${textColor} rounded-md px-4 py-2 border`}
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-4 py-2"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ManageCoupons;
