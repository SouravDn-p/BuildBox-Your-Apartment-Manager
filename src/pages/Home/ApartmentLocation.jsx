import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function ApartmentLocation() {
  const mapRef = useRef(null);
  const apartmentCoordinates = [40.7128, -74.006];
  const address = "123 Main Street, New York, NY, 10001";

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current._leaflet_id = null;
      }
    };
  }, []);

  return (
    <section className="py-16 bg-gradient-to-br from-indigo-800 via-purple-900 to-black text-white">
      <div className="container mx-auto px-6 lg:px-20">
        <h2 className="text-5xl font-extrabold text-center text-white bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-12">
          Apartment Location & Directions
        </h2>
        <div className="grid gap-10 lg:grid-cols-2 items-center">
          <div>
            <h3 className="text-3xl font-bold mb-4 text-pink-400">
              How to Get Here
            </h3>
            <p className="mb-6 text-gray-300 leading-relaxed">
              Our apartment is located in the heart of the city, close to major
              landmarks, shopping centers, and public transportation. Whether
              you're coming by car, bus, or train, it's easy to reach us.
            </p>
            <p className="text-gray-300 mb-4">
              <strong className="text-pink-500">Address:</strong> {address}
            </p>
            <h4 className="text-2xl font-semibold mb-3 text-purple-400">
              Nearby Landmarks:
            </h4>
            <ul className="list-disc pl-5 text-gray-300 space-y-2">
              <li>Central Park - 10 minutes' walk</li>
              <li>Times Square - 15 minutes' drive</li>
              <li>Empire State Building - 20 minutes by subway</li>
            </ul>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${apartmentCoordinates[0]},${apartmentCoordinates[1]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform"
            >
              Get Directions
            </a>
          </div>

          <div className="relative">
            <div className="rounded-lg overflow-hidden shadow-xl border-4 border-purple-500">
              <MapContainer
                ref={mapRef}
                center={apartmentCoordinates}
                zoom={13}
                scrollWheelZoom={false}
                className="h-80 rounded-lg"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                />
                <Marker position={apartmentCoordinates}>
                  <Popup className="font-semibold text-purple-700">
                    Welcome to our apartment!
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
