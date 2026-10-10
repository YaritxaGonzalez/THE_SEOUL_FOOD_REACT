import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Text from '../components/atoms/Text';
import Button from '../components/atoms/Button';

function Home() {
  const navigate = useNavigate();

  return (
    <Container className="my-5 text-center">
      <Text variant="h1">The Seoul Food</Text>
      <Text variant="p">Los mejores ramyeon y snacks coreanos, directo a tu puerta.</Text>
      <Button variant="primary" onClick={() => navigate('/products')}>
        Ver productos
      </Button>
    </Container>
  );
}

export default Home;