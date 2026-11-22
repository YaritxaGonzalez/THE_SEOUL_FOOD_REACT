import Table from '../atoms/Table';
import OrderRow from '../molecules/OrderRow';

function OrdersTable({ orders, onView }) {
  return (
    <Table responsive hover className="align-middle">
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Orden</Table.HeaderCell>
          <Table.HeaderCell>Fecha</Table.HeaderCell>
          <Table.HeaderCell>Cliente</Table.HeaderCell>
          <Table.HeaderCell>Total</Table.HeaderCell>
          <Table.HeaderCell>Estado</Table.HeaderCell>
          <Table.HeaderCell>Acciones</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {orders.map((order) => (
          <OrderRow key={order.id} order={order} onView={onView} />
        ))}
      </Table.Body>
    </Table>
  );
}

export default OrdersTable;