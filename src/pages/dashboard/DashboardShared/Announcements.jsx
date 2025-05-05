import { useLoaderData } from "react-router-dom";
import { useState, useEffect } from "react";
import LoadingSpinner from "../../shared/LoadingSpinner";
import { Megaphone, Calendar, AlertCircle, X, CheckCircle } from "lucide-react";
import authHook from "../../useHook/authHook";

// eslint-disable-next-line react/prop-types
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 flex max-w-sm p-4 text-white rounded-lg shadow-lg animate-slideIn">
      <div
        className={`p-2 rounded-l-lg ${
          type === "success"
            ? "bg-green-500"
            : type === "error"
            ? "bg-red-500"
            : "bg-blue-500"
        }`}
      >
        {type === "success" ? (
          <CheckCircle size={20} />
        ) : (
          <AlertCircle size={20} />
        )}
      </div>
      <div className="flex-1 p-4 bg-gray-800 rounded-r-lg">
        <p className="text-gray-200">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="absolute top-1 right-1 text-gray-400 hover:text-gray-200"
      >
        <X size={16} />
      </button>
    </div>
  );
};

const Announcements = () => {
  const announcements = useLoaderData();
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const isDarkMode = authHook();

  useEffect(() => {
    if (announcements) {
      console.log("Announcements:", announcements);
      if (announcements.length === 0) {
        setToast({ message: "No announcements available", type: "info" });
      }
      setLoading(false);
    } else {
      setToast({ message: "Failed to load announcements", type: "error" });
      setLoading(false);
    }
  }, [announcements]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <section className="w-full min-h-screen bg-gray-900 text-white">
      <style jsx="true">{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideIn {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="max-w-4xl mx-auto pt-24 px-4">
        <div className="relative rounded-2xl mb-12 p-8 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 animate-fadeIn">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-white opacity-10 blur-xl"></div>
            <div className="absolute top-1/2 -right-24 w-80 h-80 rounded-full bg-white opacity-10 blur-xl"></div>
          </div>
          <div className="relative text-center">
            <h1 className="text-4xl font-extrabold text-white mb-4">
              Announcements
            </h1>
            <p className="text-xl text-purple-100">
              Stay updated with the latest community news.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {announcements.length > 0 ? (
            announcements.map((announcement) => (
              <div
                key={announcement._id}
                className="rounded-lg bg-gray-800 p-6 shadow-md hover:shadow-lg transition-shadow duration-300 animate-slideIn"
              >
                <div className="flex items-start gap-4">
                  <Megaphone className="text-blue-400 w-6 h-6 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">
                      {announcement.title}
                    </h3>
                    <p className="text-gray-300 mt-2">
                      {announcement.description}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <Calendar className="text-gray-400 w-4 h-4" />
                      <p className="text-sm text-gray-400">
                        {formatDate(announcement.date)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center py-12 bg-gray-800 rounded-lg shadow-md animate-slideIn">
              <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-300">
                No announcements available at this time.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Announcements;
