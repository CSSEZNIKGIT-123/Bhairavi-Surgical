'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const QuoteContext = createContext({
  quoteItems: [],
  isOpen: false,
  openQuote: () => {},
  closeQuote: () => {},
  toggleQuote: () => {},
  addToQuote: () => {},
  removeFromQuote: () => {},
  updateQuoteItem: () => {},
  clearQuote: () => {},
  quoteCount: 0,
});

export function QuoteProvider({ children }) {
  const [quoteItems, setQuoteItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('bhairavi_quote');
      if (stored) {
        setQuoteItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load quote items', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('bhairavi_quote', JSON.stringify(quoteItems));
    } catch (e) {
      console.error('Failed to save quote items', e);
    }
  }, [quoteItems]);

  const openQuote = () => setIsOpen(true);
  const closeQuote = () => setIsOpen(false);
  const toggleQuote = () => setIsOpen((prev) => !prev);

  const addToQuote = (product, quantity = null, targetPrice = null) => {
    const defaultQty = quantity || product.moq || 10;
    setQuoteItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + defaultQty }
            : item
        );
      }
      return [
        ...prev,
        {
          id: `quote-${product.id}-${Date.now()}`,
          product,
          quantity: defaultQty,
          targetPrice: targetPrice || product.b2bBasePrice || product.retailPrice,
        },
      ];
    });
    setIsOpen(true);
  };

  const updateQuoteItem = (itemId, updates) => {
    setQuoteItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, ...updates } : item))
    );
  };

  const removeFromQuote = (itemId) => {
    setQuoteItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearQuote = () => {
    setQuoteItems([]);
  };

  const quoteCount = quoteItems.length;

  return (
    <QuoteContext.Provider
      value={{
        quoteItems,
        isOpen,
        openQuote,
        closeQuote,
        toggleQuote,
        addToQuote,
        removeFromQuote,
        updateQuoteItem,
        clearQuote,
        quoteCount,
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
}

export const useQuote = () => useContext(QuoteContext);
