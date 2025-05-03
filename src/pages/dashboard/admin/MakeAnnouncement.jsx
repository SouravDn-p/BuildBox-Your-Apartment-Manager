import { useState } from "react";
import Swal from "sweetalert2";

const MakeAnnouncement = () => {
  const [announcement, setAnnouncement] = useState({
    title: "",
    description: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAnnouncement = { ...announcement };

    fetch("https://buildbox-server-side.vercel.app/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAnnouncement),
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
            title: "Announcement Added Successfully!",
            showConfirmButton: false,
            timer: 1500,
          });
          setAnnouncement({ title: "", description: "" });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: data.message || "Failed to add announcement.",
          });
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while adding the announcement.",
        });
      });
  };

  return (
    <div>
      <div className=" pt-20">
        <div className="bg-white p-6  rounded shadow max-w-md mx-auto mt-8">
          <h2 className="text-2xl text-black text-center font-bold mb-4">
            Make Announcement
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={announcement.title}
                onChange={(e) =>
                  setAnnouncement({ ...announcement, title: e.target.value })
                }
                className="input input-bordered w-full"
                required
              />
            </div>
            <div className="form-control">
              <textarea
                name="description"
                placeholder="Description"
                value={announcement.description}
                onChange={(e) =>
                  setAnnouncement({
                    ...announcement,
                    description: e.target.value,
                  })
                }
                className="textarea textarea-bordered w-full"
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary w-full">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MakeAnnouncement;
