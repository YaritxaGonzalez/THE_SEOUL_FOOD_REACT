import { Outlet } from 'react-router-dom';
import NavBar from '../organisms/Navbar';
import Footer from '../organisms/Footer';
import MatrixBackground from '../organisms/MatrixBackground';


function MainLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <MatrixBackground />
      <NavBar />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;