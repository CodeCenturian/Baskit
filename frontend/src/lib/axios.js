import axios from "axios";

const axiosInstance  =axios.create({
    baseURL : import.meta.mode === "development" ? "http://localhost:5000/api" : import.meta.env.VITE_PROD_BASE_URL,
    withCredentials : true // for cookies
})

export default axiosInstance