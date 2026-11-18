import Image from '../atoms/Image';
import Text from '../atoms/Text';

function Footer() {
  return (
    <Text variant="footer" id="footer" className="bg-dark text-white text-center py-4">
      <Text variant="div" className="d-flex justify-content-center align-items-center mb-2">
        <Image src="/imagenes/store-front.png" alt="Logo The Seoul Food" className="logo-footer me-2" />
        <Text variant="span">The Seoul Food</Text>
      </Text>
      <Text variant="p" className="mb-1">📧 contacto@theseoulfood.cl · 📍 Envíos a todo Chile</Text>
      <Text variant="p" className="mb-0">© 2026 The Seoul Food — Todos los derechos reservados</Text>
    </Text>
  );
}

export default Footer;