import { useState, useEffect, useMemo, useContext } from "react";
import { useTable } from "react-table";
import Swal from "sweetalert2";
import { AuthContexts } from "../../../authProvider/AuthProvider";
import { Vortex } from "react-loader-spinner";
import { useLoaderData } from "react-router-dom";

const AgreementRequests = () => {
  const apartments = useLoaderData();
  const { requests, setRequests, loading, setLoading } =
    useContext(AuthContexts);

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
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleRequest = async (id, apartmentId, message, user_email) => {
    const apartment = apartments.find((a) => a._id == apartmentId);
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

  const columns = useMemo(
    () => [
      {
        Header: "User Name",
        accessor: "user_name",
      },
      {
        Header: "Email",
        accessor: "user_email",
      },
      {
        Header: "Floor",
        accessor: "floor_no",
      },
      {
        Header: "Block",
        accessor: "block_name",
      },
      {
        Header: "Room No",
        accessor: "apartment_no",
      },
      {
        Header: "Rent",
        accessor: "rent",
        Cell: ({ value }) => `$${value}`,
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
          <span
            className={`font-semibold ${
              value === "pending"
                ? "text-yellow-600"
                : value === "approved"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </span>
        ),
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={() =>
                handleRequest(
                  row.original._id,
                  row.original.apartmentId,
                  "approved",
                  row.original.user_email
                )
              }
            >
              Accept
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() =>
                handleRequest(
                  row.original._id,
                  row.original.apartmentId,
                  "rejected"
                )
              }
            >
              Reject
            </button>
          </div>
        ),
      },
    ],
    [requests]
  );

  const data = useMemo(() => requests, [requests]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Vortex
          visible={true}
          height="180"
          width="180"
          ariaLabel="vortex-loading"
          wrapperClass="vortex-wrapper"
          colors={["red", "green", "blue", "yellow", "orange", "purple"]}
        />
      </div>
    );
  }

  return (
    <section className="bg-slate-700 min-h-screen overflow-x-auto max-h-screen">
      <div className="container mx-auto px-4 pt-24">
        <div className="bg-slate-700 p-6 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-white text-center md:text-left">
            Agreement Requests
          </h2>
          <div className="overflow-x-auto">
            <table
              className="table-auto min-w-full border-collapse border border-gray-500"
              {...getTableProps()}
            >
              <thead className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        className="p-4 text-left font-semibold uppercase text-sm tracking-wider"
                        {...column.getHeaderProps()}
                      >
                        {column.render("Header")}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.length > 0 ? (
                  rows.map((row) => {
                    prepareRow(row);
                    return (
                      <tr
                        key={row.original._id}
                        className={`${
                          row.index % 2 === 0 ? "bg-gray-200" : "bg-gray-300"
                        } hover:bg-gray-400`}
                        {...row.getRowProps()}
                      >
                        {row.cells.map((cell) => (
                          <td
                            className="p-4 text-gray-900 border border-gray-400 text-sm"
                            {...cell.getCellProps()}
                          >
                            {cell.render("Cell")}
                          </td>
                        ))}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={headerGroups[0]?.headers.length || 1}
                      className="p-4 text-center text-gray-500"
                    >
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

export default AgreementRequests;
