import axios from "axios";

const server = axios.create({
  baseURL: "http://localhost:1225",
});

export default server;
