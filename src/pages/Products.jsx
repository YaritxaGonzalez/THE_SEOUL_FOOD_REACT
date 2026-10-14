import { Container, Row } from 'react-bootstrap';
import ProductCard from '../components/organisms/ProductCard';
import { useProducts } from '../context/ProductsContext';

function Products() {
  const { products } = useProducts();
  return (
    <Container className="my-5">
      <h1 className="text-center text-light">Productos</h1>
      <Row className="justify-content-center g-0">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </Row>
    </Container>
  );
}

export default Products;