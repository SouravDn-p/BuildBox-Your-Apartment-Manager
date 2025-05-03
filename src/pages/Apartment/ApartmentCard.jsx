import { useContext, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { AuthContexts } from "../../authProvider/AuthProvider";
import { Vortex } from "react-loader-spinner";
import { Navigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { useTypewriter, Cursor } from "react-simple-typewriter";

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

  const [text] = useTypewriter({
    words: ["Now!", "Today!", "Tomorrow!", "Repeat!"],
    loop: true,
    typeSpeed: 70,
  });

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
      <div className="card bg-base-100 shadow-xl relative">
        <div
          className={`absolute top-2 right-2 px-2 py-1 rounded-lg text-white text-xs font-bold ${
            apartment.bookingStatus === "available"
              ? "bg-green-500"
              : "bg-red-500"
          }`}
        >
          {apartment.bookingStatus === "available" ? "Available" : "Booked"}
        </div>

        <figure>
          <img
            src={apartment.image_url}
            alt={`Apartment ${apartment.apartment_no}`}
            className="w-full h-48 object-cover rounded-t-lg"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title text-lg font-bold">
            Apartment No: {apartment.apartment_no}
          </h2>
          <p className="text-sm text-gray-500">
            Floor No: {apartment.floor_no}
          </p>
          <p className="text-sm text-gray-500">Block: {apartment.block_name}</p>
          <p className="text-sm text-gray-500">Rent: {apartment.rent} Tk</p>
          <div className="card-actions justify-end">
            {apartment.bookingStatus === "available" ? (
              <button className="btn btn-primary">
                <a href={`#modal-${apartment.apartment_no}`}>Agreement</a>
              </button>
            ) : (
              <button
                className="btn "
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
                Booked
              </button>
            )}
          </div>
        </div>
      </div>

      <div
        className="modal"
        id={`modal-${apartment.apartment_no}`}
        role="dialog"
      >
        <div className="modal-box">
          <h3 className="text-lg font-bold">Confirm Agreement</h3>
          <form onSubmit={handleAgreement}>
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
            <div className="form-control w-full mt-2">
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

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="form-control">
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
              <div className="form-control">
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
              <div className="form-control">
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
              <div className="form-control">
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

            <div className="modal-action mt-4">
              <button
                type="submit"
                className={`btn btn-primary ${isSubmitting ? "loading" : ""}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Confirm"}
              </button>
              <a
                href="#"
                id={`close-modal-${apartment.apartment_no}`}
                className="btn btn-outline"
              >
                Cancel
              </a>
            </div>
          </form>
        </div>
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
