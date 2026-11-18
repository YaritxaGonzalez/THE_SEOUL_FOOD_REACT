import Button from '../atoms/Button';
import Text from '../atoms/Text';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

// Muestra "Agregar" si el producto no está en el carrito,
// y un selector  −  cantidad  +  si ya hay unidades agregadas.
function QuantityControl({ product }) {
  const { getQuantity, addToCart, decreaseItem } = useCart();
  const { isAdmin, isSeller } = useAuth();
  const quantity = getQuantity(product.id);

  // El admin no compra: no se muestran los botones de agregar al carrito
  if (isAdmin || isSeller) return null;

  if (product.stock <= 0) {
    return (
      <Text variant="div" className="qty-slot">
        <Button variant="secondary" disabled>Sin stock</Button>
      </Text>
    );
  }

  if (quantity === 0) {
    return (
      <Text variant="div" className="qty-slot">
        <Button variant="success" onClick={() => addToCart(product.id)}>Agregar</Button>
      </Text>
    );
  }

  const atMax = quantity >= product.stock;

  return (
    <Text variant="div" className="qty-slot">
      <Text variant="div" className="qty-control" role="group" aria-label={`Cantidad de ${product.name}`}>
        <Button variant="outline-success" aria-label="Quitar una unidad" onClick={() => decreaseItem(product.id)}>
          −
        </Button>
        <Text variant="span" className="qty-value" aria-live="polite">{quantity}</Text>
        <Button
          variant="success"
          aria-label="Agregar una unidad"
          title={atMax ? 'Stock máximo alcanzado' : undefined}
          disabled={atMax}
          onClick={() => addToCart(product.id)}
        >
          +
        </Button>
      </Text>
    </Text>
  );
}

export default QuantityControl;