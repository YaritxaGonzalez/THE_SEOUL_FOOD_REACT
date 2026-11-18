import { Form } from 'react-bootstrap';
import Input from '../atoms/Input';
import Button from '../atoms/Button';

function ProductForm({ form, onChange, onSubmit }) {
  return (
    <Form onSubmit={onSubmit} style={{ maxWidth: '28rem' }}>
      <Input className="mb-3" name="name" placeholder="Nombre del producto" value={form.name} onChange={onChange} required />
      <Input className="mb-3" name="image" placeholder="Ruta de la imagen (ej: /imagenes/nuevo.webp)" value={form.image} onChange={onChange} required />
      <Input className="mb-3" type="number" min="0" name="price" placeholder="Precio" value={form.price} onChange={onChange} required />
      <Input className="mb-3" type="number" min="0" name="stock" placeholder="Stock" value={form.stock} onChange={onChange} required />
      <Input className="mb-3" name="description" placeholder="Descripción" value={form.description} onChange={onChange} />
      <Button type="submit" variant="primary">Agregar producto</Button>
    </Form>
  );
}

export default ProductForm;