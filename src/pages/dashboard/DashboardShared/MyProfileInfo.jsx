import { useContext, useEffect, useState } from "react";
import { AuthContexts } from "../../../authProvider/AuthProvider";
import { Navigate, useLoaderData, useLocation } from "react-router-dom";
import { Vortex } from "react-loader-spinner";

const Profile = () => {
  const apartments = useLoaderData();
  const location = useLocation();
  const { user, userData, setUserData, loading, setLoading } =
    useContext(AuthContexts);
  const [totalRooms, setTotalRooms] = useState(0);
  const [availableRooms, setAvailableRooms] = useState(0);
  const [agreementRooms, setAgreementRooms] = useState(0);
  const [availablePercentage, setAvailablePercentage] = useState(0);
  const [agreementPercentage, setAgreementPercentage] = useState(0);
  const [users, setUsers] = useState(0);
  const [userNumber, setUserNumber] = useState(0);
  const [memberNumber, setMemberNumber] = useState(0);
  const [memberApartment, setMemberApartment] = useState([]);

  useEffect(() => {
    const fetchUsersAndCalculate = async () => {
      if (!user?.email) {
        console.error("User email is not available");
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
        setLoading(false);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user && apartments) {
      fetchUsersAndCalculate();
    }
  }, [user, apartments]);

  useEffect(() => {}, [memberApartment]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Vortex
          visible={true}
          height="180"
          width="180"
          ariaLabel="vortex-loading"
          wrapperStyle={{}}
          wrapperClass="vortex-wrapper"
          colors={["red", "green", "blue", "yellow", "orange", "purple"]}
        />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} />;
  }

  const formatDate = (date) => {
    try {
      if (!date || isNaN(new Date(date).getTime())) {
        throw new Error("Invalid date value");
      }

      const options = {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };

      return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  return (
    <div className="w-full max-w-full">
      <div className="">
        <div className="max-w-4xl mx-auto bg-slate-600 rounded-lg p-6">
          <div className="flex justify-center py-10 mx-4 md:mx-0">
            <div className="card w-full max-w-md bg-gray-800 shadow-xl text-white">
              <div className="card-body items-center">
                <div className="avatar mb-4">
                  <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img
                      src={user?.photoURL || "https://via.placeholder.com/150"}
                      alt="User Avatar"
                    />
                  </div>
                </div>

                <div className="w-32 p-0 md:w-full">
                  <h2 className="text-xl font-bold mb-2">
                    {user?.displayName || "N/A"}
                  </h2>
                  <p className="text-gray-400 break-words overflow-hidden">
                    {user?.email || "No Email Provided"}
                  </p>
                </div>

                <div className="mt-6 w-full">
                  <h3 className="text-lg font-semibold">Account Information</h3>
                  <p className="text-white mt-2">
                    <strong>Name : </strong> {user?.displayName}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 text-white gap-6">
            {userData?.role === "admin" && (
              <>
                <div className="bg-gray-800 p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-white">
                    Total Rooms
                  </h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {totalRooms || "N/A"}
                  </p>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-white">
                    Percentage of Available Rooms
                  </h3>
                  <p className="text-2xl font-bold text-green-600">
                    {availablePercentage}%
                  </p>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-white">
                    Percentage of Agreement/Unavailable Rooms
                  </h3>
                  <p className="text-2xl font-bold text-red-600">
                    {agreementPercentage}%
                  </p>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-white">
                    Total Users
                  </h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {userNumber || "N/A"}
                  </p>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-white">
                    Total Members
                  </h3>
                  <p className="text-2xl font-bold text-purple-600">
                    {memberNumber || "N/A"}
                  </p>
                </div>
              </>
            )}

            {userData?.role === "member" && (
              <>
                <div className="bg-gray-800 p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-white">
                    Agreement Accept Date
                  </h3>
                  <p className="text-lg text-white">
                    {formatDate(userData?.agreementAcceptedDate) ||
                      "Not Accepted"}
                  </p>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-white">
                    Rented Apartment Info
                  </h3>
                  <p className="text-lg text-white">
                    {memberApartment?.length
                      ? `${memberApartment?.length} Apartment Rented `
                      : "No Apartment Rented"}
                  </p>
                </div>
              </>
            )}
          </div>
          {userData?.role === "member" && (
            <>
              <div className="text-lg pt-12 grid grid-cols-1 md:grid-cols-2 gap-8 text-white">
                {memberApartment && memberApartment.length > 0 ? (
                  memberApartment.map((apartment, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6 transform transition-all duration-300 hover:scale-105 hover:bg-gray-700"
                    >
                      <h4 className="text-2xl font-bold text-teal-400 mb-4">
                        Apartment Details
                      </h4>
                      <div className="space-y-3">
                        <p className="flex items-center">
                          <strong className="font-medium text-indigo-400 mr-2">
                            Apartment No:
                          </strong>
                          <span>{apartment?.apartment_no || "N/A"}</span>
                        </p>
                        <p className="flex items-center">
                          <strong className="font-medium text-indigo-400 mr-2">
                            Floor:
                          </strong>
                          <span>{apartment?.floor_no || "N/A"}</span>
                        </p>
                        <p className="flex items-center">
                          <strong className="font-medium text-indigo-400 mr-2">
                            Block:
                          </strong>
                          <span>{apartment?.block_name || "N/A"}</span>
                        </p>
                        <p className="flex items-center">
                          <strong className="font-medium text-indigo-400 mr-2">
                            Rent:
                          </strong>
                          <span className="text-teal-300">
                            ${apartment?.rent || "N/A"}
                          </span>
                        </p>

                        <div className="flex items-center">
                          <strong className="font-medium text-indigo-400 mr-2">
                            Bill Status:
                          </strong>
                          <span
                            className={`${
                              apartment?.billStatus === "Not Paid"
                                ? "text-red-500"
                                : "text-green-500"
                            } font-semibold`}
                          >
                            {apartment?.billStatus === "Not Paid"
                              ? "Not Paid"
                              : "Paid"}
                          </span>
                        </div>

                        {/* Updated Date Section */}
                        <div className="flex items-center">
                          <strong className="font-medium text-indigo-400 mr-2">
                            Last Updated:
                          </strong>
                          <span className="text-gray-400">
                            {new Date(apartment?.updatedAt).toLocaleString() ||
                              "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No apartments rented</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
