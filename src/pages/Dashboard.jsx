import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaUsers, FaUtensils, FaShoppingCart, FaCreditCard, FaMotorcycle, FaChartLine } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import api from '../services/api';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Title = styled.h1`
  margin: 0 0 24px 0;
  color: #1e293b;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
`;

const StatCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const StatIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.bgColor || '#e0f2fe'};
  color: ${props => props.color || '#0284c7'};
  font-size: 18px;
`;

const StatTitle = styled.div`
  font-size: 14px;
  color: #64748b;
  margin-bottom: 8px;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
`;

const StatChange = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: ${props => props.positive ? '#10b981' : '#ef4444'};
  margin-top: 4px;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  height: 400px;
`;

const ChartTitle = styled.h3`
  margin: 0 0 16px 0;
  color: #1e293b;
  font-size: 16px;
`;

const RecentOrdersCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  background-color: #f8fafc;
  
  &:hover {
    background-color: #f1f5f9;
  }
`;

const OrderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const OrderId = styled.div`
  font-weight: 500;
  color: #1e293b;
`;

const OrderDetails = styled.div`
  font-size: 14px;
  color: #64748b;
`;

const OrderStatus = styled.div`
  padding: 4px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${props => {
    switch (props.status) {
      case 'PENDING': return '#e0f2fe';
      case 'PREPARING': return '#fef3c7';
      case 'READY': return '#dcfce7';
      case 'DELIVERING': return '#dbeafe';
      case 'DELIVERED': return '#d1fae5';
      case 'CANCELLED': return '#fee2e2';
      default: return '#f1f5f9';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'PENDING': return '#0284c7';
      case 'PREPARING': return '#d97706';
      case 'READY': return '#16a34a';
      case 'DELIVERING': return '#2563eb';
      case 'DELIVERED': return '#059669';
      case 'CANCELLED': return '#dc2626';
      default: return '#64748b';
    }
  }};
