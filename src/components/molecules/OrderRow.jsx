import Table from '../atoms/Table';
import Button from '../atoms/Button';

function OrderRow({ order, onView }) {
  return (
    <Table.Row>
      <Table.Cell>{order.id}</Table.Cell>
      <Table.Cell>{new Date(order.date).toLocaleString('es-CL')}</Table.Cell>
      <Table.Cell>{order.customer}</Table.Cell>
      <Table.Cell>${order.total.toLocaleString('es-CL')}</Table.Cell>
      <Table.Cell>{order.status}</Table.Cell>
      <Table.Cell>
        <Button size="sm" variant="primary" onClick={() => onView(order.id)}>
          Ver detalle
        </Button>
      </Table.Cell>
    </Table.Row>
  );
}

export default OrderRow;