import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Image from '../atoms/Image';
import Button from '../atoms/Button';
import CardBody from '../molecules/CardBody';
import { useCart } from '../../context/CartContext';

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  return (
    <Card style={{ width: '18rem' }} className="m-2">
      <Image src={product.image} alt={product.name} className="card-img-top" />
      <Card.Body>
        <CardBody
          title={product.name}
          description={product.description}
          price={product.price}
        />
        <Button variant="primary" onClick={() => navigate(`/products/${product.id}`)}>
          Ver detalles
        </Button>
        <Button
          variant="success"
          className="ms-2"
          disabled={product.stock === 0}
          onClick={() => addToCart(product.id)}
        >
          {product.stock === 0 ? 'Sin stock' : 'Agregar'}
        </Button>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;