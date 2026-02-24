import toast from "react-hot-toast";
import {
  getCartAPI,
  addToCartAPI,
  decrementCartItemAPI,
  removeFromCartAPI,
  clearCartAPI,
} from "./api/axios";
import api from "./api/axios";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [cart, setCart] = useState([]);

  // ✅ FETCH USER
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/me");
        setUser(res.data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setReady(true);
      }
    };

    fetchUser();
  }, []);

  // ✅ FETCH CART FROM BACKEND
  const fetchCart = async () => {
    try {
      const data = await getCartAPI();
      setCart(data.cart?.items || []);
    } catch (error) {
      console.log("Cart fetch error:", error);
      setCart([]);
    }
  };

  // ✅ FETCH CART WHEN USER CHANGES
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [user]);

  // ✅ ADD TO CART
  const addToCart = async (foodId) => {
    try {
      await addToCartAPI(foodId);
      await fetchCart();
      toast.success("Item added to cart ✅");
    } catch (error) {
      toast.error(error);
    }
  };

  // ✅ DECREMENT
  const decrementQty = async (foodId) => {
    try {
      await decrementCartItemAPI(foodId);
      await fetchCart();
    } catch (error) {
      toast.error(error);
    }
  };

  // ✅ REMOVE ITEM
  const removeFromCart = async (foodId) => {
    try {
      await removeFromCartAPI(foodId);
      await fetchCart();
      toast.success("Item removed ❌");
    } catch (error) {
      toast.error(error);
    }
  };

  // ✅ CLEAR CART
  const clearCart = async () => {
    try {
      await clearCartAPI();
      setCart([]);
      toast.success("Cart cleared 🗑️");
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        ready,
        cart,
        addToCart,
        decrementQty,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
