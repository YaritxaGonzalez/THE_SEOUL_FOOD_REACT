import { Container, Card } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import Image from '../components/atoms/Image';
import Text from '../components/atoms/Text';
import Button from '../components/atoms/Button';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';


function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products } = useProducts();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <Container className="my-5">
        <h1>Producto no encontrado</h1>
        <Button variant="secondary" onClick={() => navigate('/products')}>
          Volver a productos
        </Button>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Card style={{ maxWidth: '30rem' }} className="mx-auto">
        <Image src={product.image} alt={product.name} className="card-img-top" />
        <Card.Body>
          <Text variant="h2">{product.name}</Text>
          <Text variant="p">{product.description}</Text>
          <Text variant="h4">
            <span className="text-success">Precio:</span>{' '}
            ${product.price.toLocaleString('es-CL')}
          </Text>
          <Button
            variant="success"
            className="me-2"
            disabled={product.stock === 0}
            onClick={() => addToCart(product.id)}
          >
            {product.stock === 0 ? 'Sin stock' : 'Agregar'}
          </Button>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Volver
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ProductDetail;