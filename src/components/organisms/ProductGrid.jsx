import { Row, Col } from 'react-bootstrap';
import ProductCard from './ProductCard';

function ProductGrid({ products }) {
  return (
    <Row className="g-4 justify-content-center">
      {products.map((product) => (
        <Col key={product.id} xs={12} sm={6} lg={4} xl={3} className="d-flex">
          <ProductCard product={product} />
        </Col>
      ))}
    </Row>
  );
}

export default ProductGrid;