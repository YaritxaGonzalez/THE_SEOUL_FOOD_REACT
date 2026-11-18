import { ListGroup } from 'react-bootstrap';
import Image from '../atoms/Image';
import Text from '../atoms/Text';
import Button from '../atoms/Button';

function CartItem({ product, quantity, onDecrease, onIncrease, onRemove }) {
  return (
    <ListGroup.Item className="d-flex align-items-center gap-2">
      <Image src={product.image} alt={product.name} className="cart-img" />
      <Text variant="div" className="flex-grow-1">
        <Text variant="div">{product.name}</Text>
        <Text variant="small">${(product.price * quantity).toLocaleString('es-CL')}</Text>
      </Text>
      <Button size="sm" variant="outline-secondary" onClick={onDecrease}>-</Button>
      <Text variant="span">{quantity}</Text>
      <Button
        size="sm"
        variant="outline-secondary"
        disabled={quantity >= product.stock}
        onClick={onIncrease}
      >
        +
      </Button>
      <Button size="sm" variant="outline-danger" onClick={onRemove}>✕</Button>
    </ListGroup.Item>
  );
}

export default CartItem;