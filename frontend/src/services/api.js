import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// Add a request interceptor to include the token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth services
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);

// User services
export const getUsers = () => api.get('/users');
export const getUserById = (id) => api.get(`/users/${id}`);
export const createUser = (userData) => api.post('/users', userData);
export const updateUser = (id, userData) => api.put(`/users/${id}`, userData);
export const deleteUser = (id) => api.delete(`/users/${id}`);

// Restaurant services
export const getRestaurants = () => api.get('/restaurant');
export const getRestaurantById = (id) => api.get(`/restaurant/${id}`);
export const approveRestaurant = (id) => api.put(`/restaurant/${id}/approve`);
export const rejectRestaurant = (id) => api.put(`/restaurant/${id}/reject`);
export const createRestaurant = (data) => api.post('/restaurant', data);
export const updateRestaurant = (id, data) => api.put(`/restaurant/${id}`, data);
export const deleteRestaurant = (id) => api.delete(`/restaurant/${id}`);

// Dish services
export const getDishesByRestaurant = (restaurantId) => api.get(`/dishes/restaurant/${restaurantId}`);
export const createDish = (data) => api.post('/dishes', data);
export const updateDish = (id, data) => api.put(`/dishes/${id}`, data);
export const deleteDish = (id) => api.delete(`/dishes/${id}`);

// Order services
export const getOrders = () => api.get('/orders');
export const getOrderById = (id) => api.get(`/orders/${id}`);
export const getOrdersByRestaurant = (restaurantId) => api.get(`/orders/restaurant/${restaurantId}`);
export const getOrdersByCustomer = (customerId) => api.get(`/orders/customer/${customerId}`);
export const createOrder = (data) => api.post('/orders', data);
export const updateOrderStatus = (id, status) => api.put(`/orders/${id}/status`, { status });

// Payment services
export const getPayments = () => api.get('/payments');
export const getPaymentById = (id) => api.get(`/payments/${id}`);
export const getPaymentByOrderId = (orderId) => api.get(`/payments/order/${orderId}`);
export const createPayment = (data) => api.post('/payments', data);
export const updatePaymentStatus = (id, status) => api.put(`/payments/${id}/status`, { status });
export const getPaymentStats = () => api.get('/payments/stats/overview');

// Dashboard services
export const getDashboardStats = () => api.get('/admin/dashboard');

export default api;
