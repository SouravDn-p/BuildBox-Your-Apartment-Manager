import { useState, useEffect, useContext, useRef } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../Navbar";
import {
  Building,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  Search,
  ChevronLeft,
  ChevronRight,
  Download,
  Printer,
  Eye,
  X,
  Filter,
} from "lucide-react";
import LoadingSpinner from "../../shared/LoadingSpinner";
import { AuthContexts } from "../../../authProvider/AuthProvider";

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

const StatCard = ({ icon, title, value, color }) => (
  <div className="rounded-xl shadow-lg hover:scale-105 transition bg-gray-800 border border-gray-700 p-6">
    <div className="flex items-center space-x-4">
      <div
        className={`h-12 w-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  </div>
);

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fadeIn">
      <div className="rounded-lg shadow-xl max-w-md w-full bg-gray-800 text-white p-4 animate-scaleIn">
        <div className="flex justify-between border-b border-gray-700 p-4">
          <h3 className="text-lg font-medium">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

const MakePayment = () => {
  const { user, loading, setLoading, setCurrentPaymentId } =
    useContext(AuthContexts);
  const [myRequest, setMyRequest] = useState([]);
  const [discountedRent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const statusFilterRef = useRef(null);
  const isDarkMode = true;

  const stats = {
    totalAgreements: myRequest.length,
    approvedAgreements: myRequest.filter((r) => r.status === "approved").length,
    pendingAgreements: myRequest.filter((r) => r.status === "pending").length,
    totalRent: myRequest.reduce((sum, r) => sum + (r.rent || 0), 0),
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(
          "https://buildbox-server-side.vercel.app/agreements"
        );
        if (!response.ok) throw new Error("Failed to fetch agreements");
        const data = await response.json();
        setMyRequest(data.filter((item) => item.user_email === user?.email));
      } catch (error) {
        setToast({ message: "Failed to fetch agreements", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    if (user?.email) fetchRequests();
  }, [user?.email, setLoading]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        statusFilterRef.current &&
        !statusFilterRef.current.contains(event.target)
      ) {
        setStatusFilter("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const requestSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  };

  const getSortedData = () => {
    let data = [...myRequest];
    if (searchTerm) {
      data = data.filter(
        (r) =>
          r.block_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.apartment_no.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter) {
      data = data.filter(
        (r) => r.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    if (sortConfig.key) {
      data.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        if (["floor_no", "rent"].includes(sortConfig.key)) {
          aValue = Number(aValue);
          bValue = Number(bValue);
        } else {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        return sortConfig.direction === "ascending"
          ? aValue < bValue
            ? -1
            : 1
          : aValue > bValue
          ? -1
          : 1;
      });
    }
    return data;
  };

  const sortedData = getSortedData();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handlePayNow = (id) => {
    setCurrentPaymentId(id);
    setToast({ message: "Redirecting to payment page...", type: "info" });
    setTimeout(() => navigate("/dashboard/payment"), 1000);
  };

  const exportData = () => {
    setToast({ message: "Export started...", type: "info" });
    console.log("Exporting:", sortedData);
  };

  const printData = () => {
    setToast({ message: "Preparing print view...", type: "info" });
    setTimeout(() => window.print(), 500);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setCurrentPage(1);
    setSortConfig({ key: null, direction: null });
    setToast({ message: "Filters reset", type: "info" });
  };

  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  return (
    <section className="w-full min-h-screen bg-gray-900 text-white">
      <Navbar />
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

      <div className="max-w-7xl mx-auto pt-24 px-4">
        <div className="relative rounded-2xl mb-12 p-8 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-white opacity-10 blur-xl"></div>
            <div className="absolute top-1/2 -right-24 w-80 h-80 rounded-full bg-white opacity-10 blur-xl"></div>
          </div>
          <div className="relative text-center">
            <h1 className="text-4xl font-extrabold text-white mb-4">
              My Agreements
            </h1>
            <p className="text-xl text-purple-100">
              Manage your apartment agreements.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            icon={<Building className="w-6 h-6" />}
            title="Total Agreements"
            value={stats.totalAgreements}
            color="from-amber-500 to-yellow-500"
          />
          <StatCard
            icon={<CheckCircle className="w-6 h-6" />}
            title="Approved"
            value={stats.approvedAgreements}
            color="from-green-500 to-teal-500"
          />
          <StatCard
            icon={<Clock className="w-6 h-6" />}
            title="Pending"
            value={stats.pendingAgreements}
            color="from-violet-500 to-purple-500"
          />
          <StatCard
            icon={<DollarSign className="w-6 h-6" />}
            title="Total Rent"
            value={`${stats.totalRent.toLocaleString()} Tk`}
            color="from-blue-500 to-indigo-500"
          />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by block or room..."
                className="pl-10 pr-4 py-2 rounded-lg border-gray-700 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative" ref={statusFilterRef}>
              <button
                onClick={() => setStatusFilter(statusFilter ? "" : "show")}
                className="p-2 rounded-lg border-gray-700 bg-gray-800 hover:bg-gray-700 flex items-center"
              >
                <Filter className="w-5 h-5" />
                {statusFilter && (
                  <span className="ml-1 w-2 h-2 bg-blue-500 rounded-full"></span>
                )}
              </button>
              {statusFilter && (
                <div className="absolute right-0 mt-2 p-4 bg-gray-800 rounded-lg shadow-lg z-10 border border-gray-700 animate-fadeIn">
                  <h4 className="font-medium mb-2">Status</h4>
                  {["pending", "approved", "rejected"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`w-full text-left px-2 py-1 rounded text-sm ${
                        statusFilter === status
                          ? "bg-blue-500 text-white"
                          : "text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                  <button
                    onClick={() => setStatusFilter("")}
                    className="w-full text-sm text-center text-gray-400 hover:text-gray-200 pt-2"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex space-x-2 mt-4 md:mt-0">
            <button
              onClick={exportData}
              className="p-2 rounded-lg border-gray-700 bg-gray-800 text-white hover:bg-gray-700"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={printData}
              className="p-2 rounded-lg border-gray-700 bg-gray-800 text-white hover:bg-gray-700"
            >
              <Printer className="w-5 h-5" />
            </button>
          </div>
        </div>

        {(searchTerm || statusFilter) && (
          <div className="flex flex-wrap gap-2 mb-4 p-3 bg-blue-900/20 rounded-lg border border-blue-800">
            <span className="text-sm font-medium text-blue-300">
              Active Filters:
            </span>
            {searchTerm && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-800 border border-gray-700">
                Search: {searchTerm}
                <button
                  onClick={() => setSearchTerm("")}
                  className="ml-1 text-gray-400 hover:text-gray-200"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {statusFilter && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-800 border border-gray-700">
                Status:{" "}
                {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                <button
                  onClick={() => setStatusFilter("")}
                  className="ml-1 text-gray-400 hover:text-gray-200"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            <button
              onClick={resetFilters}
              className="ml-auto text-sm text-blue-400 hover:text-blue-300"
            >
              Reset All
            </button>
          </div>
        )}

        <div className="overflow-x-auto rounded-lg border border-gray-700 bg-gray-800 shadow-sm">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800 text-white">
              <tr>
                {[
                  "floor_no",
                  "block_name",
                  "apartment_no",
                  "rent",
                  "status",
                ].map((key) => (
                  <th
                    key={key}
                    className="px-6 py-3 text-left text-xs font-medium uppercase cursor-pointer"
                    onClick={() => requestSort(key)}
                  >
                    <div className="flex items-center">
                      {key === "floor_no"
                        ? "Floor"
                        : key === "block_name"
                        ? "Block"
                        : key === "apartment_no"
                        ? "Room No"
                        : key === "rent"
                        ? "Rent"
                        : "Status"}
                      <Filter
                        className={`ml-1 h-4 w-4 ${
                          sortConfig.key === key ? "opacity-100" : "opacity-50"
                        }`}
                      />
                    </div>
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 bg-gray-900 text-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((request) => (
                  <tr key={request._id} className="hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {request.floor_no}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {request.block_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {request.apartment_no}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-400">
                      {(discountedRent || request.rent).toLocaleString()} Tk
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                          request.status === "pending"
                            ? "bg-yellow-900/30 text-yellow-200"
                            : request.status === "approved"
                            ? "bg-green-900/30 text-green-200"
                            : "bg-red-900/30 text-red-200"
                        }`}
                      >
                        {request.status === "pending" ? (
                          <Clock className="w-4 h-4 mr-1" />
                        ) : request.status === "approved" ? (
                          <CheckCircle className="w-4 h-4 mr-1" />
                        ) : (
                          <AlertCircle className="w-4 h-4 mr-1" />
                        )}
                        {request.status.charAt(0).toUpperCase() +
                          request.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right space-x-2">
                      <button
                        onClick={() => handleViewDetails(request)}
                        className="text-gray-400 hover:text-gray-300 px-2 py-1"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      {request.billStatus === "Paid" ? (
                        <button className="px-3 py-1 text-xs font-semibold rounded-full bg-green-900/30 text-green-200">
                          Paid
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePayNow(request._id)}
                          className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-900/30 text-blue-200 hover:bg-blue-800"
                        >
                          Pay Now
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-sm font-medium"
                  >
                    <div className="flex flex-col items-center py-6">
                      <AlertCircle className="w-12 h-12 text-gray-400 mb-2" />
                      <p>No agreements found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {sortedData.length > itemsPerPage && (
          <div className="flex flex-col sm:flex-row items-center justify-between mt-4 p-4 rounded-xl border border-gray-700 bg-gray-900/80 text-gray-300">
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
                className="px-2 py-1 rounded-md border-gray-600 bg-gray-800 text-gray-300 focus:ring-indigo-500"
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
                  className={`p-2 rounded-md ${
                    currentPage === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageToShow =
                    totalPages <= 5
                      ? i + 1
                      : currentPage <= 3
                      ? i + 1
                      : currentPage >= totalPages - 2
                      ? totalPages - 4 + i
                      : currentPage - 2 + i;
                  return (
                    <button
                      key={pageToShow}
                      onClick={() => setCurrentPage(pageToShow)}
                      className={`px-3 py-1 rounded-md text-sm font-semibold ${
                        currentPage === pageToShow
                          ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                          : "bg-gray-700 text-gray-200 hover:bg-gray-600"
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
                  className={`p-2 rounded-md ${
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Agreement Details"
        >
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Agreement ID</p>
                  <p className="font-medium">{selectedRequest._id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Floor</p>
                  <p className="font-medium">{selectedRequest.floor_no}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Block</p>
                  <p className="font-medium">{selectedRequest.block_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Room No</p>
                  <p className="font-medium">{selectedRequest.apartment_no}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Rent</p>
                  <p className="font-medium text-green-400">
                    {(discountedRent || selectedRequest.rent).toLocaleString()}{" "}
                    Tk
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <span
                    className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                      selectedRequest.status === "pending"
                        ? "bg-yellow-900/30 text-yellow-200"
                        : selectedRequest.status === "approved"
                        ? "bg-green-900/30 text-green-200"
                        : "bg-red-900/30 text-red-200"
                    }`}
                  >
                    {selectedRequest.status === "pending" ? (
                      <Clock className="w-4 h-4 mr-1" />
                    ) : selectedRequest.status === "approved" ? (
                      <CheckCircle className="w-4 h-4 mr-1" />
                    ) : (
                      <AlertCircle className="w-4 h-4 mr-1" />
                    )}
                    {selectedRequest.status.charAt(0).toUpperCase() +
                      selectedRequest.status.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-400">BillKatieStatus</p>
                  <p className="font-medium">
                    {selectedRequest.billStatus || "Not Paid"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </section>
  );
};

export default MakePayment;
