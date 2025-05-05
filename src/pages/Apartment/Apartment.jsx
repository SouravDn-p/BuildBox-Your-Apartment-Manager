import { useLoaderData } from "react-router-dom";
import ApartmentList from "./ApartmentList";
import { useState,  useEffect } from "react";

const Header = ({ header, title }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { isDarkMode } = true;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`pt-8 transition-colors duration-300 ${
        isDarkMode ? "text-white" : "text-gray-800"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div
          className={`relative overflow-hidden rounded-2xl mb-16 p-8 md:p-12 transition-all duration-700 transform ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 opacity-90"></div>

          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-white opacity-15 blur-xl"></div>
            <div className="absolute top-1/2 -right-24 w-80 h-80 rounded-full bg-white opacity-15 blur-xl"></div>
            <div className="absolute -bottom-24 left-1/3 w-72 h-72 rounded-full bg-white opacity-15 blur-xl"></div>
          </div>

          <div className="relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              {header}
            </h1>
            <p className="mt-3 text-xl text-blue-100 max-w-2xl mx-auto">
              {title}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Apartment = () => {
  const apartments = useLoaderData();
  return (
    <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white min-h-screen">
      <div className="pt-24 mx-auto max-w-screen-lg text-white">
        <Header
          header="Explore Available Apartments"
          title="Find the perfect apartment for you with Build Box"
        />
        <ApartmentList apartments={apartments} />
      </div>
    </section>
  );
};

export default Apartment;
