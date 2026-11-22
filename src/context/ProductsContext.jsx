import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as productService from '../services/productService';

const ProductsContext = createContext();

// initialProducts solo se usa en los tests: evita llamar al backend
export function ProductsProvider({ children, initialProducts }) {
  const [products, setProducts] = useState(initialProducts ?? []);
  const [loading, setLoading] = useState(!initialProducts);
  const [error, setError] = useState('');

  // Pide los productos al backend (el estado solo cambia cuando llega la respuesta)
  const load = useCallback(
    () =>
      productService
        .getProducts()
        .then((list) => {
          setProducts(list);
          setError('');
        })
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false)),
    []
  );

  useEffect(() => {
    if (!initialProducts) load();
  }, [initialProducts, load]);

  // Para el botón "Reintentar"
  const reload = () => {
    setLoading(true);
    return load();
  };

  // Las acciones del admin devuelven una promesa: si el backend falla, lanzan el error
  // y la página decide qué mensaje mostrar.
  const addProduct = async (data) => {
    const created = await productService.createProduct(data);
    setProducts((prev) => [...prev, created]);
  };

  const updateProduct = async (id, price, stock) => {
    const current = products.find((p) => p.id === id);
    const updated = await productService.updateProduct(current, { price, stock });
    setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
  };

  const deleteProduct = async (id) => {
    await productService.deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <ProductsContext.Provider
      value={{ products, loading, error, reload, refresh: load, addProduct, updateProduct, deleteProduct }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}