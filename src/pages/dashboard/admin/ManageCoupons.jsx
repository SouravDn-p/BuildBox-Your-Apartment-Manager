import { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { AuthContexts } from "../../../authProvider/AuthProvider";
import { Vortex } from "react-loader-spinner";

const ManageCoupons = () => {
  const { coupons, setCoupons } = useContext(AuthContexts);
  const [loading, setLoading] = useState(true);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discount: "",
    description: "",
    title: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCoupons = () => {
    setLoading(true);
    fetch("https://buildbox-server-side.vercel.app/coupons")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setCoupons(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch coupons.",
        });
      });
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleAddCoupon = (e) => {
    e.preventDefault();
    fetch("https://buildbox-server-side.vercel.app/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCoupon),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.acknowledged) {
          Swal.fire({
            icon: "success",
            title: "Coupon Added Successfully!",
            showConfirmButton: false,
            timer: 1500,
          });
          setNewCoupon({ code: "", discount: "", description: "" });
          setIsModalOpen(false);
          fetchCoupons();
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to add coupon.",
          });
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while adding the coupon.",
        });
      });
  };

  return (
    <section>
      <div className="pt-24">
        <div className="container mx-auto p-6">
          <h2 className="text-2xl font-bold mb-4">Manage Coupons</h2>

          <button
            className="btn btn-primary mb-4"
            onClick={() => setIsModalOpen(true)}
          >
            Add Coupon
          </button>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Vortex
                visible={true}
                height="120"
                width="120"
                ariaLabel="vortex-loading"
                wrapperStyle={{}}
                wrapperClass="vortex-wrapper"
                colors={["red", "green", "blue", "yellow", "orange", "purple"]}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2">Title</th>
                    <th className="border border-gray-300 px-4 py-2">Code</th>
                    <th className="border border-gray-300 px-4 py-2">
                      Discount (%)
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.length > 0 ? (
                    coupons.map((coupon, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 px-4 py-2">
                          {coupon.title}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {coupon.code}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {coupon.discount}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {coupon.description}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="border border-gray-300 px-4 py-2 text-center"
                      >
                        No coupons found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <h3 className="font-bold text-lg mb-4">Add Coupon</h3>
            <form onSubmit={handleAddCoupon} className="space-y-4">
              <div className="form-control">
                <input
                  type="text"
                  placeholder="Coupon Title"
                  value={newCoupon.title}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, title: e.target.value })
                  }
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div className="form-control">
                <input
                  type="text"
                  placeholder="Coupon Code"
                  value={newCoupon.code}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, code: e.target.value })
                  }
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div className="form-control">
                <input
                  type="number"
                  placeholder="Discount (%)"
                  value={newCoupon.discount}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, discount: e.target.value })
                  }
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div className="form-control">
                <textarea
                  placeholder="Description"
                  value={newCoupon.description}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, description: e.target.value })
                  }
                  className="textarea textarea-bordered w-full"
                  required
                ></textarea>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default ManageCoupons;
