import axios from "axios";

const axiosPublic = axios.create({
  baseUrl: "https://buildbox-server-side.vercel.app",
});

const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
