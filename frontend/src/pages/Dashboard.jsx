import React, { useState, useEffect } from 'react';
import { getDashboardStats, getPaymentStats } from '../services/api';
import styled from 'styled-components';
import { FaUsers, FaUtensils, FaClipboardList, FaCreditCard, FaChartLine } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const DashboardContainer = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const StatIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => props.color || '#3498db'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  
  svg {
    color: white;
    font-size: 20px;
  }
`;

const StatTitle = styled.h3`
  font-size: 16px;
  color: #666;
  margin: 0;
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 600;
  color: #333;
`;

const ChartsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 400px;
`;

const ChartTitle = styled.h3`
  font-size: 18px;
  color: #333;
  margin-top: 0;
  margin-bottom: 20px;
`;

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [paymentStats, setPaymentStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardResponse, paymentResponse] = await Promise.all([
        getDashboardStats(),
        getPaymentStats()
      ]);
      
      setStats(dashboardResponse.data);
      setPaymentStats(paymentResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <DashboardContainer>Carregando dados do dashboard...</DashboardContainer>;
  }

  if (!stats || !paymentStats) {
    return <DashboardContainer>Erro ao carregar dados do dashboard</DashboardContainer>;
  }

  const orderStatusData = [
    { name: 'Pendentes', value: stats.ordersByStatus.PENDING || 0 },
    { name: 'Aceitos', value: stats.ordersByStatus.ACCEPTED || 0 },
    { name: 'Preparando', value: stats.ordersByStatus.PREPARING || 0 },
    { name: 'Prontos', value: stats.ordersByStatus.READY_FOR_PICKUP || 0 },
    { name: 'Em Entrega', value: stats.ordersByStatus.OUT_FOR_DELIVERY || 0 },
    { name: 'Entregues', value: stats.ordersByStatus.DELIVERED || 0 },
    { name: 'Cancelados', value: stats.ordersByStatus.CANCELLED || 0 },
  ];

  const paymentStatusData = [
    { name: 'Pendentes', value: paymentStats.pendingPayments },
    { name: 'Concluídos', value: paymentStats.completedPayments },
    { name: 'Falhos', value: paymentStats.failedPayments },
  ];

  return (
    <DashboardContainer>
      <Title>Dashboard</Title>
      
      <StatsGrid>
        <StatCard>
          <StatHeader>
            <StatIcon color="#3498db">
              <FaUsers />
            </StatIcon>
            <StatTitle>Total de Usuários</StatTitle>
          </StatHeader>
          <StatValue>{stats.totalUsers}</StatValue>
        </StatCard>
        
        <StatCard>
          <StatHeader>
            <StatIcon color="#2ecc71">
              <FaUtensils />
            </StatIcon>
            <StatTitle>Restaurantes</StatTitle>
          </StatHeader>
          <StatValue>{stats.totalRestaurants}</StatValue>
        </StatCard>
        
        <StatCard>
          <StatHeader>
            <StatIcon color="#e74c3c">
              <FaClipboardList />
            </StatIcon>
            <StatTitle>Pedidos</StatTitle>
          </StatHeader>
          <StatValue>{stats.totalOrders}</StatValue>
        </StatCard>
        
        <StatCard>
          <StatHeader>
            <StatIcon color="#f39c12">
              <FaCreditCard />
            </StatIcon>
            <StatTitle>Receita Total</StatTitle>
          </StatHeader>
          <StatValue>{formatCurrency(paymentStats.totalRevenue)}</StatValue>
        </StatCard>
      </StatsGrid>
      
      <ChartsContainer>
        <ChartCard>
          <ChartTitle>Status dos Pedidos</ChartTitle>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart
              data={orderStatusData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} pedidos`, 'Quantidade']} />
              <Legend />
              <Bar dataKey="value" name="Quantidade" fill="#3498db" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        
        <ChartCard>
          <ChartTitle>Status dos Pagamentos</ChartTitle>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={paymentStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {paymentStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} pagamentos`, 'Quantidade']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </ChartsContainer>
    </DashboardContainer>
  );
};

export default Dashboard;
