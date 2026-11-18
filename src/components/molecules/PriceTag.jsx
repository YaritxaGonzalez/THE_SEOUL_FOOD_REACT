import Text from '../atoms/Text';

function PriceTag({ price, variant = 'span', className }) {
  return (
    <Text variant={variant} className={className}>
      <Text variant="span" className="text-success fw-semibold">Precio:</Text>{' '}
      <Text variant="span" className="text-muted">${price.toLocaleString('es-CL')}</Text>
    </Text>
  );
}

export default PriceTag;