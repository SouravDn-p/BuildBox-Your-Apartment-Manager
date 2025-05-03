import notFound from "../assets/notFound.png";

const NotFound = () => {
  return (
    <div className="flex flex-col  items-center justify-center min-h-screen bg-gray-600 rounded">
      <h1 className="text-2xl font-bold text-center text-white mb-4">
        Oops! Not Found
      </h1>
      <p className="text-center text-white max-w-md">
        We couldn't find what you were looking for. Please check back later or
        try searching again.
      </p>
      <button
        onClick={() => window.history.back()}
        className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
      >
        Go Back
      </button>
    </div>
  );
};

export default NotFound;
