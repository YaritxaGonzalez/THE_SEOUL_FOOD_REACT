import { useEffect, useState } from 'react';
import { Container, Alert, Card } from 'react-bootstrap';
import Text from '../components/atoms/Text';
import Table from '../components/atoms/Table';
import { useAuth } from '../context/AuthContext';
import { getMyOrders } from '../services/orderService';

const ROL_LABEL = {
  admin: 'Administrador',
  vendedor: 'Vendedor',
  cliente: 'Cliente',
};

function Profile() {
  const { session } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getMyOrders()
      .then((list) => active && setOrders(list))
      .catch((e) => active && setError(e.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <Container className="my-5">
      <Text variant="h1" className="text-white">Mi perfil</Text>

      <Card className="mb-4">
        <Card.Body>
          <Text variant="p" className="mb-1">
            <Text variant="strong">Nombre:</Text> {session.nombre}
          </Text>
          <Text variant="p" className="mb-1">
            <Text variant="strong">Correo:</Text> {session.user}
          </Text>
          <Text variant="p" className="mb-0">
            <Text variant="strong">Rol:</Text> {ROL_LABEL[session.rol] ?? session.rol}
          </Text>
        </Card.Body>
      </Card>

      <Text variant="h2" className="text-white h3">Mis pedidos</Text>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <Text variant="p" className="text-light">Cargando pedidos…</Text>
      ) : orders.length === 0 ? (
        !error && <Text variant="p" className="text-light">Aún no has realizado pedidos.</Text>
      ) : (
        orders.map((order) => (
          <Card key={order.id} className="mb-3">
            <Card.Header className="d-flex justify-content-between flex-wrap gap-2">
              <Text variant="span">
                <Text variant="strong">Pedido #{order.id}</Text> ·{' '}
                {new Date(order.date).toLocaleString('es-CL')}
              </Text>
              <Text variant="span">
                {order.status} · <Text variant="strong">${order.total.toLocaleString('es-CL')}</Text>
              </Text>
            </Card.Header>
            <Card.Body>
              <Table responsive size="sm" className="mb-0 align-middle">
                <Table.Head>
                  <Table.Row>
                    <Table.HeaderCell>Producto</Table.HeaderCell>
                    <Table.HeaderCell>Cantidad</Table.HeaderCell>
                    <Table.HeaderCell>Precio unitario</Table.HeaderCell>
                    <Table.HeaderCell>Subtotal</Table.HeaderCell>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  {order.items.map((item) => (
                    <Table.Row key={item.id}>
                      <Table.Cell>{item.name}</Table.Cell>
                      <Table.Cell>{item.quantity}</Table.Cell>
                      <Table.Cell>${item.price.toLocaleString('es-CL')}</Table.Cell>
                      <Table.Cell>
                        ${(item.price * item.quantity).toLocaleString('es-CL')}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
}

export default Profile;