import Axios from "axios";

let urls = {
  production: `https://osapi.sentrasains.com/api/v1`,
  development: "http://localhost:8000/api/v1",
};
const api = Axios.create({
  baseURL: urls[process.env.NODE_ENV],
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default api;
