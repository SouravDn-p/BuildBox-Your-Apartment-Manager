import axios from "axios";

const axiosSecure = axios.create({
  baseUrl: "https://buildbox-server-side.vercel.app",
});

const useAxiosSecure = () => {
  return axiosSecure;
};

export default useAxiosSecure;
