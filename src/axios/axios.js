import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.100.142:5000/api",
  headers: {
    Accept: "application/json",
  },
});

const sheets = {
  postLogin: (data) => api.post("/login/", data),
  createUser: (user) => api.post("/createUser/", user),
  postNota: (nota) => api.post("/postNota/", nota),
};
export default sheets;