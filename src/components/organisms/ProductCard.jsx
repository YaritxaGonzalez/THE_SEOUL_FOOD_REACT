import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Image from '../atoms/Image';
import CardBody from '../molecules/CardBody';
import QuantityControl from '../molecules/QuantityControl';
import Text from '../atoms/Text';

function ProductCard({ product }) {
  const navigate = useNavigate();

  const goToDetail = () => navigate(`/products/${product.id}`);

  return (
    <Card className="product-card">
      <Text
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
        <Image src={product.image} alt={product.name} className="card-img-top product-img" />
      </Text>
      <Card.Body className="text-center d-flex flex-column">
        <CardBody title={product.name} price={product.price} />
        <Text className="mt-auto">
          <QuantityControl product={product} />
        </Text>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;