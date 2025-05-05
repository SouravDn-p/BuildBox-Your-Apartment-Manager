import { useContext, useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Navigation, AlertCircle, X, CheckCircle } from "lucide-react";
import { AuthContexts } from "../../authProvider/AuthProvider";

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

export default function ApartmentLocation() {
  const mapRef = useRef(null);
  const { isDarkMode = true } = useContext(AuthContexts) || {};
  const apartmentCoordinates = [40.7128, -74.006];
  const address = "123 Main Street, New York, NY, 10001";
  const [mapError, setMapError] = useState(null);

  useEffect(() => {
    // Fix Leaflet marker icon issue
    import("leaflet")
      .then((L) => {
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });
      })
      .catch(() => {
        setMapError({ message: "Failed to load map resources", type: "error" });
      });

    return () => {
      if (mapRef.current) {
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <section
      className={`w-full py-16 transition-all duration-300 ${
        isDarkMode
          ? "bg-gray-950 text-white"
          : "bg-gradient-to-b from-violet-50 to-violet-100 text-gray-800"
      }`}
    >
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
        .leaflet-container {
          border-radius: 0.75rem;
        }
        .leaflet-popup-content-wrapper {
          background: ${isDarkMode ? "#1F2937" : "#FFFFFF"};
          color: ${isDarkMode ? "#F3F4F6" : "#1F2937"};
        }
        .leaflet-popup-tip {
          background: ${isDarkMode ? "#1F2937" : "#FFFFFF"};
        }
      `}</style>

      {mapError && <Toast {...mapError} onClose={() => setMapError(null)} />}

      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2
            className={`text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 animate-fadeIn`}
          >
            Apartment Location & Directions
          </h2>
          <p
            className={`mt-4 max-w-2xl mx-auto ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            } animate-fadeIn`}
          >
            Find us easily in the heart of the city, close to major landmarks
            and public transportation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div
            className={`relative group rounded-xl p-6 transition-all duration-300 hover:translate-y-[-8px] hover:shadow-xl ${
              isDarkMode ? "bg-gray-900" : "bg-white"
            } animate-slideIn`}
          >
            <div
              className={`absolute inset-0 rounded-xl transition-opacity duration-300 opacity-0 group-hover:opacity-100 ${
                isDarkMode
                  ? "bg-gradient-to-r from-slate-800 to-gray-800"
                  : "bg-gradient-to-r from-violet-100 to-indigo-100"
              }`}
            />
            <div className="relative z-10">
              <h3
                className={`text-xl font-bold mb-4 ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                How to Get Here
              </h3>
              <p
                className={`mb-6 leading-relaxed ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Our apartment is centrally located, near shopping centers,
                landmarks, and transit hubs. Accessible by car, bus, or train.
              </p>
              <div className="flex items-center gap-2 mb-4">
                <MapPin
                  className={`w-5 h-5 ${
                    isDarkMode ? "text-blue-400" : "text-blue-600"
                  }`}
                />
                <p
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  <strong
                    className={`${
                      isDarkMode ? "text-blue-400" : "text-blue-600"
                    }`}
                  >
                    Address:
                  </strong>{" "}
                  {address}
                </p>
              </div>
              <h4
                className={`text-lg font-semibold mb-3 ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Nearby Landmarks:
              </h4>
              <ul
                className={`list-disc pl-5 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                } space-y-2`}
              >
                <li>Central Park - 10 minutes' walk</li>
                <li>Times Square - 15 minutes' drive</li>
                <li>Empire State Building - 20 minutes by subway</li>
              </ul>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${apartmentCoordinates[0]},${apartmentCoordinates[1]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-6 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold hover:from-blue-600 hover:to-indigo-600 transition duration-300"
              >
                <div className="flex items-center gap-2">
                  <Navigation className="w-5 h-5" />
                  Get Directions
                </div>
              </a>
              <div className="w-12 h-1 rounded-full bg-gradient-to-r from-violet-400 to-indigo-400 mt-5 group-hover:w-20 transition-all duration-300" />
            </div>
          </div>

          <div
            className={`relative rounded-xl overflow-hidden shadow-md border ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            } animate-slideIn`}
          >
            {apartmentCoordinates[0] && apartmentCoordinates[1] ? (
              <MapContainer
                ref={mapRef}
                center={apartmentCoordinates}
                zoom={13}
                scrollWheelZoom={false}
                className="h-96"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="© <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                />
                <Marker position={apartmentCoordinates}>
                  <Popup
                    className={`${
                      isDarkMode ? "text-gray-200" : "text-gray-800"
                    } font-semibold`}
                  >
                    Welcome to our apartment!
                  </Popup>
                </Marker>
              </MapContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-96 bg-gray-800 rounded-xl">
                <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-300">
                  Unable to load map. Invalid coordinates.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
