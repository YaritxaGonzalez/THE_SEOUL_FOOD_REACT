import { useState } from 'react';
import Image from '../atoms/Image';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import Table from '../atoms/Table';

function AdminRow({ product, onSave, onDelete }) {
  const [price, setPrice] = useState(product.price);
  const [stock, setStock] = useState(product.stock);

  // Valores inválidos: vacío o negativo (no se puede guardar)
  const priceInvalid = price === '' || Number(price) <= 0;
  const stockInvalid = stock === '' || Number(stock) < 0;

  return (
    <Table.Row>
      <Table.Cell>
        <Image src={product.image} alt={product.name} className="admin-thumb" />
      </Table.Cell>
      <Table.Cell>{product.name}</Table.Cell>
      <Table.Cell>
        <Input
          type="number"
          min="0"
          value={price}
          isInvalid={priceInvalid}
          onChange={(e) => setPrice(e.target.value)}
        />
      </Table.Cell>
      <Table.Cell>
        <Input
          type="number"
          min="0"
          value={stock}
          isInvalid={stockInvalid}
          onChange={(e) => setStock(e.target.value)}
        />
      </Table.Cell>
      <Table.Cell className="text-nowrap">
        <Button size="sm" variant="success" className="me-2" disabled={priceInvalid || stockInvalid} onClick={() => onSave(product.id, price, stock)}>
          Guardar
        </Button>
        <Button size="sm" variant="danger" onClick={() => onDelete(product.id)}>
          Eliminar
        </Button>
      </Table.Cell>
    </Table.Row>
  );
}

export default AdminRow;