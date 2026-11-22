import { Alert as BootstrapAlert } from 'react-bootstrap';

function Alert({ children, ...props }) {
  return <BootstrapAlert {...props}>{children}</BootstrapAlert>;
}

export default Alert;