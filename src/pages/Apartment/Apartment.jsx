import { useLoaderData } from "react-router-dom";
import ApartmentList from "./ApartmentList";

const Apartment = () => {
  const apartments = useLoaderData();
  return (
    <section className=" bg-gradient-to-br from-purple-900 via-purple-800 to-gray-900 text-white">
      <div className="pt-24 mx-auto max-w-screen-lg  text-white">
        <ApartmentList apartments={apartments} />
      </div>
    </section>
  );  
};

export default Apartment;
