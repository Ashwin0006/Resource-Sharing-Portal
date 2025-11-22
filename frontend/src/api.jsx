import axios from "axios";

export default axios.create({
  baseURL: "https://resource-sharing-portal.onrender.com/api",
  // baseURL: "http://localhost:5000/api",
});
