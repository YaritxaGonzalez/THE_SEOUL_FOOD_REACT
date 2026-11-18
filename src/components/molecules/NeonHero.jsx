import Text from '../atoms/Text';

function NeonHero({ title, subtitle }) {
  return (
    <Text variant="section" className="neon-hero">
      <Text variant="h1" className="neon-title">{title}</Text>
      {subtitle && (
        <Text variant="p" className="neon-subtitle">{subtitle}</Text>
      )}
    </Text>
  );
}

export default NeonHero;