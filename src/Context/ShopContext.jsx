"use client";

import { createContext, useContext, useState, useEffect } from "react";

const ShopContext = createContext();

export function ShopProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const savedCart = localStorage.getItem("cart");
        const savedFavorites = localStorage.getItem("favorites");

        if (savedCart) {
          setCart(JSON.parse(savedCart));
        }
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
      } catch (e) {
        console.error("Failed to parse from localStorage:", e);
      } finally {
        setIsLoaded(true);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

 
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to localStorage:", e);
    }
  }, [cart, isLoaded]);


  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    } catch (e) {
      console.error("Failed to save favorites to localStorage:", e);
    }
  }, [favorites, isLoaded]);

  const addToCart = (product) => {
    setCart((prev) => {
      const match = (item) => item.id === product.id && (item.selectedOption || "") === (product.selectedOption || "");
      const exists = prev.find(match);

      if (exists) {
        return prev.map((item) =>
          match(item)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...prev,
        {
          ...product,
          quantity: product.quantity || 1,
          inStock: product.inStock,
        },
      ];
    });
  };

  const removeFromCart = (product) => {
    setCart((prev) => prev.filter((item) => {
      if (product.selectedOption !== undefined) {
        return !(item.id === product.id && (item.selectedOption || "") === (product.selectedOption || ""));
      }
      return item.id !== product.id;
    }));
  };

  const decreaseQuantity = (product) => {
    setCart((prev) => {
      const match = (item) => item.id === product.id && (product.selectedOption !== undefined ? (item.selectedOption || "") === (product.selectedOption || "") : true);
      const item = prev.find(match);
      if (!item) return prev;
      if (item.quantity <= 1) {
        return prev.filter((i) => !match(i));
      }
      return prev.map((i) =>
        match(i) ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
  };

  const getItemQuantity = (productId) => {
    const item = cart.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart({ id: productId });
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const toggleFavorite = (product) => {
    setFavorites((prev) => {
      const exists = prev.some((item) => item.id === product.id);

      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }

      return [...prev, product];
    });
  };

  const removeFavorite = (product) => {
    setFavorites((prev) => prev.filter((item) => item.id !== product.id));
  };

  return (
    <ShopContext.Provider
      value={{
        cart,
        favorites,
        totalItems,
        totalPrice,
        isLoaded,
        addToCart,
        removeFromCart,
        decreaseQuantity,
        updateQuantity,
        clearCart,
        getItemQuantity,
        toggleFavorite,
        removeFavorite,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  return useContext(ShopContext);
}