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
    // Better error handling
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Failed to add item to cart";
    throw message;
  }
};

export default api; // ✅ THIS IS REQUIRED
