import { useState } from 'react';
import { Container, Tabs, Tab, Table, Form, Alert } from 'react-bootstrap';
import { useProducts } from '../context/ProductsContext';
import AdminRow from '../components/molecules/AdminRow';
import Button from '../components/atoms/Button';

const EMPTY_FORM = { name: '', image: '', price: '', stock: '', description: '' };

function Admin() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [form, setForm] = useState(EMPTY_FORM);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const image = form.image.trim();
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
      <h1>Panel de administración</h1>

      {message && (
        <Alert variant="success" dismissible onClose={() => setMessage('')}>
          {message}
        </Alert>
      )}

      <Tabs defaultActiveKey="stock" className="mb-3">
        <Tab eventKey="stock" title="Stock">
          <Table responsive hover className="align-middle">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <AdminRow key={p.id} product={p} onSave={handleSave} onDelete={handleDelete} />
              ))}
            </tbody>
          </Table>
        </Tab>

        <Tab eventKey="producto" title="Producto">
          <Form onSubmit={handleSubmit} style={{ maxWidth: '28rem' }}>
            <Form.Group className="mb-3">
              <Form.Control name="name" placeholder="Nombre del producto" value={form.name} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control name="image" placeholder="Ruta de la imagen (ej: /imagenes/nuevo.webp)" value={form.image} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control type="number" min="0" name="price" placeholder="Precio" value={form.price} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control type="number" min="0" name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control name="description" placeholder="Descripción" value={form.description} onChange={handleChange} />
            </Form.Group>
            <Button type="submit" variant="primary">Agregar producto</Button>
          </Form>
        </Tab>
      </Tabs>
    </Container>
  );
}

export default Admin;