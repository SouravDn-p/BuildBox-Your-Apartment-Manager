import { useState, useEffect, useRef } from "react";
import { useLoaderData } from "react-router-dom";
import {
  CreditCard,
  CheckCircle,
  Clock,
  Search,
  AlertCircle,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Download,
  Printer,
  Calendar,
  Eye,
  X,
  Filter,
} from "lucide-react";

// Toast Component
const Toast = ({ message, type, onClose }) => {
  const bgColor =
    type === "success"
      ? "bg-green-500"
      : type === "error"
      ? "bg-red-500"
      : "bg-blue-500";

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center max-w-sm p-4 text-white rounded-lg shadow-lg animate-slideIn transition-all duration-300 ease-in-out transform hover:scale-105">
      <div className={`${bgColor} p-2 rounded-l-lg h-full flex items-center`}>
        {type === "success" ? (
          <CheckCircle className="w-5 h-5" />
        ) : type === "error" ? (
          <AlertCircle className="w-5 h-5" />
        ) : (
          <AlertCircle className="w-5 h-5" />
        )}
      </div>
      <div className="flex-1 p-4 bg-white dark:bg-gray-800 rounded-r-lg">
        <p className="text-gray-800 dark:text-gray-200">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="absolute top-1 right-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, title, value, color, isDarkMode }) => (
  <div
    className={`rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 ${
      isDarkMode
        ? "bg-gray-800 border border-gray-700"
        : "bg-white border border-gray-100"
    }`}
  >
    <div className="p-6">
      <div className="flex items-center space-x-4">
        <div
          className={`h-12 w-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}
        >
          <div className="text-white">{icon}</div>
        </div>
        <div>
          <p
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {title}
          </p>
          <p
            className={`text-2xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  </div>
);

// Modal Component
const Modal = ({ isOpen, onClose, title, children, isDarkMode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
      <div
        className={`relative rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-auto transform transition-all duration-300 ease-in-out animate-scaleIn ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`flex items-center justify-between p-4 border-b ${
            isDarkMode ? "border-gray-700" : "border-gray-300"
          }`}
        >
          <h3 className="text-lg font-medium">{title}</h3>
          <button
            onClick={onClose}
            className={`transition-colors duration-200 ${
              isDarkMode
                ? "text-gray-400 hover:text-gray-200"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

const PaymentHistory = () => {
  const payments = useLoaderData();
  const isDarkMode = true; // Replace with useContext(ThemeContext) if available
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [dateFilter, setDateFilter] = useState({ from: null, to: null });
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const dateFilterRef = useRef(null);

  // Statistics
  const stats = {
    totalPayments: payments.length,
    paidPayments: payments.filter((p) => p.status === "Paid").length,
    pendingPayments: payments.filter((p) => p.status === "Pending").length,
    totalAmount: payments.reduce((sum, p) => sum + (p.rent || 0), 0),
  };

  // Close date filter dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dateFilterRef.current &&
        !dateFilterRef.current.contains(event.target)
      ) {
        setIsDateFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Date formatting functions
  const formatMonth = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const formatFullDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Sort function
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Get sorted and filtered data
  const getSortedData = () => {
    let filteredData = [...payments];

    // Filter by search term
    if (searchTerm) {
      filteredData = filteredData.filter(
        (payment) =>
          formatMonth(payment.month)
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          payment.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by date range
    if (dateFilter.from && dateFilter.to) {
      const fromDate = new Date(dateFilter.from);
      const toDate = new Date(dateFilter.to);
      toDate.setHours(23, 59, 59, 999); // Include entire "to" day
      filteredData = filteredData.filter((payment) => {
        const paymentDate = new Date(payment.date);
        return paymentDate >= fromDate && paymentDate <= toDate;
      });
    }

    // Sort data
    if (sortConfig.key) {
      filteredData.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === "month" || sortConfig.key === "date") {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        } else if (sortConfig.key === "rent") {
          aValue = Number(aValue);
          bValue = Number(bValue);
        } else if (sortConfig.key === "status") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredData;
  };

  const sortedData = getSortedData();

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  // Actions
  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const exportData = () => {
    setToast({
      message: "Export started. File will download shortly.",
      type: "info",
    });
    // Simulate CSV export
    console.log("Exporting payments:", sortedData);
  };

  const printData = () => {
    setToast({
      message: "Preparing print view...",
      type: "info",
    });
    setTimeout(() => {
      window.print();
    }, 500);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setDateFilter({ from: null, to: null });
    setCurrentPage(1);
    setSortConfig({ key: null, direction: null });
    setToast({
      message: "All filters have been reset",
      type: "info",
    });
  };

  return (
    <div
      className={`w-full p-4 min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
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
        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
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
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        @media print {
          body * {
            visibility: hidden;
          }
          table,
          table * {
            visibility: visible;
          }
          table {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-2xl mb-12 p-8 md:p-12">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 opacity-90"></div>
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-white opacity-10 blur-xl"></div>
            <div className="absolute top-1/2 -right-24 w-80 h-80 rounded-full bg-white opacity-10 blur-xl"></div>
            <div className="absolute -bottom-24 left-1/3 w-72 h-72 rounded-full bg-white opacity-10 blur-xl"></div>
          </div>
          <div className="relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Payment History
            </h1>
            <p className="mt-3 text-xl text-purple-100 max-w-2xl mx-auto">
              View and manage your payment history with ease.
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 transition-all duration-700 opacity-100 translate-y-0">
          <StatCard
            icon={<CreditCard className="w-6 h-6" />}
            title="Total Payments"
            value={stats.totalPayments}
            color="from-amber-500 to-yellow-500"
            isDarkMode={isDarkMode}
          />
          <StatCard
            icon={<CheckCircle className="w-6 h-6" />}
            title="Paid Payments"
            value={stats.paidPayments}
            color="from-green-500 to-teal-500"
            isDarkMode={isDarkMode}
          />
          <StatCard
            icon={<Clock className="w-6 h-6" />}
            title="Pending Payments"
            value={stats.pendingPayments}
            color="from-violet-500 to-purple-500"
            isDarkMode={isDarkMode}
          />
          <StatCard
            icon={<DollarSign className="w-6 h-6" />}
            title="Total Amount"
            value={`${stats.totalAmount.toLocaleString()} Tk`}
            color="from-blue-500 to-indigo-500"
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            {/* Search Input */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by month or status..."
                className={`pl-10 pr-4 py-2 rounded-lg ${
                  isDarkMode
                    ? "border-gray-700 bg-gray-800 hover:bg-gray-700"
                    : "border-gray-300 bg-white hover:bg-gray-100"
                } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 w-full md:w-64`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Date Filter */}
            <div className="relative" ref={dateFilterRef}>
              <button
                onClick={() => setIsDateFilterOpen(!isDateFilterOpen)}
                className={`p-2 rounded-lg ${
                  isDarkMode
                    ? "border-gray-700 bg-gray-800 hover:bg-gray-700"
                    : "border-gray-300 bg-white hover:bg-gray-100"
                } transition-colors duration-300 flex items-center`}
                title="Date filter"
              >
                <Calendar className="w-5 h-5" />
                {(dateFilter.from || dateFilter.to) && (
                  <span className="ml-1 w-2 h-2 bg-blue-500 rounded-full"></span>
                )}
              </button>
              {isDateFilterOpen && (
                <div className="absolute right-0 mt-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 border border-gray-200 dark:border-gray-700 animate-fadeIn">
                  <h4 className="font-medium mb-2">Date Range</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-sm mb-1">From</label>
                      <input
                        type="date"
                        className={`w-full p-2 rounded border ${
                          isDarkMode
                            ? "border-gray-700 bg-gray-800"
                            : "border-gray-300 bg-white"
                        }`}
                        value={dateFilter.from || ""}
                        onChange={(e) =>
                          setDateFilter({ ...dateFilter, from: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">To</label>
                      <input
                        type="date"
                        className={`w-full p-2 rounded border ${
                          isDarkMode
                            ? "border-gray-700 bg-gray-800"
                            : "border-gray-300 bg-white"
                        }`}
                        value={dateFilter.to || ""}
                        onChange={(e) =>
                          setDateFilter({ ...dateFilter, to: e.target.value })
                        }
                      />
                    </div>
                    <div className="flex justify-between pt-2">
                      <button
                        onClick={() => {
                          setDateFilter({ from: null, to: null });
                          setIsDateFilterOpen(false);
                        }}
                        className={`text-sm hover:text-gray-800 dark:hover:text-gray-200 ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Clear
                      </button>
                      <button
                        onClick={() => setIsDateFilterOpen(false)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 mt-4 md:mt-0">
            <button
              onClick={exportData}
              className={`p-2 rounded-lg border transition-colors duration-300 ${
                isDarkMode
                  ? "bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                  : "bg-white text-gray-900 border-gray-300 hover:bg-gray-100"
              }`}
              title="Export data"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={printData}
              className={`p-2 rounded-lg border transition-colors duration-300 ${
                isDarkMode
                  ? "bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                  : "bg-white text-gray-900 border-gray-300 hover:bg-gray-100"
              }`}
              title="Print"
            >
              <Printer className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Active Filters */}
        {(searchTerm || dateFilter.from || dateFilter.to) && (
          <div className="flex flex-wrap items-center gap-2 mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Active Filters:
            </span>
            {searchTerm && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
                Search: {searchTerm}
                <button
                  onClick={() => setSearchTerm("")}
                  className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {dateFilter.from && dateFilter.to && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
                Date: {dateFilter.from} to {dateFilter.to}
                <button
                  onClick={() => setDateFilter({ from: null, to: null })}
                  className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={resetFilters}
              className="ml-auto text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              Reset All
            </button>
          </div>
        )}

        {/* Payments Table */}
        <div
          className={`overflow-x-auto rounded-lg border shadow-sm ${
            isDarkMode
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-white"
          }`}
        >
          <table
            className={`min-w-full divide-y ${
              isDarkMode ? "divide-gray-700" : "divide-gray-200"
            }`}
          >
            <thead
              className={
                isDarkMode ? "bg-gray-800 text-white" : "bg-gray-50 text-black"
              }
            >
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("month")}
                >
                  <div className="flex items-center">
                    Month
                    <Filter
                      className={`ml-1 h-4 w-4 ${
                        sortConfig.key === "month"
                          ? "opacity-100"
                          : "opacity-50"
                      }`}
                    />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("date")}
                >
                  <div className="flex items-center">
                    Payment Date
                    <Filter
                      className={`ml-1 h-4 w-4 ${
                        sortConfig.key === "date" ? "opacity-100" : "opacity-50"
                      }`}
                    />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("rent")}
                >
                  <div className="flex items-center">
                    Amount
                    <Filter
                      className={`ml-1 h-4 w-4 ${
                        sortConfig.key === "rent" ? "opacity-100" : "opacity-50"
                      }`}
                    />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("status")}
                >
                  <div className="flex items-center">
                    Status
                    <Filter
                      className={`ml-1 h-4 w-4 ${
                        sortConfig.key === "status"
                          ? "opacity-100"
                          : "opacity-50"
                      }`}
                    />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody
              className={`${
                isDarkMode
                  ? "divide-gray-700 bg-gray-900 text-gray-200"
                  : "divide-gray-200 bg-white text-gray-800"
              } divide-y`}
            >
              {currentItems.length > 0 ? (
                currentItems.map((payment) => (
                  <tr
                    key={payment.id}
                    className={`transition-colors duration-150 ${
                      isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {formatMonth(payment.month)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {formatFullDate(payment.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
                      {payment.rent.toLocaleString()} Tk
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          payment.status === "Pending"
                            ? isDarkMode
                              ? "bg-yellow-900/30 text-yellow-200"
                              : "bg-yellow-100 text-yellow-800"
                            : isDarkMode
                            ? "bg-green-900/30 text-green-200"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {payment.status === "Pending" ? (
                          <Clock className="w-4 h-4 mr-1" />
                        ) : (
                          <CheckCircle className="w-4 h-4 mr-1" />
                        )}
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <button
                        onClick={() => handleViewDetails(payment)}
                        className={`${
                          isDarkMode
                            ? "text-gray-400 hover:text-gray-300"
                            : "text-gray-500 hover:text-gray-700"
                        } px-2 py-1 transition-colors duration-300`}
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-sm font-medium"
                  >
                    <div className="flex flex-col items-center py-6">
                      <AlertCircle className="w-12 h-12 text-gray-400 mb-2" />
                      <p>No payments found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {sortedData.length > itemsPerPage && (
          <div
            className={`flex flex-col sm:flex-row items-center justify-between mt-4 p-4 rounded-xl border shadow-sm transition-all duration-300 ${
              isDarkMode
                ? "bg-gray-900/80 border-gray-700 text-gray-300"
                : "bg-white/80 border-gray-200 text-gray-600"
            }`}
          >
            <div className="text-sm mb-3 sm:mb-0">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, sortedData.length)} of{" "}
              {sortedData.length} entries
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className={`mr-2 px-2 py-1 rounded-md border text-sm focus:ring-2 transition-all duration-300 ${
                  isDarkMode
                    ? "border-gray-600 bg-gray-800 text-gray-300 focus:ring-indigo-500"
                    : "border-gray-300 bg-white text-gray-700 focus:ring-blue-500"
                }`}
              >
                {[5, 10, 25, 50].map((num) => (
                  <option key={num} value={num}>
                    {num} per page
                  </option>
                ))}
              </select>
              <div className="flex space-x-1">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`p-2 rounded-md transition-all duration-300 ${
                    currentPage === 1
                      ? "opacity-50 cursor-not-allowed"
                      : isDarkMode
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <ChevronLeft
                    className={`w-5 h-5 ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    }`}
                  />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageToShow;
                  if (totalPages <= 5) {
                    pageToShow = i + 1;
                  } else if (currentPage <= 3) {
                    pageToShow = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageToShow = totalPages - 4 + i;
                  } else {
                    pageToShow = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageToShow}
                      onClick={() => setCurrentPage(pageToShow)}
                      className={`px-3 py-1 rounded-md text-sm font-semibold transition-all duration-300 ${
                        currentPage === pageToShow
                          ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md scale-105"
                          : isDarkMode
                          ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      {pageToShow}
                    </button>
                  );
                })}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-md transition-all duration-300 ${
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : isDarkMode
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <ChevronRight
                    className={`w-5 h-5 ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Details Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Payment Details"
          isDarkMode={isDarkMode}
        >
          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Payment ID
                  </p>
                  <p className="font-medium">{selectedPayment.id}</p>
                </div>
                <div>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Month
                  </p>
                  <p className="font-medium">
                    {formatMonth(selectedPayment.month)}
                  </p>
                </div>
                <div>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Payment Date
                  </p>
                  <p className="font-medium">
                    {formatFullDate(selectedPayment.date)}
                  </p>
                </div>
                <div>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Amount
                  </p>
                  <p className="font-medium text-green-600 dark:text-green-400">
                    {selectedPayment.rent.toLocaleString()} Tk
                  </p>
                </div>
                <div>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Status
                  </p>
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      selectedPayment.status === "Pending"
                        ? isDarkMode
                          ? "bg-yellow-900/30 text-yellow-200"
                          : "bg-yellow-100 text-yellow-800"
                        : isDarkMode
                        ? "bg-green-900/30 text-green-200"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {selectedPayment.status === "Pending" ? (
                      <Clock className="w-4 h-4 mr-1" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-1" />
                    )}
                    {selectedPayment.status}
                  </span>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default PaymentHistory;
