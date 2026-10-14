import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/templates/MainLayout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import AdminRoute from './components/adminRoute';

function App() {
  return (
    <Routes>
      {/* Pantallas de acceso (opcionales) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Tienda pública: se puede ver sin cuenta */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />

        {/* Solo el administrador */}
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
      </Route>
    </Routes>
  );
}

export default App;