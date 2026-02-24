import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

// GET CURRENT CART
export const getCartAPI = async () => {
  const response = await api.get("/cart");
  return response.data;
};

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

// DECREMENT ITEM QUANTITY
export const decrementCartItemAPI = async (foodId) => {
  try {
    const response = await api.post("/cart/decrement", { foodId });
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to decrement item";
    throw message;
  }
};

// export const decrementCartItemAPI = async (foodId) => {
//   const response = await api.post("/cart/decrement", { foodId });
//   return response.data;
// };

// REMOVE ITEM FROM CART
export const removeFromCartAPI = async (foodId) => {
  try {
    const response = await api.post("/cart/remove", { foodId });
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Failed to remove item";
    throw message; // ✅ throw string only
  }
};

// export const removeFromCartAPI = async (foodId) => {
//   const response = await api.post("/cart/remove", { foodId });
//   return response.data;
// };

// CLEAR CART / CHECKOUT
export const clearCartAPI = async () => {
  const response = await api.post("/cart/clear");
  return response.data;
};

export default api; // ✅ THIS IS REQUIRED
