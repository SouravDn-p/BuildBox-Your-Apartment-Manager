import { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import Swal from "sweetalert2";
import { Users, Home, Star, CheckCircle, XCircle } from "lucide-react";
import authHook from "../../useHook/authHook";
import LoadingSpinner from "../../shared/LoadingSpinner";

const AgreementRequests = () => {
  const apartments = useLoaderData();
  const { requests, setRequests, loading, setLoading } = authHook();
  const [isLoaded, setIsLoaded] = useState(false);
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
          "https://buildbox-server-side.vercel.app/agreements"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch agreement requests");
        }
        const data = await response.json();
        const pendingRequests = data.filter(
          (item) => item.status === "pending"
        );
        setRequests(pendingRequests);
        setFetchError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setFetchError("Failed to load agreement requests");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [setRequests, setLoading]);

  const handleRequest = async (id, apartmentId, message, user_email) => {
    const apartment = apartments.find((a) => a._id === apartmentId);
    try {
      const response = await fetch(
        `https://buildbox-server-side.vercel.app/updateAgreement/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: `${message}`,
            billStatus: `Not Paid`,
          }),
        }
      );
      if (response.ok) {
        if (message === "approved") {
          const apartmentResponse = await fetch(
            `https://buildbox-server-side.vercel.app/updateApartment/${apartmentId}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                bookingStatus: `Booked`,
              }),
            }
          );
          if (apartmentResponse.ok) {
            await fetch(
              `https://buildbox-server-side.vercel.app/usersToMember`,
              {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  email: user_email,
                  role: "member",
                  agreementAcceptedDate: new Date().toISOString(),
                }),
              }
            );
          }
        }
        Swal.fire({
          icon: "success",
          title: `Agreement ${message}!`,
          showConfirmButton: false,
          timer: 1500,
        });
        setRequests((prev) => prev.filter((req) => req._id !== id));
      } else {
        Swal.fire({
          icon: "error",
          title: `Failed to ${message} agreement`,
          text: "An error occurred",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to process request",
        text: "An error occurred while processing your request",
      });
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div
      className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-b from-gray-900 to-gray-800 text-white"
          : "bg-gradient-to-b from-gray-50 to-white text-gray-800"
      }`}
    >
      <div className="max-w-7xl mx-auto">
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
              Agreement Requests
            </h1>
            <p className="mt-3 text-xl text-purple-100 max-w-2xl mx-auto">
              Review and manage pending apartment agreement requests
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 transition-all duration-700 delay-100 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <StatCard
            icon={<Users className="w-6 h-6" />}
            title="Pending Requests"
            value={requests?.length || 0}
            color="from-purple-500 to-violet-500"
            isDarkMode={isDarkMode}
          />
          <StatCard
            icon={<Home className="w-6 h-6" />}
            title="Total Apartments"
            value={apartments?.length || 0}
            color="from-blue-500 to-indigo-500"
            isDarkMode={isDarkMode}
          />
          <StatCard
            icon={<Star className="w-6 h-6" />}
            title="Booked Apartments"
            value={
              apartments?.filter((a) => a.bookingStatus === "Booked")?.length ||
              0
            }
            color="from-green-500 to-teal-500"
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Fetch Error Message */}
        {fetchError && (
          <div
            className={`text-center py-16 rounded-xl shadow-lg mb-12 transition-all duration-300 ${
              isDarkMode
                ? "bg-gray-800 text-gray-300 border border-gray-700"
                : "bg-white text-gray-500 border border-gray-100"
            }`}
          >
            <div className="mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6 bg-gray-100 dark:bg-gray-700">
              <Users
                className={`w-12 h-12 ${
                  isDarkMode ? "text-gray-500" : "text-gray-400"
                }`}
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Error Loading Requests
            </h3>
            <p className={`${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              {fetchError}
            </p>
          </div>
        )}

        {/* Request Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {requests?.length > 0 ? (
            requests.map((request, index) => (
              <RequestCard
                key={request._id}
                request={request}
                handleRequest={handleRequest}
                isDarkMode={isDarkMode}
                isLoaded={isLoaded}
                index={index}
              />
            ))
          ) : (
            <div
              className={`text-center py-16 rounded-xl shadow-lg transition-all duration-300 col-span-full ${
                isDarkMode
                  ? "bg-gray-800 text-gray-300 border border-gray-700"
                  : "bg-white text-gray-500 border border-gray-100"
              }`}
            >
              <div className="mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6 bg-gray-100 dark:bg-gray-700">
                <Home
                  className={`w-12 h-12 ${
                    isDarkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                No Pending Requests
              </h3>
              <p
                className={`${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                There are no pending agreement requests at the moment.
              </p>
            </div>
          )}
        </div>
      </div>
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

// Request Card Component
const RequestCard = ({
  request,
  handleRequest,
  isDarkMode,
  isLoaded,
  index,
}) => (
  <div
    className={`rounded-xl overflow-hidden transform transition-all duration-500 ${
      isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
    }`}
    style={{ transitionDelay: `${300 + index * 100}ms` }}
  >
    <div
      className={`h-full ${
        isDarkMode
          ? "bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700"
          : "bg-white border border-gray-100"
      } rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300`}
    >
      <div className="relative">
        <div className="h-2 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500"></div>
        <div className="absolute top-3 right-4">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              request.status === "pending"
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                : request.status === "approved"
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
            }`}
          >
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3
          className={`text-lg font-bold ${
            isDarkMode ? "text-white" : "text-gray-800"
          } mb-4`}
        >
          {request.user_name}
        </h3>
        <div className="space-y-3">
          <p className="flex items-center">
            <strong className="font-medium text-indigo-400 mr-2">Email:</strong>
            <span>{request.user_email || "N/A"}</span>
          </p>
          <p className="flex items-center">
            <strong className="font-medium text-indigo-400 mr-2">Floor:</strong>
            <span>{request.floor_no || "N/A"}</span>
          </p>
          <p className="flex items-center">
            <strong className="font-medium text-indigo-400 mr-2">Block:</strong>
            <span>{request.block_name || "N/A"}</span>
          </p>
          <p className="flex items-center">
            <strong className="font-medium text-indigo-400 mr-2">
              Room No:
            </strong>
            <span>{request.apartment_no || "N/A"}</span>
          </p>
          <p className="flex items-center">
            <strong className="font-medium text-indigo-400 mr-2">Rent:</strong>
            <span className="text-teal-300">${request.rent || "N/A"}</span>
          </p>
        </div>
        <div className="flex space-x-4 mt-6">
          <button
            className="group relative px-6 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white font-medium rounded-lg shadow-md hover:shadow-green-500/20 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            onClick={() =>
              handleRequest(
                request._id,
                request.apartmentId,
                "approved",
                request.user_email
              )
            }
          >
            <span className="relative z-10 flex items-center justify-center">
              Accept
              <CheckCircle className="w-4 h-4 ml-1 group-hover:scale-110 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          <button
            className="group relative px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium rounded-lg shadow-md hover:shadow-red-500/20 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            onClick={() =>
              handleRequest(request._id, request.apartmentId, "rejected")
            }
          >
            <span className="relative z-10 flex items-center justify-center">
              Reject
              <XCircle className="w-4 h-4 ml-1 group-hover:scale-110 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default AgreementRequests;
