import React, { createContext, useContext, useState } from "react";

type Product = any;

type ShopContextType = {
  wishlist: Product[];
  bag: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (id: string) => void;
  addToBag: (product: Product) => void;
};

const ShopContext = createContext<ShopContextType | null>(null);

export const ShopProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [bag, setBag] = useState<Product[]>([]);

  const addToWishlist = (product: Product) => {
    setWishlist((prev) =>
      prev.find((p) => p._id === product._id) ? prev : [...prev, product]
    );
  };

  const removeFromWishlist = (id: string) => {
    setWishlist((prev) => prev.filter((p) => p._id !== id));
  };

  const addToBag = (product: Product) => {
    setBag((prev) =>
      prev.find((p) => p._id === product._id) ? prev : [...prev, product]
    );
  };

  return (
    <ShopContext.Provider
      value={{ wishlist, bag, addToWishlist, removeFromWishlist, addToBag }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used inside ShopProvider");
  return ctx;
};
