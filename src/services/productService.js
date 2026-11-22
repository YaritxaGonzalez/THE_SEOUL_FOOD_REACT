import { api } from './api';
import { API_ORIGIN } from './config';

// Backend → frontend (los componentes siguen usando name, price, image...)
function toProduct(p) {
  return {
    id: String(p.id),
    name: p.nombre,
    description: p.descripcion ?? '',
    price: p.precio,
    stock: p.stock ?? 0,
    category: p.categoria,
    // Las imágenes subidas viven en el backend; las del catálogo, en el frontend
    image: p.imagen?.startsWith('/uploads/') ? `${API_ORIGIN}${p.imagen}` : p.imagen,
  };
}

// Frontend → backend
function toPayload({ name, description, price, stock, category, image }) {
  return {
    nombre: name,
    descripcion: description,
    precio: Number(price),
    stock: Number(stock),
    categoria: category,
    imagen: image,
  };
}

export async function getProducts() {
  const list = await api.get('/productos', { auth: false });
  return list.map(toProduct);
}

export async function createProduct(data) {
  const created = await api.post('/productos', toPayload({ category: 'Ramyeon', ...data }));
  return toProduct(created);
}

// El backend exige el producto completo; la imagen se omite para no pisar su ruta
export async function updateProduct(product, { price, stock }) {
  const updated = await api.put(
    `/productos/${product.id}`,
    toPayload({ ...product, price, stock, image: undefined })
  );
  return toProduct(updated);
}

export function deleteProduct(id) {
  return api.delete(`/productos/${id}`);
}