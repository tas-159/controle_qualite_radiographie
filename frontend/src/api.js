import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export async function calculerTests(payload) {
  const response = await api.post("/api/calculer", payload);
  return response.data;
}
