import { Card } from 'react-bootstrap';
import Text from '../atoms/Text';
import Table from '../atoms/Table';

function OrderDetailCard({ order }) {
  return (
    <Card className="p-4">
      <Text variant="h2" className="h4">Orden {order.id}</Text>
      <Text variant="p" className="mb-1">
        Fecha: {new Date(order.date).toLocaleString('es-CL')}
      </Text>
      <Text variant="p" className="mb-1">Cliente: {order.customer}</Text>
      <Text variant="p">Estado: {order.status}</Text>

      <Table responsive className="align-middle">
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell>Producto</Table.HeaderCell>
            <Table.HeaderCell>Precio</Table.HeaderCell>
            <Table.HeaderCell>Cantidad</Table.HeaderCell>
            <Table.HeaderCell>Subtotal</Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {order.items.map((item) => (
            <Table.Row key={item.id}>
              <Table.Cell>{item.name}</Table.Cell>
              <Table.Cell>${item.price.toLocaleString('es-CL')}</Table.Cell>
              <Table.Cell>{item.quantity}</Table.Cell>
              <Table.Cell>${(item.price * item.quantity).toLocaleString('es-CL')}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      <Text variant="p" className="fw-bold text-end mb-0">
        Total: ${order.total.toLocaleString('es-CL')}
      </Text>
    </Card>
  );
}

export default OrderDetailCard;