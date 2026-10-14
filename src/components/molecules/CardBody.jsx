import Text from '../atoms/Text';

function CardBody({ title, description, price }) {
  return (
    <>
      <Text variant="h5">{title}</Text>
      {description && <Text variant="p">{description}</Text>}
      <Text variant="span" className="d-block mb-2">
        <span className="text-success fw-semibold">Precio:</span>{' '}
        <span className="text-muted">${price.toLocaleString('es-CL')}</span>
      </Text>
    </>
  );
}

export default CardBody;