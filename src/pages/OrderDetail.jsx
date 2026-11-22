import { Container } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import Text from '../components/atoms/Text';
import Button from '../components/atoms/Button';
import OrderDetailCard from '../components/organisms/OrderDetailCard';
import { getOrderById } from '../services/orderService';

function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = getOrderById(id);

  if (!order) {
    return (
      <Container className="my-5">
        <Text variant="h1" className="text-white">Orden no encontrada</Text>
        <Button variant="secondary" onClick={() => navigate('/orders')}>
          Volver a órdenes
        </Button>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <OrderDetailCard order={order} />
      <Button variant="secondary" className="mt-3" onClick={() => navigate('/orders')}>
        Volver a órdenes
      </Button>
    </Container>
  );
}

export default OrderDetail;