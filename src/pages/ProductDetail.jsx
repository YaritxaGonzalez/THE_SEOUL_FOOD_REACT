import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card } from 'react-bootstrap';
import Image from '../components/atoms/Image';
import Text from '../components/atoms/Text';
import Button from '../components/atoms/Button';
import QuantityControl from '../components/molecules/QuantityControl';
import PriceTag from '../components/molecules/PriceTag';
import { useProducts } from '../context/ProductsContext';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const product = products.find((p) => p.id === id);

  if (loading) {
    return (
      <Container className="my-5">
        <Text variant="p" className="text-light">Cargando producto…</Text>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="my-5">
        <Text variant="h1">Producto no encontrado</Text>
        <Button variant="secondary" onClick={() => navigate('/products')}>
          Volver a productos
        </Button>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Card className="detail-card mx-auto">
        <Image src={product.image} alt={product.name} className="card-img-top product-img" />
        <Card.Body className="text-center">
          <Text variant="h2">{product.name}</Text>
          <Text variant="p">{product.description}</Text>
          <PriceTag price={product.price} variant="h4" />
          <Text variant="div" className="d-flex flex-wrap align-items-center justify-content-center gap-2">
            <QuantityControl product={product} />
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Volver
            </Button>
          </Text>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ProductDetail;