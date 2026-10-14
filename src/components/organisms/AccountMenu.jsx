import { useState } from 'react';
import { NavDropdown, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../atoms/Button';

function AccountMenu() {
  const navigate = useNavigate();
  const { session, isLoggedIn, isAdmin, logout } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    setShowConfirm(false);
    navigate('/');
  };

  // DESPUÉS
const label = isLoggedIn ? '👤 Mi cuenta' : '👤 Cuenta';
  return (
    <>
      <NavDropdown title={label} id="account-dropdown" align="end" menuVariant="dark">
        {isLoggedIn ? (
          <>
            <NavDropdown.ItemText className="small text-secondary">
              Sesión iniciada como
              <br />
              <strong className="text-light">{session.user}</strong>
            </NavDropdown.ItemText>
            <NavDropdown.Divider />
            {isAdmin && (
              <NavDropdown.Item as={Link} to="/admin">
                ⚙️ Panel de administración
              </NavDropdown.Item>
            )}
            <NavDropdown.Item onClick={() => setShowConfirm(true)}>
              🚪 Cerrar sesión
            </NavDropdown.Item>
          </>
        ) : (
          <>
            <NavDropdown.Item as={Link} to="/login">
              Iniciar sesión
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/register">
              Registrarse
            </NavDropdown.Item>
          </>
        )}
      </NavDropdown>

      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered size="sm">
        <Modal.Header closeButton>
          <Modal.Title className="h5">Cerrar sesión</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Seguro que quieres cerrar tu sesión?</Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowConfirm(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AccountMenu;