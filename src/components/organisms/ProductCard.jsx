import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Image from '../atoms/Image';
import Button from '../atoms/Button';
import CardBody from '../molecules/CardBody';
import { useCart } from '../../context/CartContext';

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const goToDetail = () => navigate(`/products/${product.id}`);

  return (
    <Card style={{ width: '18rem' }} className="m-2">
      <div
        className="card-img-link"
        role="link"
        tabIndex={0}
        title="Ver detalles"
        onClick={goToDetail}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            goToDetail();
          }
        }}
      >
        <Image src={product.image} alt={product.name} className="card-img-top" />
      </div>
      <Card.Body className="text-center">
        <CardBody title={product.name} price={product.price} />
        <Button
          variant="success"
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