'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext({
  items: [],
  isOpen: false,
  openCart: () => {},
  closeCart: () => {},
  toggleCart: () => {},
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  itemCount: 0,
  subtotal: 0,
});

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('bhairavi_cart');
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load cart', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('bhairavi_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  }, [items]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const getEffectiveUnitPrice = (product, quantity, mode = 'B2C') => {
    if (mode === 'B2B') {
      if (product.priceTiers && product.priceTiers.length > 0) {
        // Find matching tier
        const sortedTiers = [...product.priceTiers].sort((a, b) => b.minQty - a.minQty);
        const match = sortedTiers.find((tier) => quantity >= tier.minQty);
        if (match) return match.unitPrice;
      }
      return product.b2bBasePrice || product.salePrice || product.retailPrice;
    }
    return product.salePrice || product.retailPrice;
  };

  const addItem = (product, quantity = 1, mode = 'B2C') => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.mode === mode
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        const unitPrice = getEffectiveUnitPrice(product, newQty, mode);
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          unitPrice,
        };
        return updated;
      } else {
        const unitPrice = getEffectiveUnitPrice(product, quantity, mode);
        return [
          ...prev,
          {
            id: `${product.id}-${mode}-${Date.now()}`,
            product,
            quantity,
            unitPrice,
            mode,
          },
        ];
      }
    });
    setIsOpen(true);
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const unitPrice = getEffectiveUnitPrice(item.product, newQuantity, item.mode);
          return { ...item, quantity: newQuantity, unitPrice };
        }
        return item;
      })
    );
  };

  const removeItem = (itemId) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
