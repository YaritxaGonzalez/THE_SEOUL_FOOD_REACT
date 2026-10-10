import { Offcanvas, ListGroup } from 'react-bootstrap';
import { useCart } from '../../context/CartContext';
import Image from '../atoms/Image';
import Text from '../atoms/Text';
import Button from '../atoms/Button';

function CartPanel({ show, onHide }) {
  const { items, totalPrice, addToCart, decreaseItem, removeItem } = useCart();

  return (
    <Offcanvas show={show} onHide={onHide} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Mi carrito</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {items.length === 0 ? (
          <Text variant="p">Tu carrito está vacío.</Text>
        ) : (
          <ListGroup variant="flush">
            {items.map(({ product, quantity }) => (
              <ListGroup.Item key={product.id} className="d-flex align-items-center gap-2">
                <Image src={product.image} alt={product.name} className="cart-img" />
                <div className="flex-grow-1">
                  <div>{product.name}</div>
                  <small>${(product.price * quantity).toLocaleString('es-CL')}</small>
                </div>
                <Button size="sm" variant="outline-secondary" onClick={() => decreaseItem(product.id)}>-</Button>
                <span>{quantity}</span>
                <Button
                  size="sm"
                  variant="outline-secondary"
                  disabled={quantity >= product.stock}
                  onClick={() => addToCart(product.id)}
                >
                  +
                </Button>
                <Button size="sm" variant="outline-danger" onClick={() => removeItem(product.id)}>✕</Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
        <hr />
        <div className="d-flex justify-content-between fw-bold">
          <span>Total:</span>
          <span>${totalPrice.toLocaleString('es-CL')}</span>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default CartPanel;