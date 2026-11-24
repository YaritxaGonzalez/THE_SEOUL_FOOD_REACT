import { Form } from 'react-bootstrap';

function Select({ options, ...props }) {
  return (
    <Form.Select {...props}>
      {options.map(({ value, label }) => (
        <option key={value} value={value}>{label}</option>
      ))}
    </Form.Select>
  );
}

export default Select;