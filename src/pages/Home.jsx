import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import NeonHero from '../components/molecules/NeonHero';
import Button from '../components/atoms/Button';
import ProductCarousel from '../components/organisms/ProductCarousel';

function Home() {
  const navigate = useNavigate();

  return (
    <Container className="my-5 text-center text-light">
      <NeonHero
        title="The Seoul Food"
        subtitle="Los mejores ramyeon y snacks coreanos, directo a tu puerta."
      />

      <ProductCarousel />

      <Button variant="primary" className="mt-4" onClick={() => navigate('/products')}>
        Ver productos
      </Button>
    </Container>
  );
}

export default Home;