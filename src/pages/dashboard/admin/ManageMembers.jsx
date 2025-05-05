import { useState, useEffect } from "react";
import { Navigate, useLoaderData, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { FaSortAmountUp, FaSortAmountDown, FaEye } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";
import authHook from "../../useHook/authHook";
import LoadingSpinner from "../../shared/LoadingSpinner";

const ManageMembers = () => {
  const users = useLoaderData();
  const location = useLocation();
  const { user, members, setMember, loading, setLoading } = authHook();
  const [isLoaded, setIsLoaded] = useState(true);

  const [localMembers, setLocalMembers] = useState(members || []);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [selectedRole, setSelectedRole] = useState("member");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const isDarkMode = true; // Adjust based on your app's theme logic

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(
          "https://buildbox-server-side.vercel.app/users"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setMember(data);
        setLocalMembers(data);
        setFetchError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setFetchError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [setMember, setLoading]);

  const handleRemoveMember = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to remove this member?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, remove it!",
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      try {
        const response = await fetch(
          `https://buildbox-server-side.vercel.app/updateUsers/${id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role: "user" }),
          }
        );

        const result = await response.json();
        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Member Removed",
            text: "The member's role has been updated to user.",
            showConfirmButton: false,
            timer: 1500,
          });

          setMember((prev) => prev.filter((member) => member._id !== id));
          setLocalMembers((prev) => prev.filter((member) => member._id !== id));
          setIsModalOpen(false);
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text:
              result.error ||
              "An unknown error occurred while removing the member.",
          });
        }
      } catch (error) {
        console.error("Error removing member:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while processing your request.",
        });
      }
    });
  };

  const handleRoleFilter = (role) => {
    setSelectedRole(role);
    setCurrentPage(1);
    if (role === "all") {
      setLocalMembers(users);
    } else {
      const filtered = users.filter((user) => user.role === role);
      setLocalMembers(filtered);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedUsers = [...localMembers].sort((a, b) => {
    if (!sortField) return 0;
    if (sortField === "agreementAcceptedDate") {
      return sortDirection === "asc"
        ? new Date(a[sortField] || 0) - new Date(b[sortField] || 0)
        : new Date(b[sortField] || 0) - new Date(a[sortField] || 0);
    }
    return sortDirection === "asc"
      ? (a[sortField] || "").localeCompare(b[sortField] || "")
      : (b[sortField] || "").localeCompare(a[sortField] || "");
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "N/A";

  const openDetailsModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <Navigate to="/login" state={{ pathname: location.pathname }} replace />
    );
  }

  return (
    <div
      className={`p-4 min-h-screen ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      } transition-colors duration-300`}
    >
      <div className="max-w-6xl mx-auto p-6 rounded-lg">
        {/* Header Section */}
        <div
          className={`relative overflow-hidden rounded-2xl mb-16 p-8 md:p-12 transition-all duration-700 transform ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 opacity-90"></div>
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-white opacity-10 blur-xl"></div>
            <div className="absolute top-1/2 -right-24 w-80 h-80 rounded-full bg-white opacity-10 blur-xl"></div>
            <div className="absolute -bottom-24 left-1/3 w-72 h-72 rounded-full bg-white opacity-10 blur-xl"></div>
          </div>
          <div className="relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Manage Members
            </h1>
            <p className="mt-3 text-xl text-purple-100 max-w-2xl mx-auto">
              Review and manage member accounts
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center mb-10">
          <div
            className={`inline-flex p-1.5 gap-2 rounded-xl ${
              isDarkMode ? "bg-gray-800" : "bg-gray-100"
            } shadow-lg transition-all duration-300`}
          >
            {["all", "member", "user"].map((role) => (
              <button
                key={role}
                onClick={() => handleRoleFilter(role)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                  selectedRole === role
                    ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md"
                    : isDarkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {role === "all"
                  ? "All Users"
                  : role.charAt(0).toUpperCase() + role.slice(1) + "s"}
              </button>
            ))}
          </div>
        </div>

        {/* Fetch Error Message */}
        {fetchError && (
          <div
            className={`text-center py-6 rounded-lg shadow-lg mb-6 ${
              isDarkMode
                ? "bg-gray-800 text-gray-300 border border-gray-700"
                : "bg-white text-gray-500 border border-gray-100"
            }`}
          >
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {fetchError}
            </p>
          </div>
        )}

        {/* Table with Members */}
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className={isDarkMode ? "bg-gray-800" : "bg-gray-100"}>
              <tr>
                {["displayName", "email", "agreementAcceptedDate"].map(
                  (field) => (
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
                          {field === "displayName"
                            ? "Name"
                            : field === "agreementAcceptedDate"
                            ? "Agreement Date"
                            : "Email"}
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
                  )
                )}
                <th
                  scope="col"
                  className={`px-4 py-3 text-right text-xs font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-500"
                  } uppercase tracking-wider`}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody
              className={`divide-y divide-gray-200 dark:divide-gray-700 ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              {currentUsers.length > 0 ? (
                currentUsers.map((member) => (
                  <tr
                    key={member._id}
                    className={`hover:${
                      isDarkMode ? "bg-gray-700" : "bg-gray-50"
                    } transition-colors duration-200`}
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className={`h-10 w-10 flex items-center justify-center rounded-full ${
                            isDarkMode ? "bg-indigo-900" : "bg-indigo-100"
                          } transition-colors duration-200`}
                        >
                          <span
                            className={
                              isDarkMode ? "text-indigo-300" : "text-indigo-700"
                            }
                          >
                            {member.displayName?.charAt(0).toUpperCase() || "?"}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div
                            className={`text-sm font-medium ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {member.displayName || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td
                      className={`px-4 py-4 whitespace-nowrap text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      {member.email || "N/A"}
                    </td>
                    <td
                      className={`px-4 py-4 whitespace-nowrap text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      {formatDate(member.agreementAcceptedDate)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openDetailsModal(member)}
                        className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-all duration-200 flex items-center gap-2"
                        aria-label="View member details"
                      >
                        <FaEye />
                        Details
                      </button>
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
                      No {selectedRole === "all" ? "users" : selectedRole + "s"}{" "}
                      found
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className={`flex items-center justify-between px-4 py-3 sm:px-6 ${
              isDarkMode ? "bg-gray-800" : "bg-gray-100"
            } rounded-b-lg shadow-lg mt-4`}
          >
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Showing{" "}
                  <span className="font-medium">{indexOfFirstUser + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastUser, sortedUsers.length)}
                  </span>{" "}
                  of <span className="font-medium">{sortedUsers.length}</span>{" "}
                  results
                </p>
              </div>
              <div>
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
                    } transition-all duration-200`}
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
                        } transition-all duration-200`}
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
                    } transition-all duration-200`}
                  >
                    Next →
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Modal for User Details */}
        {isModalOpen && selectedUser && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-300"
            role="dialog"
            aria-labelledby="modal-title"
            aria-modal="true"
          >
            <div
              className={`w-full max-w-4xl rounded-2xl shadow-2xl p-8 mx-4 transform transition-all duration-300 scale-95 animate-modal-open ${
                isDarkMode
                  ? "bg-gradient-to-b from-gray-900 to-gray-800 border border-gray-700"
                  : "bg-gradient-to-b from-white to-gray-50 border border-gray-200"
              } max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-transparent`}
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <div
                  className={`w-16 h-16 flex items-center justify-center rounded-full ${
                    isDarkMode ? "bg-indigo-900" : "bg-indigo-100"
                  } shadow-md transition-colors duration-200`}
                >
                  <span
                    className={`text-2xl font-bold ${
                      isDarkMode ? "text-indigo-300" : "text-indigo-700"
                    }`}
                  >
                    {selectedUser.displayName?.charAt(0).toUpperCase() || "?"}
                  </span>
                </div>
                <div>
                  <h2
                    id="modal-title"
                    className={`text-2xl font-bold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedUser.displayName || "N/A"}
                  </h2>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {selectedUser.email || "N/A"}
                  </p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 capitalize ${
                      selectedUser.role === "member"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                        : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    }`}
                  >
                    {selectedUser.role || "N/A"}
                  </span>
                </div>
              </div>

              {/* User Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-3 text-sm">
                  <p
                    className={`${
                      isDarkMode ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    <strong>Name:</strong> {selectedUser.displayName || "N/A"}
                  </p>
                  <p
                    className={`${
                      isDarkMode ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    <strong>Email:</strong> {selectedUser.email || "N/A"}
                  </p>
                  <p
                    className={`${
                      isDarkMode ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    <strong>Role:</strong>{" "}
                    {selectedUser.role
                      ? selectedUser.role.charAt(0).toUpperCase() +
                        selectedUser.role.slice(1)
                      : "N/A"}
                  </p>
                </div>
                <div className="space-y-3 text-sm">
                  <p
                    className={`${
                      isDarkMode ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    <strong>Agreement Accepted Date:</strong>{" "}
                    {formatDate(selectedUser.agreementAcceptedDate)}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div
                className={`flex justify-end gap-3 pt-4 border-t ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <button
                  onClick={() => setIsModalOpen(false)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                  aria-label="Close modal"
                >
                  Close
                </button>
                {selectedUser.role === "member" && (
                  <button
                    onClick={() => handleRemoveMember(selectedUser._id)}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
                    aria-label="Remove member"
                  >
                    <GiCancel size={18} />
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Inline Styles for Animations */}
        <style jsx>{`
          @keyframes modal-open {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          .animate-modal-open {
            animation: modal-open 0.3s ease-out forwards;
          }
          .scrollbar-thin::-webkit-scrollbar {
            width: 6px;
          }
          .scrollbar-thin::-webkit-scrollbar-thumb {
            background-color: #6366f1;
            border-radius: 9999px;
          }
          .scrollbar-thin::-webkit-scrollbar-track {
            background: transparent;
          }
        `}</style>
      </div>
    </div>
  );
};

export default ManageMembers;
