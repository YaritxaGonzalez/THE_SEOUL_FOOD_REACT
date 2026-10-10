import { useState } from 'react';
import { Form } from 'react-bootstrap';
import Image from '../atoms/Image';
import Button from '../atoms/Button';

function AdminRow({ product, onSave, onDelete }) {
  const [price, setPrice] = useState(product.price);
  const [stock, setStock] = useState(product.stock);

  return (
    <tr>
      <td>
        <Image src={product.image} alt={product.name} className="admin-thumb" />
      </td>
      <td>{product.name}</td>
      <td>
        <Form.Control
          type="number"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </td>
      <td>
        <Form.Control
          type="number"
          min="0"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
      </td>
      <td className="text-nowrap">
        <Button size="sm" variant="success" className="me-2" onClick={() => onSave(product.id, price, stock)}>
          Guardar
        </Button>
        <Button size="sm" variant="danger" onClick={() => onDelete(product.id)}>
          Eliminar
        </Button>
      </td>
    </tr>
  );
}

export default AdminRow;