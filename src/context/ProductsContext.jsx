import { createContext, useContext, useState } from 'react';
import { loadCatalog, createProduct, saveEdit, removeProduct } from '../utils/catalog';

const ProductsContext = createContext();

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(loadCatalog);

  const addProduct = (data) => {
    createProduct(data);
    setProducts(loadCatalog());
  };

  const updateProduct = (id, price, stock) => {
    saveEdit(id, price, stock);
    setProducts(loadCatalog());
  };

  const deleteProduct = (id) => {
    removeProduct(id);
    setProducts(loadCatalog());
  };

  return (
    <ProductsContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}