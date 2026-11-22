import { useState } from 'react';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Text from '../components/atoms/Text';
import OrdersTable from '../components/organisms/OrdersTable';
import { getOrders } from '../services/orderService';

function Orders() {
  const navigate = useNavigate();
  const [orders] = useState(getOrders);

  return (
    <Container className="my-5">
      <Text variant="h1" className="text-white">Órdenes</Text>
      {orders.length === 0 ? (
        <Text variant="p" className="text-light">Aún no hay órdenes registradas.</Text>
      ) : (
        <OrdersTable orders={orders} onView={(id) => navigate(`/orders/${id}`)} />
      )}
    </Container>
  );
}

export default Orders;