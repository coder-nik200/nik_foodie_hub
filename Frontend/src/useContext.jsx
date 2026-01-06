import api from "./api/axios";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem("cart");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  const addToCart = (product) => {
    // Normalize product to use variantId consistently
    const normalizedProduct = {
      ...product,
      variantId: product.variantId || product.id, // Use variantId if available, otherwise use id
    };

    setCart((prev) => {
      const exists = prev.find(
        (p) => (p.variantId || p.id) === (normalizedProduct.variantId || normalizedProduct.id)
      );
      if (exists)
        return prev.map((p) =>
          (p.variantId || p.id) === (normalizedProduct.variantId || normalizedProduct.id)
            ? { ...p, qty: (p.qty || 1) + 1 }
            : p
        );
      return [...prev, { ...normalizedProduct, qty: 1 }];
    });
  };

  const removeFromCart = (variantId) => {
    setCart((prev) => prev.filter((p) => (p.variantId || p.id) !== variantId));
  };

  useEffect(() => {
    api
      .get("/auth/profile", { withCredentials: true })
      .then(({ data }) => {
        console.log("Profile response:", data);
        setUser(data);
        setReady(true);
      })
      .catch(() => {
        setUser(null);
        setReady(true);
      });
  }, []);

  return (
    <UserContext.Provider
      value={{ user, setUser, ready, cart, addToCart, removeFromCart }}
    >
      {children}
    </UserContext.Provider>
  );
}
