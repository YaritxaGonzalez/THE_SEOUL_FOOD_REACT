import { createContext, useContext, useEffect, useState } from 'react';
import { useProducts } from './ProductsContext';


const CART_KEY = 'seoulfood_carrito';
const CartContext = createContext();

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || {};
  } catch {
    return {};
  }
}

export function CartProvider({ children }) {
  const { products } = useProducts();
  const [cart, setCart] = useState(loadCart);
  const addToCart = (id) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    setCart((prev) => {
      const current = prev[id] || 0;
      if (current >= product.stock) return prev;
      return { ...prev, [id]: current + 1 };
    });
  };

  const decreaseItem = (id) => {
    setCart((prev) => {
      const next = { ...prev, [id]: (prev[id] || 0) - 1 };
      if (next[id] <= 0) delete next[id];
      return next;
    });
  };

  const removeItem = (id) => {
    setCart((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const items = Object.entries(cart)
    .map(([id, quantity]) => ({ product: products.find((p) => p.id === id), quantity }))
    .filter((item) => item.product);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, totalItems, totalPrice, addToCart, decreaseItem, removeItem }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}