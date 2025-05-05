import { useEffect, useState } from "react";
import { Navigate, useLoaderData, useLocation } from "react-router-dom";
import { Star, Users, Calendar, Home, DollarSign } from "lucide-react";
import LoadingSpinner from "../../shared/LoadingSpinner";
import authHook from "../../useHook/authHook";

const Profile = () => {
  const apartments = useLoaderData();
  const location = useLocation();
  const { user, userData, setUserData, loading, setLoading } = authHook();
  const [totalRooms, setTotalRooms] = useState(0);
  const [availableRooms, setAvailableRooms] = useState(0);
  const [agreementRooms, setAgreementRooms] = useState(0);
  const [availablePercentage, setAvailablePercentage] = useState(0);
  const [agreementPercentage, setAgreementPercentage] = useState(0);
  const [users, setUsers] = useState(0);
  const [userNumber, setUserNumber] = useState(0);
  const [memberNumber, setMemberNumber] = useState(0);
  const [memberApartment, setMemberApartment] = useState([]);
  const [loader, setLoader] = useState(true);
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
    const fetchUsersAndCalculate = async () => {
      if (!user?.email) {
        console.error("User email is not available");
        setFetchError("User email not available");
        setLoader(false);
        setLoading(false);
        return;
      }

      try {
        const usersResponse = await fetch(
          "https://buildbox-server-side.vercel.app/users"
        );
        const usersData = await usersResponse.json();
        setUsers(usersData);

        const userResponse = await fetch(
          `https://buildbox-server-side.vercel.app/user/${user.email}`
        );
        const userData = await userResponse.json();
        setUserData(userData);

        const agreementResponse = await fetch(
          `https://buildbox-server-side.vercel.app/myAgreements/${user.email}`
        );
        const agreementData = await agreementResponse.json();
        setMemberApartment(agreementData);

        if (apartments?.length > 0) {
          const total = apartments.length;
          const available = apartments.filter(
            (apartment) => apartment.bookingStatus === "available"
          ).length;
          const agreement = apartments.filter(
            (apartment) => apartment.bookingStatus === "Booked"
          ).length;

          const userNumber = usersData.filter(
            (user) => user.role === "user"
          ).length;
          const memberNumber = usersData.filter(
            (member) => member.role === "member"
          ).length;

          setTotalRooms(total);
          setAvailableRooms(available);
          setAgreementRooms(agreement);
          setAvailablePercentage(((available / total) * 100).toFixed(2));
          setAgreementPercentage(((agreement / total) * 100).toFixed(2));
          setUserNumber(userNumber);
          setMemberNumber(memberNumber);
        }
        setFetchError(null);
      } catch (err) {
        console.error("Error:", err);
        setFetchError("Failed to load profile data");
      } finally {
        setLoader(false);
        setLoading(false);
      }
    };

    if (user && apartments) {
      fetchUsersAndCalculate();
    }
  }, [user, apartments, setUserData, setLoading]);

  if (loader || loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} />;
  }

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  return (
    <div
      className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-b from-gray-950 to-gray-900 text-white"
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
              {user?.displayName || "User Profile"}
            </h1>
            <p className="mt-3 text-xl text-purple-100 max-w-2xl mx-auto">
              {userData?.role
                ? `Your ${
                    userData.role.charAt(0).toUpperCase() +
                    userData.role.slice(1)
                  } Dashboard`
                : "Manage your account and view your details"}
            </p>
          </div>
        </div>

        {/* User Info Card */}
        <div
          className={`rounded-xl overflow-hidden shadow-lg mb-12 transition-all duration-700 delay-100 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          } ${
            isDarkMode
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-100"
          }`}
        >
          <div className="p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 blur-sm opacity-50"></div>
              <img
                src={user?.photoURL || "https://via.placeholder.com/150"}
                alt="User Avatar"
                className="relative h-24 w-24 rounded-full object-cover border-2 border-white dark:border-gray-800"
              />
            </div>
            <div className="text-center md:text-left">
              <h2
                className={`text-2xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                {user?.displayName || "N/A"}
              </h2>
              <p
                className={`text-lg ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                } break-words`}
              >
                {user?.email || "No Email Provided"}
              </p>
              <p
                className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  userData?.role === "admin"
                    ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                    : userData?.role === "member"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                    : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                }`}
              >
                {userData?.role
                  ? userData.role.charAt(0).toUpperCase() +
                    userData.role.slice(1)
                  : "Guest"}
              </p>
            </div>
          </div>
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
              Error Loading Profile
            </h3>
            <p className={`${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              {fetchError}
            </p>
          </div>
        )}

        {/* Statistics Cards */}
        {userData?.role === "admin" && (
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 transition-all duration-700 delay-200 ${
              isLoaded
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <StatCard
              icon={<Home className="w-6 h-6" />}
              title="Total Rooms"
              value={totalRooms || "N/A"}
              color="from-blue-500 to-indigo-500"
              isDarkMode={isDarkMode}
            />
            <StatCard
              icon={<Star className="w-6 h-6" />}
              title="Available Rooms"
              value={`${availablePercentage}%`}
              color="from-green-500 to-teal-500"
              isDarkMode={isDarkMode}
            />
            <StatCard
              icon={<Users className="w-6 h-6" />}
              title="Booked Rooms"
              value={`${agreementPercentage}%`}
              color="from-red-500 to-pink-500"
              isDarkMode={isDarkMode}
            />
            <StatCard
              icon={<Users className="w-6 h-6" />}
              title="Total Users"
              value={userNumber || "N/A"}
              color="from-purple-500 to-violet-500"
              isDarkMode={isDarkMode}
            />
          </div>
        )}

        {userData?.role === "member" && (
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12 transition-all duration-700 delay-200 ${
              isLoaded
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <StatCard
              icon={<Calendar className="w-6 h-6" />}
              title="Agreement Date"
              value={
                formatDate(userData?.agreementAcceptedDate) || "Not Accepted"
              }
              color="from-blue-500 to-indigo-500"
              isDarkMode={isDarkMode}
            />
            <StatCard
              icon={<Home className="w-6 h-6" />}
              title="Rented Apartments"
              value={memberApartment?.length || 0}
              color="from-green-500 to-teal-500"
              isDarkMode={isDarkMode}
            />
          </div>
        )}

        {/* Apartment Details for Members */}
        {userData?.role === "member" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {memberApartment && memberApartment.length > 0 ? (
              memberApartment.map((apartment, index) => (
                <ApartmentCard
                  key={index}
                  apartment={apartment}
                  isDarkMode={isDarkMode}
                  formatDate={formatDate}
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
                  No Apartments Rented
                </h3>
                <p
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  You haven't rented any apartments yet.
                </p>
              </div>
            )}
          </div>
        )}
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

// Apartment Card Component
const ApartmentCard = ({
  apartment,
  isDarkMode,
  formatDate,
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
              apartment?.billStatus === "Not Paid"
                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
            }`}
          >
            {apartment?.billStatus === "Not Paid" ? "Not Paid" : "Paid"}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3
          className={`text-lg font-bold ${
            isDarkMode ? "text-white" : "text-gray-800"
          } mb-4`}
        >
          Apartment Details
        </h3>
        <div className="space-y-3">
          <p className="flex items-center">
            <strong className="font-medium text-indigo-400 mr-2">
              Apartment No:
            </strong>
            <span>{apartment?.apartment_no || "N/A"}</span>
          </p>
          <p className="flex items-center">
            <strong className="font-medium text-indigo-400 mr-2">Floor:</strong>
            <span>{apartment?.floor_no || "N/A"}</span>
          </p>
          <p className="flex items-center">
            <strong className="font-medium text-indigo-400 mr-2">Block:</strong>
            <span>{apartment?.block_name || "N/A"}</span>
          </p>
          <p className="flex items-center">
            <strong className="font-medium text-indigo-400 mr-2">Rent:</strong>
            <span className="text-teal-300">${apartment?.rent || "N/A"}</span>
          </p>
          <p className="flex items-center">
            <strong className="font-medium text-indigo-400 mr-2">
              Last Updated:
            </strong>
            <span
              className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              {formatDate(apartment?.updatedAt) || "N/A"}
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default Profile;
