import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Vortex } from "react-loader-spinner";
import { Navigate, useLoaderData, useLocation } from "react-router-dom";
import { AuthContexts } from "../../../authProvider/AuthProvider";

const ManageMembers = () => {
  const users = useLoaderData();
  const location = useLocation();
  const { setMember, members, loading, setLoading, user } =
    useContext(AuthContexts);
  const [localMembers, setLocalMembers] = useState(members || []);

  const handleRemoveMember = async (id) => {
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
        text: "An error occurred while processing your request. Please try again later.",
      });
    }
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(
          "https://buildbox-server-side.vercel.app/users"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch agreement requests");
        }
        const data = await response.json();
        const onlyMembers = data.filter((item) => item.role === "member");
        setMember(onlyMembers);
        setLocalMembers(onlyMembers);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchRequests();
  }, [users, setMember, setLoading]);
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
    return (
      <Navigate to="/login" state={{ pathname: location.pathname }} replace />
    );
  }

  return (
    <section className="bg-slate-700 h-screen">
      <div className="pt-24">
        <div className="bg-slate-700 p-6 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-white">Manage Members</h2>
          <div className="overflow-x-auto">
            <table className="table-auto w-full rounded-md shadow-sm overflow-hidden border border-gray-500">
              <thead className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                <tr>
                  <th className="p-4 text-left font-bold uppercase text-sm tracking-wider">
                    User Name
                  </th>
                  <th className="p-4 text-left font-bold uppercase text-sm tracking-wider ">
                    Email
                  </th>
                  <th className="p-4 text-left font-bold uppercase text-sm tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {localMembers.length > 0 ? (
                  localMembers.map((member, index) => (
                    <tr
                      key={member._id}
                      className={`${
                        index % 2 === 0 ? "bg-gray-200" : "bg-gray-100"
                      } hover:bg-gray-300 transition duration-200`}
                    >
                      <td className="p-4 text-gray-900 font-semibold  border border-gray-400">
                        {member.displayName}
                      </td>
                      <td className="p-4 text-gray-900 border font-semibold border-gray-400">
                        {member.email}
                      </td>
                      <td className="p-4 text-gray-900 border border-gray-400">
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleRemoveMember(member._id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="p-4 text-center text-gray-500">
                      No Members Found
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

export default ManageMembers;
