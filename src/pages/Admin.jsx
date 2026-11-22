import { useState } from 'react';
import { Container, Tabs, Tab, Alert } from 'react-bootstrap';
import { useProducts } from '../context/ProductsContext';
import Text from '../components/atoms/Text';
import StockTable from '../components/organisms/StockTable';
import ProductForm from '../components/organisms/ProductForm';

const EMPTY_FORM = { name: '', image: '', price: '', stock: '', description: '' };

function Admin() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [form, setForm] = useState(EMPTY_FORM);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const image = form.image.trim();

    // Validaciones antes de enviar al backend
    if (form.name.trim().length < 2) {
      setError('El nombre del producto debe tener al menos 2 caracteres.');
      return;
    }
    if (image === '') {
      setError('Ingresa la ruta de la imagen.');
      return;
    }
    if (Number(form.price) <= 0) {
      setError('El precio debe ser mayor a 0.');
      return;
    }
    if (Number(form.stock) < 0) {
      setError('El stock no puede ser negativo.');
      return;
    }
    setError('');

    try {
      await addProduct({
        ...form,
        name: form.name.trim(),
        description: form.description.trim(),
        image: image.startsWith('/') || image.startsWith('http') ? image : '/' + image,
      });
      setForm(EMPTY_FORM);
      setMessage('Producto agregado');
    } catch (err) {
      setError(err.message); // por ejemplo: "Ya existe un producto con ese nombre"
    }
  };

  const handleSave = async (id, price, stock) => {
    try {
      await updateProduct(id, price, stock);
      setError('');
      setMessage('Producto actualizado');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return;
    try {
      await deleteProduct(id);
      setError('');
      setMessage('Producto eliminado');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container className="my-5">
      <Text variant="h1" className="text-white">Panel de administración</Text>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {message && (
        <Alert variant="success" dismissible onClose={() => setMessage('')}>
          {message}
        </Alert>
      )}

      <Tabs defaultActiveKey="stock" className="mb-3">
        <Tab eventKey="stock" title="Stock">
          <StockTable products={products} onSave={handleSave} onDelete={handleDelete} />
        </Tab>

        <Tab eventKey="producto" title="Producto">
          <ProductForm form={form} onChange={handleChange} onSubmit={handleSubmit} />
        </Tab>
      </Tabs>
    </Container>
  );
}

export default Admin;