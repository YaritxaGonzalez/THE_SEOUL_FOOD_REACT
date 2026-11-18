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

  const handleSubmit = (e) => {
    e.preventDefault();
    const image = form.image.trim();

    // Validaciones antes de crear el producto
    if (form.name.trim().length < 2) {
      setError('El nombre del producto debe tener al menos 2 caracteres.');
      return;
    }
    if (image === '') {
      setError('Ingresa la ruta de la imagen.');
      return;
    }
    if (Number(form.price) < 0 || Number(form.stock) < 0) {
      setError('El precio y el stock no pueden ser negativos.');
      return;
    }
    setError('');

    addProduct({
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
      image: image.startsWith('/') || image.startsWith('http') ? image : '/' + image,
    });
    setForm(EMPTY_FORM);
    setMessage('Producto agregado');
  };

  const handleSave = (id, price, stock) => {
    updateProduct(id, price, stock);
    setMessage('Producto actualizado');
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Eliminar este producto?')) {
      deleteProduct(id);
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