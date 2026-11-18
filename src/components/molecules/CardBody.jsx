import Text from '../atoms/Text';
import PriceTag from './PriceTag';

function CardBody({ title, description, price }) {
  return (
    <>
      <Text variant="h5">{title}</Text>
      {description && <Text variant="p">{description}</Text>}
      <PriceTag price={price} className="d-block mb-2" />
    </>
  );
}

export default CardBody;