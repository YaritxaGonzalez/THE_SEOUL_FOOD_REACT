import { Form } from 'react-bootstrap';

function Input({ error, isInvalid, className, ...props }) {
  return (
    <Form.Group className={className}>
      <Form.Control isInvalid={isInvalid ?? !!error} {...props} />
      {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
    </Form.Group>
  );
}

export default Input;