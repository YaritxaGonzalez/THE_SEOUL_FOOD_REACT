import { useEffect, useState } from 'react';
import { Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Text from '../components/atoms/Text';
import OrdersTable from '../components/organisms/OrdersTable';
import { getOrders } from '../services/orderService';

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getOrders()
      .then((list) => active && setOrders(list))
      .catch((e) => active && setError(e.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <Container className="my-5">
      <Text variant="h1" className="text-white">Órdenes</Text>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <Text variant="p" className="text-light">Cargando órdenes…</Text>
      ) : orders.length === 0 ? (
        !error && <Text variant="p" className="text-light">Aún no hay órdenes registradas.</Text>
      ) : (
        <OrdersTable orders={orders} onView={(id) => navigate(`/orders/${id}`)} />
      )}
    </Container>
  );
}

export default Orders;