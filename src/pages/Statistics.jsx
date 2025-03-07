import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import api from '../services/api';

const StatisticsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const PageTitle = styled.h1`
  margin: 0 0 20px;
  color: #333;
  font-size: 24px;
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const ChartContainer = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin-bottom: 20px;
`;

const ChartTitle = styled.h2`
  margin: 0 0 20px;
  color: #333;
  font-size: 18px;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Statistics = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [orderStats, setOrderStats] = useState([]);
  const [revenueStats, setRevenueStats] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchStatistics();
  }, [timeRange]);
  
  const fetchStatistics = async () => {
    try {
      setLoading(true);
      
      // In a real app, you would pass the timeRange to the API
      const response = await api.get(`/admin/statistics?timeRange=${timeRange}`);
      
      // For now, we'll use mock data
      generateMockData();
      
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Generate mock data for demonstration
  const generateMockData = () => {
    // Mock data for orders by day
    const orderData = [];
    const revenueData = [];
    
    let days = 7;
    if (timeRange === 'month') days = 30;
    if (timeRange === 'year') days = 12;
    
    const isYear = timeRange === 'year';
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i - 1));
      
      const day = isYear 
        ? date.toLocaleString('default', { month: 'short' }) 
        : date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      
      const orders = Math.floor(Math.random() * 50) + 10;
      const revenue = orders * (Math.floor(Math.random() * 30) + 20);
      
      orderData.push({
        name: day,
        orders: orders
      });
      
      revenueData.push({
        name: day,
        revenue: revenue
      });
    }
    
    // Mock data for categories
    const categories = [
      { name: 'Hambúrgueres', value: Math.floor(Math.random() * 100) + 50 },
      { name: 'Pizza', value: Math.floor(Math.random() * 100) + 40 },
      { name: 'Brasileira', value: Math.floor(Math.random() * 100) + 30 },
      { name: 'Japonesa', value: Math.floor(Math.random() * 100) + 25 },
      { name: 'Italiana', value: Math.floor(Math.random() * 100) + 20 },
      { name: 'Outras', value: Math.floor(Math.random() * 100) + 15 }
    ];
    
    setOrderStats(orderData);
    setRevenueStats(revenueData);
    setCategoryStats(categories);
  };
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  if (loading && orderStats.length === 0) {
    return <div>Carregando estatísticas...</div>;
  }
  
  return (
    <StatisticsContainer>
      <PageTitle>Estatísticas</PageTitle>
      
      <FiltersContainer>
        <Select 
          value={timeRange} 
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="week">Última Semana</option>
          <option value="month">Último Mês</option>
          <option value="year">Último Ano</option>
        </Select>
      </FiltersContainer>
      
      <ChartsGrid>
        <ChartContainer>
          <ChartTitle>Pedidos por {timeRange === 'year' ? 'Mês' : 'Dia'}</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={orderStats}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="orders" name="Pedidos" fill="#4a90e2" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        <ChartContainer>
          <ChartTitle>Receita por {timeRange === 'year' ? 'Mês' : 'Dia'}</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={revenueStats}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis 
                tickFormatter={(value) => `R$${value}`}
              />
              <Tooltip formatter={(value) => [formatCurrency(value), 'Receita']} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                name="Receita" 
                stroke="#4caf50" 
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        <ChartContainer>
          <ChartTitle>Pedidos por Categoria</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {categoryStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} pedidos`, 'Quantidade']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        <ChartContainer>
          <ChartTitle>Crescimento de Restaurantes</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={[
                { name: 'Jan', restaurants: 10 },
                { name: 'Fev', restaurants: 15 },
                { name: 'Mar', restaurants: 22 },
                { name: 'Abr', restaurants: 28 },
                { name: 'Mai', restaurants: 35 },
                { name: 'Jun', restaurants: 42 },
                { name: 'Jul', restaurants: 48 },
                { name: 'Ago', restaurants: 55 },
                { name: 'Set', restaurants: 62 },
                { name: 'Out', restaurants: 70 },
                { name: 'Nov', restaurants: 78 },
                { name: 'Dez', restaurants: 85 }
              ]}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="restaurants" 
                name="Restaurantes" 
                stroke="#ff9800" 
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </ChartsGrid>
    </StatisticsContainer>
  );
};

export default Statistics;
