import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import UserForm from './pages/UserForm';
import Restaurants from './pages/Restaurants';
import RestaurantForm from './pages/RestaurantForm';
import RestaurantDetails from './pages/RestaurantDetails';
import Statistics from './pages/Statistics';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import Payments from './pages/Payments';
import PaymentDetails from './pages/PaymentDetails';
import DeliveryPersons from './pages/DeliveryPersons';
import DeliveryPersonForm from './pages/DeliveryPersonForm';
import DeliveryPersonDetails from './pages/DeliveryPersonDetails';
import DeliveryFeeConfig from './pages/DeliveryFeeConfig';

// Componente para rotas protegidas
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="users/new" element={<UserForm />} />
            <Route path="users/edit/:id" element={<UserForm />} />
            <Route path="restaurants" element={<Restaurants />} />
            <Route path="restaurants/new" element={<RestaurantForm />} />
            <Route path="restaurants/edit/:id" element={<RestaurantForm />} />
            <Route path="restaurants/:id" element={<RestaurantDetails />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:id" element={<OrderDetails />} />
            <Route path="payments" element={<Payments />} />
            <Route path="payments/:id" element={<PaymentDetails />} />
            <Route path="statistics" element={<Statistics />} />
            <Route path="delivery-persons" element={<DeliveryPersons />} />
            <Route path="delivery-persons/new" element={<DeliveryPersonForm />} />
            <Route path="delivery-persons/edit/:id" element={<DeliveryPersonForm />} />
            <Route path="delivery-persons/:id" element={<DeliveryPersonDetails />} />
            <Route path="delivery-fee-config" element={<DeliveryFeeConfig />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
