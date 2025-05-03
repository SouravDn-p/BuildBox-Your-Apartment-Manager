import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContexts } from "../authProvider/AuthProvider";
import { Vortex } from "react-loader-spinner";

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContexts);
  const location = useLocation();

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center h-screen">
  //       <Vortex
  //         visible={true}
  //         height="180"
  //         width="180"
  //         ariaLabel="vortex-loading"
  //         wrapperStyle={{}}
  //         wrapperClass="vortex-wrapper"
  //         colors={["red", "green", "blue", "yellow", "orange", "purple"]}
  //       />
  //     </div>
  //   );
  // }

  if (user) {
    return children;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
