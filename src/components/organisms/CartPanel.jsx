import { useState } from 'react';
import { Offcanvas, ListGroup, Alert, Form } from 'react-bootstrap';
import { useCart } from '../../context/CartContext';
import Image from '../atoms/Image';
import Text from '../atoms/Text';
import Button from '../atoms/Button';

const EMPTY_FORM = { nombre: '', tarjeta: '', vencimiento: '', cvv: '' };

// Algoritmo de Luhn: descarta números de tarjeta inventados al azar
function luhnValido(numero) {
  let suma = 0;
  let duplicar = false;
  for (let i = numero.length - 1; i >= 0; i--) {
    let digito = Number(numero[i]);
    if (duplicar) {
      digito *= 2;
      if (digito > 9) digito -= 9;
    }
    suma += digito;
    duplicar = !duplicar;
  }
  return suma % 10 === 0;
}

function CartPanel({ show, onHide }) {
  const { items, totalPrice, addToCart, decreaseItem, removeItem, clearCart } = useCart();

  const [step, setStep] = useState('cart'); // 'cart' = carrito, 'payment' = datos de pago
  const [paid, setPaid] = useState(false);  // true = mostrar mensaje de éxito
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Solo números en tarjeta y CVV
    let clean = value;
    if (name === 'tarjeta' || name === 'cvv') clean = value.replace(/\D/g, '');
    if (name === 'vencimiento') clean = value.replace(/[^\d/]/g, '');
    setForm({ ...form, [name]: clean });
  };

  // Valida los datos antes de aceptar el pago
  const validate = () => {
    const err = {};
    if (form.nombre.trim().length < 3) err.nombre = 'Ingresa el nombre del titular';
    if (form.tarjeta.length !== 16) {
      err.tarjeta = 'La tarjeta debe tener 16 dígitos';
    } else if (/^(\d)\1+$/.test(form.tarjeta) || !luhnValido(form.tarjeta)) {
      // también rechaza números repetidos como 0000000000000000
      err.tarjeta = 'Número de tarjeta inválido';
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.vencimiento)) {
      err.vencimiento = 'Formato MM/AA (ej: 08/28)';
    } else {
      // Rechaza tarjetas vencidas
      const [mes, anio] = form.vencimiento.split('/').map(Number);
      const hoy = new Date();
      const vencida = 2000 + anio < hoy.getFullYear() ||
        (2000 + anio === hoy.getFullYear() && mes < hoy.getMonth() + 1);
      if (vencida) err.vencimiento = 'La tarjeta está vencida';
    }
    if (form.cvv.length !== 3) err.cvv = 'El CVV debe tener 3 dígitos';
    return err;
  };

  const handlePay = (e) => {
    e.preventDefault();
    if (items.length === 0) return; // no se puede pagar con el carrito vacío
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length > 0) return; // si hay errores, NO se paga

    // Datos correctos: se completa la transacción
    clearCart();
    setForm(EMPTY_FORM);
    setStep('cart');
    setPaid(true);
  };

  // Al cerrar el panel se reinicia todo
  const handleHide = () => {
    setPaid(false);
    setStep('cart');
    setForm(EMPTY_FORM);
    setErrors({});
    onHide();
  };

  return (
    <Offcanvas show={show} onHide={handleHide} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{step === 'payment' ? 'Datos de pago' : 'Mi carrito'}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {/* Mensaje de transacción exitosa (solo después de pagar con datos válidos) */}
        {paid && <Alert variant="success">✅ ¡Transacción realizada con éxito!</Alert>}

        {step === 'cart' && (
          <>
            {items.length === 0 ? (
              !paid && <Text variant="p">Tu carrito está vacío.</Text>
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

            {/* Lleva al formulario de pago (no paga todavía) */}
            <Button
              variant="success"
              className="w-100 mt-3"
              disabled={items.length === 0}
              onClick={() => { setPaid(false); setStep('payment'); }}
            >
              Ir a pagar
            </Button>
          </>
        )}

        {step === 'payment' && (
          <Form onSubmit={handlePay} noValidate>
            <p className="fw-bold">Total a pagar: ${totalPrice.toLocaleString('es-CL')}</p>

            <Form.Group className="mb-3">
              <Form.Control
                name="nombre"
                placeholder="Nombre del titular"
                value={form.nombre}
                onChange={handleChange}
                isInvalid={!!errors.nombre}
              />
              <Form.Control.Feedback type="invalid">{errors.nombre}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                name="tarjeta"
                placeholder="Número de tarjeta (16 dígitos)"
                maxLength={16}
                inputMode="numeric"
                value={form.tarjeta}
                onChange={handleChange}
                isInvalid={!!errors.tarjeta}
              />
              <Form.Control.Feedback type="invalid">{errors.tarjeta}</Form.Control.Feedback>
            </Form.Group>

            <div className="d-flex gap-2">
              <Form.Group className="mb-3 flex-grow-1">
                <Form.Control
                  name="vencimiento"
                  placeholder="MM/AA"
                  maxLength={5}
                  value={form.vencimiento}
                  onChange={handleChange}
                  isInvalid={!!errors.vencimiento}
                />
                <Form.Control.Feedback type="invalid">{errors.vencimiento}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3 flex-grow-1">
                <Form.Control
                  name="cvv"
                  type="password"
                  placeholder="CVV"
                  maxLength={3}
                  inputMode="numeric"
                  value={form.cvv}
                  onChange={handleChange}
                  isInvalid={!!errors.cvv}
                />
                <Form.Control.Feedback type="invalid">{errors.cvv}</Form.Control.Feedback>
              </Form.Group>
            </div>

            <Button type="submit" variant="success" className="w-100 mb-2">
              Pagar
            </Button>
            <Button variant="outline-secondary" className="w-100" onClick={() => setStep('cart')}>
              Volver al carrito
            </Button>
          </Form>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default CartPanel;