import { Navigate, useLoaderData } from "react-router-dom";
import { useContext } from "react";
import { AuthContexts } from "../providers/AuthProvider";

const ReviewDetails = () => {
  const loadedData = useLoaderData();
  const { user } = useContext(AuthContexts);
  console.log(loadedData);

  const handleAddToWatchlist = ({
    reviewId,
    gameTitle,
    rating,
    userEmail,
    userName,
    genre,
    gameCover,
    publishingYear,
    reviewDescription,
  }) => {
    if (!user) {
      alert("Please log in to add to your watchlist.");
      return;
    }
    const watchlistEntry = {
      reviewId,
      gameTitle,
      rating,
      userEmail,
      userName,
      genre,
      gameCover,
      publishingYear,
      reviewDescription,
      savedEmail: user?.email
    };

    fetch(
      "https://chill-gamer-server-side-three.vercel.app/watchlist",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(watchlistEntry),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.insertedId) {
          alert("Added to Watchlist successfully!");
          const navigate = Navigate();
          navigate("/all-reviews");
        } else {
          alert("Failed to add to Watchlist.");
        }
      })
      .catch((error) => console.error("Error adding to Watchlist:", error));
  };

  return (
    <>
      <h1 className="text-4xl font-bold text-center mb-6 text-primary py-4">
        Show Review Details
      </h1>
      <div className="bg-base-200 container mx-auto w-10/12  py-10 rounded-lg">
        <div className="hero-content flex-col lg:flex-row items-start gap-10">
          <div className="lg:w-2/5 w-full">
            <img
              alt={loadedData?.gameTitle || "Game Cover"}
              src={
                loadedData?.gameCover || "https://via.placeholder.com/300x400"
              }
              className="rounded-xl shadow-xl w-full"
            />
          </div>

          <div className="lg:w-4/5 w-full">
            <h1 className="text-5xl font-extrabold mb-6 text-primary">
              {loadedData?.gameTitle || "Unknown Game Title"}
            </h1>
            <p className="text-gray-600 text-lg mb-6">
              {loadedData?.reviewDescription ||
                "No detailed review is available for this game."}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-xl">
                  <strong>Rating:</strong> {loadedData?.rating || "N/A"}/10
                </p>
                <p className="text-xl">
                  <strong>Genre:</strong> {loadedData?.genre || "N/A"}
                </p>
                <p className="text-xl">
                  <strong>Publishing Year:</strong>
                  {loadedData?.publishingYear || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xl">
                  <strong>Reviewer’s Name:</strong>
                  {loadedData?.userName || "Anonymous"}
                </p>
                <p className="text-xl w-full">
                  <strong>Reviewer’s Email: </strong>
                  {loadedData?.userEmail || "Not Provided"}
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                handleAddToWatchlist({
                  reviewId: loadedData._id,
                  gameTitle: loadedData.gameTitle,
                  rating: loadedData.rating,
                  userEmail: loadedData?.userEmail,
                  userName: loadedData?.userName || "Anonymous",
                  genre: loadedData?.genre,
                  gameCover: loadedData?.gameCover,
                  publishingYear: loadedData?.publishingYear,
                  reviewDescription: loadedData?.reviewDescription,
                })
              }
              className="btn btn-primary px-8 text-lg font-semibold shadow-md hover:scale-105 transition-transform"
            >
              Add to WatchList
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewDetails;
