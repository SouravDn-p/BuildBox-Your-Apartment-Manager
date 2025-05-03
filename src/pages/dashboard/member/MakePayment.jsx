import { useState, useEffect, useContext } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Navbar from "../../Navbar";
import { AuthContexts } from "../../../authProvider/AuthProvider";
import { Audio, Vortex } from "react-loader-spinner";

const MakePayment = () => {
  const { user, loading, setLoading, setCurrentPaymentId } =
    useContext(AuthContexts);
  const [myRequest, setMyRequest] = useState([]);
  const [discountedRent, setDiscountedRent] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

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
          (item) => item.user_email === user?.email
        );
        setMyRequest(pendingRequests);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [user?.email, setLoading]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Vortex
          visible={true}
          height="180"
          width="180"
          ariaLabel="vortex-loading"
          colors={["red", "green", "blue", "yellow", "orange", "purple"]}
        />
      </div>
    );
  }

  if (!user) {
    <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <section className="bg-slate-700 h-screen">
      <div className="pt-24 px-4">
        <div className="bg-slate-700 p-6 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-white text-center">
            My Agreement
          </h2>
          <div className="overflow-x-auto">
            <table className="table-auto  w-full rounded-md shadow-sm border border-gray-500">
              <thead className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                <tr className="text-sm">
                  <th className="p-3 text-left font-semibold uppercase">
                    Floor
                  </th>
                  <th className="p-3 text-left font-semibold uppercase">
                    Block
                  </th>
                  <th className="p-3 text-left font-semibold uppercase">
                    Room No
                  </th>
                  <th className="p-3 text-left font-semibold uppercase">
                    Rent
                  </th>
                  <th className="p-3 text-left font-semibold uppercase">
                    Status
                  </th>
                  <th className="p-3 text-left font-semibold uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {myRequest.length > 0 ? (
                  myRequest.map((request, index) => (
                    <tr
                      key={request._id}
                      className={`${
                        index % 2 === 0 ? "bg-gray-200" : "bg-gray-300"
                      } hover:bg-gray-400 transition duration-200 text-sm sm:text-base`}
                    >
                      <td className="p-2 sm:p-4 text-gray-900 border border-gray-400">
                        {request.floor_no}
                      </td>
                      <td className="p-2 sm:p-4 text-gray-900 border border-gray-400">
                        {request.block_name}
                      </td>
                      <td className="p-2 sm:p-4 text-gray-900 border border-gray-400">
                        {request.apartment_no}
                      </td>
                      <td className="p-2 sm:p-4 text-gray-900 border border-gray-400">
                        ${discountedRent || request.rent}
                      </td>
                      <td className="p-2 sm:p-4 text-gray-900 border border-gray-400">
                        <span
                          className={`font-semibold ${
                            request.status === "pending"
                              ? "text-yellow-600"
                              : request.status === "approved"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {request.status.charAt(0).toUpperCase() +
                            request.status.slice(1)}
                        </span>
                      </td>
                      <td className="p-2 sm:p-4 text-gray-900 border border-gray-400">
                        {request.billStatus === "Paid" ? (
                          <div>
                            <button className="btn block btn-success btn-sm sm:btn-md w-full sm:w-auto">
                              Paid
                            </button>
                          </div>
                        ) : (
                          <button
                            className="btn btn-primary btn-sm sm:btn-md w-full sm:w-auto"
                            onClick={() => {
                              setCurrentPaymentId(request._id);
                              navigate(`/dashboard/payment`);
                            }}
                          >
                            Pay Now
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="p-4 text-center text-gray-500">
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MakePayment;
