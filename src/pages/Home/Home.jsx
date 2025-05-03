import { Helmet } from "react-helmet-async";
import Banner from "./Banner";
import AboutBuilding from "./AboutBuilding";
import CouponsSection from "./CouponsSection";
import ApartmentLocation from "./ApartmentLocation";
import { useLoaderData } from "react-router-dom";

export default function Home() {
  const coupons = useLoaderData();
  return (
    <div className="bg-slate-600 mx-auto">
      <Helmet>
        <title>Sd BuildBox | Home</title>
      </Helmet>
      <Banner />
      <AboutBuilding />
      <CouponsSection coupons={coupons} />
      <ApartmentLocation />
    </div>
  );
}
