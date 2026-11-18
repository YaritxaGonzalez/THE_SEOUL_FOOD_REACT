import { Container } from 'react-bootstrap';
import Text from '../components/atoms/Text';
import ProductGrid from '../components/organisms/ProductGrid';
import { useProducts } from '../context/ProductsContext';

function Products() {
  const { products } = useProducts();
  return (
    <Container className="my-5">
      <Text variant="h1" className="text-center text-light mb-4">Productos</Text>
      <ProductGrid products={products} />
    </Container>
  );
}

export default Products;