import { Form } from 'react-bootstrap';
import Input from '../atoms/Input';
import Text from '../atoms/Text';
import Button from '../atoms/Button';

function PaymentForm({ form, errors, totalPrice, onChange, onSubmit, onBack }) {
  return (
    <Form onSubmit={onSubmit} noValidate>
      <Text variant="p" className="fw-bold">
        Total a pagar: ${totalPrice.toLocaleString('es-CL')}
      </Text>

      <Input
        className="mb-3"
        name="nombre"
        placeholder="Nombre del titular"
        value={form.nombre}
        onChange={onChange}
        error={errors.nombre}
      />
      <Input
        className="mb-3"
        name="tarjeta"
        placeholder="Número de tarjeta (16 dígitos)"
        maxLength={16}
        inputMode="numeric"
        value={form.tarjeta}
        onChange={onChange}
        error={errors.tarjeta}
      />

      <Text variant="div" className="d-flex gap-2">
        <Input
          className="mb-3 flex-grow-1"
          name="vencimiento"
          placeholder="MM/AA"
          maxLength={5}
          value={form.vencimiento}
          onChange={onChange}
          error={errors.vencimiento}
        />
        <Input
          className="mb-3 flex-grow-1"
          name="cvv"
          type="password"
          placeholder="CVV"
          maxLength={3}
          inputMode="numeric"
          value={form.cvv}
          onChange={onChange}
          error={errors.cvv}
        />
      </Text>

      <Button type="submit" variant="success" className="w-100 mb-2">
        Pagar
      </Button>
      <Button variant="outline-secondary" className="w-100" onClick={onBack}>
        Volver al carrito
      </Button>
    </Form>
  );
}

export default PaymentForm;