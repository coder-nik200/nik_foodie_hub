import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export const addToCartAPI = async (foodId) => {
  try {
    const response = await api.post("/cart/add", { foodId });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to add item to cart";
  }
};

export default api; // ✅ THIS IS REQUIRED
