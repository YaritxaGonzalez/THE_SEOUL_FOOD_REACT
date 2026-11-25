import { Outlet } from 'react-router-dom';
import NavBar from '../organisms/Navbar';
import Footer from '../organisms/Footer';
import Text from '../atoms/Text';

function MainLayout() {
  return (
    <Text variant="div" className="d-flex flex-column min-vh-100">
      <NavBar />
      <Text variant="main" className="flex-grow-1">
        <Outlet />
      </Text>
      <Footer />
    </Text>
  );
}

export default MainLayout;