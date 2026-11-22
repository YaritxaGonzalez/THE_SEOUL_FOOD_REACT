import { useEffect, useState } from 'react';
import { Container, Alert, Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import Text from '../components/atoms/Text';
import Button from '../components/atoms/Button';
import OrderDetailCard from '../components/organisms/OrderDetailCard';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductsContext';
import { getOrderById, updateOrderStatus, ORDER_STATES } from '../services/orderService';

function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { refresh } = useProducts();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    let active = true;
    getOrderById(id)
      .then((o) => {
        if (!active) return;
        setOrder(o);
        setNewStatus(o.statusCode);
      })
      .catch((e) => active && setError(e))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  const handleChangeStatus = async () => {
    if (newStatus === order.statusCode) return;
    if (
      newStatus === 'CANCELADA' &&
      !window.confirm('¿Cancelar la orden? Se devolverá el stock de sus productos.')
    ) {
      return;
    }
    setSaving(true);
    setActionError('');
    setMessage('');
    try {
      const updated = await updateOrderStatus(order.id, newStatus);
      setOrder(updated);
      setNewStatus(updated.statusCode);
      setMessage('Estado actualizado');
      // Al cancelar, el backend devuelve el stock: se refrescan los productos
      if (updated.statusCode === 'CANCELADA') refresh();
    } catch (e) {
      setActionError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const volver = (
    <Button variant="secondary" className="mt-3" onClick={() => navigate('/orders')}>
      Volver a órdenes
    </Button>
  );

  if (loading) {
    return (
      <Container className="my-5">
        <Text variant="p" className="text-light">Cargando orden…</Text>
      </Container>
    );
  }

  // Error distinto de "no existe" (sin conexión, sin permiso, etc.)
  if (error && error.status !== 404) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error.message}</Alert>
        {volver}
      </Container>
    );
  }

  if (!order) {
    return (
      <Container className="my-5">
        <Text variant="h1" className="text-white">Orden no encontrada</Text>
        {volver}
      </Container>
    );
  }

  return (
    <Container className="my-5">
      {actionError && (
        <Alert variant="danger" dismissible onClose={() => setActionError('')}>
          {actionError}
        </Alert>
      )}
      {message && (
        <Alert variant="success" dismissible onClose={() => setMessage('')}>
          {message}
        </Alert>
      )}

      <OrderDetailCard order={order} />

      {/* Solo el administrador cambia el estado (el vendedor solo consulta) */}
      {isAdmin &&
        (order.statusCode === 'CANCELADA' ? (
          <Text variant="p" className="text-light mt-3 mb-0">
            Una orden cancelada no puede cambiar de estado.
          </Text>
        ) : (
          <div className="d-flex flex-wrap gap-2 align-items-center mt-3">
            <Form.Select
              aria-label="Nuevo estado"
              style={{ maxWidth: '14rem' }}
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              {ORDER_STATES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </Form.Select>
            <Button
              variant="success"
              disabled={saving || newStatus === order.statusCode}
              onClick={handleChangeStatus}
            >
              {saving ? 'Guardando…' : 'Actualizar estado'}
            </Button>
          </div>
        ))}

      {volver}
    </Container>
  );
}

export default OrderDetail;