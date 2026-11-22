import { Container, Alert } from 'react-bootstrap';
import Text from '../components/atoms/Text';
import Button from '../components/atoms/Button';
import ProductGrid from '../components/organisms/ProductGrid';
import { useProducts } from '../context/ProductsContext';

function Products() {
  const { products, loading, error, reload } = useProducts();

  return (
    <Container className="my-5">
      <Text variant="h1" className="text-center text-light mb-4">Productos</Text>

      {error && (
        <Alert variant="danger" className="text-center">
          {error}{' '}
          <Button size="sm" variant="outline-danger" onClick={reload}>Reintentar</Button>
        </Alert>
      )}

      {loading ? (
        <Text variant="p" className="text-center text-light">Cargando productos…</Text>
      ) : (
        <ProductGrid products={products} />
      )}
    </Container>
  );
}

export default Products;