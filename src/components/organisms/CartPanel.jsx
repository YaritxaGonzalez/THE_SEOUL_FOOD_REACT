import { useState } from 'react';
import { Offcanvas, ListGroup, Alert } from 'react-bootstrap';
import { useCart } from '../../context/CartContext';
import Text from '../atoms/Text';
import Button from '../atoms/Button';
import CartItem from '../molecules/CartItem';
import PaymentForm from './PaymentForm';
import { useAuth } from '../../context/AuthContext';
import { createOrder } from '../../services/orderService';
import { useLocation, useNavigate } from 'react-router-dom';
import { useProducts } from '../../context/ProductsContext';

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
  const { session, isLoggedIn } = useAuth();
  const { refresh } = useProducts();
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState('cart'); // 'cart' = carrito, 'payment' = datos de pago
  const [paid, setPaid] = useState(false);  // true = mostrar mensaje de éxito
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState('');

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

  const handlePay = async (e) => {
    e.preventDefault();
    if (paying || !isLoggedIn || items.length === 0) return;
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length > 0) return; // si hay errores, NO se paga

    setPaying(true);
    setPayError('');
    try {
      await createOrder(items);
    } catch (error) {
      setPayError(
        error.status === 401
          ? 'Tu sesión expiró. Inicia sesión nuevamente para pagar.'
          : error.message
      );
      // Stock insuficiente: se refrescan los productos para que el carrito se ajuste
      if (error.status === 409) refresh();
      setPaying(false);
      return;
    }

    // Orden creada: el backend ya descontó el stock
    setPaying(false);
    clearCart();
    setForm(EMPTY_FORM);
    setStep('cart');
    setPaid(true);
    refresh();
  };

  // Al cerrar el panel se reinicia todo
  const handleHide = () => {
    setPaid(false);
    setStep('cart');
    setForm(EMPTY_FORM);
    setErrors({});
    setPayError('');
    onHide();
  };

  const handleGoToPay = () => {
    if (!isLoggedIn) {
      handleHide();
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    setPaid(false);
    setStep('payment');
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
                  <CartItem
                    key={product.id}
                    product={product}
                    quantity={quantity}
                    onDecrease={() => decreaseItem(product.id)}
                    onIncrease={() => addToCart(product.id)}
                    onRemove={() => removeItem(product.id)}
                  />
                ))}
              </ListGroup>
            )}
            <hr />
            <Text variant="div" className="d-flex justify-content-between fw-bold">
              <Text variant="span">Total:</Text>
              <Text variant="span">${totalPrice.toLocaleString('es-CL')}</Text>
            </Text>

            {/* Lleva al formulario de pago (no paga todavía) */}
            <Button
              variant="success"
              className="w-100 mt-3"
              disabled={items.length === 0}
              onClick={handleGoToPay}
            >
              Ir a pagar
            </Button>
            {!isLoggedIn && items.length > 0 && (
              <Text variant="p" className="small text-muted mt-2 mb-0">
                Para continuar con el pago, primero debes iniciar sesión.
              </Text>
            )}
          </>
        )}

        {step === 'payment' && (
          <>
            {payError && <Alert variant="danger">{payError}</Alert>}
            <PaymentForm
              form={form}
              errors={errors}
              totalPrice={totalPrice}
              paying={paying}
              onChange={handleChange}
              onSubmit={handlePay}
              onBack={() => { setPayError(''); setStep('cart'); }}
            />
          </>
    )}
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default CartPanel;