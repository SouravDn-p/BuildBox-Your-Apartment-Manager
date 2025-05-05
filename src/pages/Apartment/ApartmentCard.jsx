"use client";

import { useContext, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { AuthContexts } from "../../authProvider/AuthProvider";
import { Vortex } from "react-loader-spinner";
import { Navigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

const ApartmentCard = ({ apartment }) => {
  const { user, loading } = useContext(AuthContexts);
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    user_name: user?.displayName || "",
    user_email: user?.email || "",
    apartment_no: apartment.apartment_no,
    floor_no: apartment.floor_no,
    block_name: apartment.block_name,
    rent: apartment.rent,
    apartmentId: apartment._id,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAgreement = async (e) => {
    e.preventDefault();

    if (!user) {
      Swal.fire({
        icon: "error",
        title: `Please log in to apply for this apartment.`,
        position: "center",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    const agreementData = {
      ...formData,
      status: "pending",
    };

    try {
      setIsSubmitting(true);
      const response = await axios.post(
        "https://buildbox-server-side.vercel.app/agreements",
        agreementData
      );

      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          icon: "success",
          title: `Agreement successfully submitted for Apartment No: ${apartment.apartment_no}.`,
          position: "top-right",
          showConfirmButton: false,
          timer: 3000,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: `Please log in to apply for this apartment.`,
          position: "center",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    } catch (error) {
      console.error("Error submitting agreement:", error);
      Swal.fire({
        icon: "error",
        title: `An error occurred while submitting the agreement.`,
        position: "center",
        showConfirmButton: false,
        timer: 2000,
      });
    } finally {
      setIsSubmitting(false);
      document.getElementById(`close-modal-${apartment.apartment_no}`).click();
    }
  };

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
    return <Navigate to="/login" state={{ pathname: location.pathname }} />;
  }

  return (
    <>
      <div className="card glass hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
        {/* Status Badge */}
        <div
          className={`absolute top-3 right-3 badge ${
            apartment.bookingStatus === "available"
              ? "badge-success"
              : "badge-error"
          } badge-lg z-10 shadow-lg`}
        >
          {apartment.bookingStatus === "available" ? "Available" : "Booked"}
        </div>

        {/* Image with Overlay */}
        <figure className="relative">
          <img
            src={apartment.image_url || "/placeholder.svg"}
            alt={`Apartment ${apartment.apartment_no}`}
            className="h-56 w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-2 left-3 text-white">
            <div className="badge badge-primary">{apartment.block_name}</div>
          </div>
        </figure>

        {/* Card Body */}
        <div className="card-body bg-base-100 text-base-content">
          <h2 className="card-title text-xl font-bold flex justify-between">
            <span>Apartment {apartment.apartment_no}</span>
            <span className="text-primary text-2xl font-extrabold">
              ${apartment.rent}
            </span>
          </h2>

          <div className="flex flex-wrap gap-2 my-2">
            <div className="badge badge-outline">
              Floor {apartment.floor_no}
            </div>
            <div className="badge badge-outline">
              Block {apartment.block_name}
            </div>
          </div>

          <div className="divider my-1"></div>

          <div className="card-actions justify-end mt-2">
            {apartment.bookingStatus === "available" ? (
              <label
                htmlFor={`modal-${apartment.apartment_no}`}
                className="btn btn-primary btn-block bg-gradient-to-r from-purple-600 to-indigo-600 border-none hover:from-purple-700 hover:to-indigo-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Book Now
              </label>
            ) : (
              <button
                className="btn btn-block btn-disabled"
                onClick={() =>
                  Swal.fire({
                    icon: "error",
                    title: "Apartment already Booked",
                    position: "center",
                    showConfirmButton: false,
                    timer: 2000,
                  })
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Already Booked
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <input
        type="checkbox"
        id={`modal-${apartment.apartment_no}`}
        className="modal-toggle"
      />
      <div className="modal" role="dialog">
        <div className="modal-box bg-base-200 max-w-3xl">
          <h3 className="text-2xl font-bold text-center mb-6 text-primary">
            Apartment Agreement
          </h3>

          <div className="bg-base-100 p-4 rounded-lg mb-6">
            <div className="flex items-center gap-4">
              <div className="avatar">
                <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img
                    src={apartment.image_url || "/placeholder.svg"}
                    alt="Apartment"
                  />
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold">
                  Apartment {apartment.apartment_no}
                </h4>
                <p className="text-sm opacity-70">
                  Block {apartment.block_name}, Floor {apartment.floor_no}
                </p>
                <p className="text-primary font-bold">
                  ${apartment.rent}/month
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleAgreement} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  name="user_name"
                  value={user?.displayName}
                  onChange={handleChange}
                  className="input input-bordered"
                  readOnly
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  name="user_email"
                  value={user?.email}
                  onChange={handleChange}
                  className="input input-bordered"
                  readOnly
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Apartment No</span>
                </label>
                <input
                  type="text"
                  name="apartment_no"
                  value={formData.apartment_no}
                  onChange={handleChange}
                  className="input input-bordered"
                  readOnly
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Floor No</span>
                </label>
                <input
                  type="text"
                  name="floor_no"
                  value={formData.floor_no}
                  onChange={handleChange}
                  className="input input-bordered"
                  readOnly
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Block</span>
                </label>
                <input
                  type="text"
                  name="block_name"
                  value={formData.block_name}
                  onChange={handleChange}
                  className="input input-bordered"
                  readOnly
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Rent</span>
                </label>
                <input
                  type="text"
                  name="rent"
                  value={formData.rent}
                  onChange={handleChange}
                  className="input input-bordered"
                  readOnly
                />
              </div>
            </div>

            <div className="alert alert-info shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-current flex-shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <div>
                <h3 className="font-bold">Please Note!</h3>
                <div className="text-xs">
                  By submitting this form, you agree to our terms and
                  conditions.
                </div>
              </div>
            </div>

            <div className="modal-action mt-6">
              <button
                type="submit"
                className={`btn btn-primary ${isSubmitting ? "loading" : ""}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Confirm Agreement"}
              </button>
              <label
                htmlFor={`modal-${apartment.apartment_no}`}
                id={`close-modal-${apartment.apartment_no}`}
                className="btn"
              >
                Cancel
              </label>
            </div>
          </form>
        </div>
        <label
          className="modal-backdrop"
          htmlFor={`modal-${apartment.apartment_no}`}
        ></label>
      </div>
    </>
  );
};

ApartmentCard.propTypes = {
  apartment: PropTypes.shape({
    apartment_no: PropTypes.string.isRequired,
    floor_no: PropTypes.string.isRequired,
    block_name: PropTypes.string.isRequired,
    rent: PropTypes.number.isRequired,
    bookingStatus: PropTypes.string.isRequired,
    image_url: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
  }).isRequired,
};

export default ApartmentCard;