`;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [ordersData, setOrdersData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Em um cenário real, você faria chamadas à API para obter os dados
      // const response = await api.get('/admin/dashboard');
      // setStats(response.data.stats);
      // setOrdersData(response.data.ordersData);
      // setRevenueData(response.data.revenueData);
      // setCategoryData(response.data.categoryData);
      // setRecentOrders(response.data.recentOrders);
      
      // Dados simulados para demonstração
      setTimeout(() => {
        const mockStats = {
          users: {
            total: 1248,
            change: 12.5
          },
          restaurants: {
            total: 86,
            change: 8.2
          },
          orders: {
            total: 3752,
            change: 15.3
          },
          revenue: {
            total: 'R$ 125.430,00',
            change: 18.7
          },
          deliveryPersons: {
            total: 142,
            change: 5.8
          },
          averageOrderValue: {
            total: 'R$ 33,40',
            change: 2.3
          }
        };
        
        const mockOrdersData = [
          { name: 'Jan', orders: 320 },
          { name: 'Fev', orders: 345 },
          { name: 'Mar', orders: 410 },
          { name: 'Abr', orders: 390 },
          { name: 'Mai', orders: 450 },
          { name: 'Jun', orders: 480 },
          { name: 'Jul', orders: 520 },
          { name: 'Ago', orders: 540 },
          { name: 'Set', orders: 580 },
          { name: 'Out', orders: 620 },
          { name: 'Nov', orders: 680 },
          { name: 'Dez', orders: 720 }
        ];
        
        const mockRevenueData = [
          { name: 'Jan', revenue: 10800 },
          { name: 'Fev', revenue: 11500 },
          { name: 'Mar', revenue: 13200 },
          { name: 'Abr', revenue: 12800 },
          { name: 'Mai', revenue: 14500 },
          { name: 'Jun', revenue: 15200 },
          { name: 'Jul', revenue: 16800 },
          { name: 'Ago', revenue: 17500 },
          { name: 'Set', revenue: 18200 },
          { name: 'Out', revenue: 19500 },
          { name: 'Nov', revenue: 21000 },
          { name: 'Dez', revenue: 23000 }
        ];
        
        const mockCategoryData = [
          { name: 'Brasileira', value: 35 },
          { name: 'Italiana', value: 25 },
          { name: 'Japonesa', value: 15 },
          { name: 'Fast Food', value: 20 },
          { name: 'Outras', value: 5 }
        ];
        
        const mockRecentOrders = [
          {
            id: '1234567890',
            customer: 'João Silva',
            restaurant: 'Restaurante Bom Sabor',
            total: 'R$ 45,90',
            status: 'DELIVERED',
            date: '15/05/2023 14:30'
          },
          {
            id: '0987654321',
            customer: 'Maria Oliveira',
            restaurant: 'Pizzaria Napoli',
            total: 'R$ 68,50',
            status: 'DELIVERING',
            date: '15/05/2023 13:45'
          },
          {
            id: '5678901234',
            customer: 'Pedro Santos',
            restaurant: 'Sushi Express',
            total: 'R$ 92,30',
            status: 'PREPARING',
            date: '15/05/2023 13:20'
          },
          {
            id: '4321098765',
            customer: 'Ana Costa',
            restaurant: 'Burger King',
            total: 'R$ 37,80',
            status: 'PENDING',
            date: '15/05/2023 12:55'
          },
          {
            id: '9012345678',
            customer: 'Carlos Ferreira',
            restaurant: 'Restaurante Mineiro',
            total: 'R$ 55,40',
            status: 'CANCELLED',
            date: '15/05/2023 11:30'
          }
        ];
        
        setStats(mockStats);
        setOrdersData(mockOrdersData);
        setRevenueData(mockRevenueData);
        setCategoryData(mockCategoryData);
        setRecentOrders(mockRecentOrders);
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      setLoading(false);
    }
  };
  
  const getStatusLabel = (status) => {
    switch (status) {
      case 'PENDING': return 'Pendente';
      case 'PREPARING': return 'Preparando';
      case 'READY': return 'Pronto';
      case 'DELIVERING': return 'Em Entrega';
      case 'DELIVERED': return 'Entregue';
      case 'CANCELLED': return 'Cancelado';
      default: return status;
    }
  };
  
  if (loading) {
    return <p>Carregando dados do dashboard...</p>;
  }
  
  return (
    <DashboardContainer>
      <Title>Dashboard</Title>
      
      <StatsGrid>
        <StatCard>
          <StatHeader>
            <StatIcon bgColor="#e0f2fe" color="#0284c7">
              <FaUsers />
            </StatIcon>
          </StatHeader>
          <StatTitle>Total de Usuários</StatTitle>
          <StatValue>{stats.users.total}</StatValue>
          <StatChange positive={stats.users.change > 0}>
            <FaChartLine /> {stats.users.change}% este mês
          </StatChange>
        </StatCard>
        
        <StatCard>
          <StatHeader>
            <StatIcon bgColor="#dcfce7" color="#16a34a">
              <FaUtensils />
            </StatIcon>
          </StatHeader>
          <StatTitle>Restaurantes</StatTitle>
          <StatValue>{stats.restaurants.total}</StatValue>
          <StatChange positive={stats.restaurants.change > 0}>
            <FaChartLine /> {stats.restaurants.change}% este mês
          </StatChange>
        </StatCard>
        
        <StatCard>
          <StatHeader>
            <StatIcon bgColor="#dbeafe" color="#2563eb">
              <FaShoppingCart />
            </StatIcon>
          </StatHeader>
          <StatTitle>Total de Pedidos</StatTitle>
          <StatValue>{stats.orders.total}</StatValue>
          <StatChange positive={stats.orders.change > 0}>
            <FaChartLine /> {stats.orders.change}% este mês
          </StatChange>
        </StatCard>
        
        <StatCard>
          <StatHeader>
            <StatIcon bgColor="#fef3c7" color="#d97706">
              <FaCreditCard />
            </StatIcon>
          </StatHeader>
          <StatTitle>Receita Total</StatTitle>
          <StatValue>{stats.revenue.total}</StatValue>
          <StatChange positive={stats.revenue.change > 0}>
            <FaChartLine /> {stats.revenue.change}% este mês
          </StatChange>
        </StatCard>
        
        <StatCard>
          <StatHeader>
            <StatIcon bgColor="#f1f5f9" color="#64748b">
              <FaMotorcycle />
            </StatIcon>
          </StatHeader>
          <StatTitle>Entregadores</StatTitle>
          <StatValue>{stats.deliveryPersons.total}</StatValue>
          <StatChange positive={stats.deliveryPersons.change > 0}>
            <FaChartLine /> {stats.deliveryPersons.change}% este mês
          </StatChange>
        </StatCard>
        
        <StatCard>
          <StatHeader>
            <StatIcon bgColor="#fee2e2" color="#dc2626">
              <FaShoppingCart />
            </StatIcon>
          </StatHeader>
          <StatTitle>Valor Médio do Pedido</StatTitle>
          <StatValue>{stats.averageOrderValue.total}</StatValue>
          <StatChange positive={stats.averageOrderValue.change > 0}>
            <FaChartLine /> {stats.averageOrderValue.change}% este mês
          </StatChange>
        </StatCard>
      </StatsGrid>
      
      <ChartsGrid>
        <ChartCard>
          <ChartTitle>Pedidos por Mês</ChartTitle>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart
              data={ordersData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        
        <ChartCard>
          <ChartTitle>Categorias de Restaurantes</ChartTitle>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </ChartsGrid>
      
      <ChartCard>
        <ChartTitle>Receita por Mês</ChartTitle>
        <ResponsiveContainer width="100%" height="90%">
          <LineChart
            data={revenueData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => [`R$ ${value.toFixed(2)}`, 'Receita']} />
            <Line type="monotone" dataKey="revenue" stroke="#10b981" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
      
      <RecentOrdersCard>
        <ChartTitle>Pedidos Recentes</ChartTitle>
        <OrdersList>
          {recentOrders.map(order => (
            <OrderItem key={order.id}>
              <OrderInfo>
                <OrderId>#{order.id.substring(0, 8)}</OrderId>
                <OrderDetails>
                  {order.customer} • {order.restaurant} • {order.total}
                </OrderDetails>
                <OrderDetails>{order.date}</OrderDetails>
              </OrderInfo>
              <OrderStatus status={order.status}>
                {getStatusLabel(order.status)}
              </OrderStatus>
            </OrderItem>
          ))}
        </OrdersList>
      </RecentOrdersCard>
    </DashboardContainer>
  );
};

export default Dashboard;
