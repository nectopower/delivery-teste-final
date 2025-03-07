import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaUtensils, FaClipboardList, FaMoneyBillWave, FaCog } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';

const Container = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #333;
  margin: 0;
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

const SectionTitle = styled.h2`
  font-size: 20px;
  color: #333;
  margin-top: 30px;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
`;

const OrdersTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 30px;
`;

const TableHead = styled.thead`
  background-color: #f5f5f5;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

const TableHeader = styled.th`
  padding: 12px 15px;
  text-align: left;
  font-weight: 600;
  color: #333;
`;

const TableCell = styled.td`
  padding: 12px 15px;
  border-top: 1px solid #eee;
`;

const ActionButton = styled.button`
  background-color: ${props => props.color || '#2196F3'};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
  margin-right: 5px;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ActionButtonsContainer = styled.div`
  display: flex;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${props => {
    switch (props.status) {
      case 'PENDING': return '#FFC107';
      case 'ACCEPTED': return '#2196F3';
      case 'PREPARING': return '#9C27B0';
      case 'READY_FOR_PICKUP': return '#00BCD4';
      case 'OUT_FOR_DELIVERY': return '#FF9800';
      case 'DELIVERED': return '#4CAF50';
      case 'CANCELLED': return '#F44336';
      default: return '#9E9E9E';
    }
  }};
  color: white;
`;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const RestaurantPanel = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser && currentUser.role === 'RESTAURANT') {
      fetchRestaurantData();
    } else {
      navigate('/login');
    }
  }, [currentUser]);

  const fetchRestaurantData = async () => {
    try {
      setLoading(true);
      
      // Get restaurant data
      const restaurantResponse = await api.get(`/restaurant/user/${currentUser.id}`);
      const restaurantData = restaurantResponse.data;
      setRestaurant(restaurantData);
      
      // Get restaurant orders
      const ordersResponse = await api.get(`/orders/restaurant/${restaurantData.id}`);
      const ordersData = ordersResponse.data;
      setOrders(ordersData);
      
      // Calculate stats
      const totalOrders = ordersData.length;
      const pendingOrders = ordersData.filter(order => 
        ['PENDING', 'ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY'].includes(order.status)
      ).length;
      const completedOrders = ordersData.filter(order => order.status === 'DELIVERED').length;
      
      // Calculate total revenue from completed orders
      const totalRevenue = ordersData
        .filter(order => order.status === 'DELIVERED')
        .reduce((sum, order) => sum + order.total, 0);
      
      setStats({
        totalOrders,
        pendingOrders,
        completedOrders,
        totalRevenue
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching restaurant data:', error);
      toast.error('Erro ao carregar dados do restaurante');
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Status do pedido atualizado para ${getStatusLabel(newStatus)}`);
      fetchRestaurantData(); // Refresh data
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Erro ao atualizar status do pedido');
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'PENDING': return 'Pendente';
      case 'ACCEPTED': return 'Aceito';
      case 'PREPARING': return 'Preparando';
      case 'READY_FOR_PICKUP': return 'Pronto para Retirada';
      case 'OUT_FOR_DELIVERY': return 'Em Entrega';
      case 'DELIVERED': return 'Entregue';
      case 'CANCELLED': return 'Cancelado';
      default: return status;
    }
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'PENDING': return 'ACCEPTED';
      case 'ACCEPTED': return 'PREPARING';
      case 'PREPARING': return 'READY_FOR_PICKUP';
      case 'READY_FOR_PICKUP': return 'OUT_FOR_DELIVERY';
      case 'OUT_FOR_DELIVERY': return 'DELIVERED';
      default: return null;
    }
  };

  if (loading) {
    return <Container>Carregando dados do restaurante...</Container>;
  }

  if (!restaurant) {
    return <Container>Restaurante não encontrado</Container>;
  }

  return (
    <Container>
      <Header>
        <Title>Painel do Restaurante - {restaurant.name}</Title>
      </Header>
      
      <StatsGrid>
        <StatCard>
          <StatHeader>
            <StatIcon color="#3498db">
              <FaClipboardList />
            </StatIcon>
            <StatTitle>Total de Pedidos</StatTitle>
          </StatHeader>
          <StatValue>{stats.totalOrders}</StatValue>
        </StatCard>
        
        <StatCard>
          <StatHeader>
            <StatIcon color="#e74c3c">
              <FaClipboardList />
            </StatIcon>
            <StatTitle>Pedidos Pendentes</StatTitle>
          </StatHeader>
          <StatValue>{stats.pendingOrders}</StatValue>
        </StatCard>
        
        <StatCard>
          <StatHeader>
            <StatIcon color="#2ecc71">
              <FaClipboardList />
            </StatIcon>
            <StatTitle>Pedidos Entregues</StatTitle>
          </StatHeader>
          <StatValue>{stats.completedOrders}</StatValue>
        </StatCard>
        
        <StatCard>
          <StatHeader>
            <StatIcon color="#f39c12">
              <FaMoneyBillWave />
            </StatIcon>
            <StatTitle>Receita Total</StatTitle>
          </StatHeader>
          <StatValue>{formatCurrency(stats.totalRevenue)}</StatValue>
        </StatCard>
      </StatsGrid>
      
      <SectionTitle>Pedidos Recentes</SectionTitle>
      <OrdersTable>
        <TableHead>
          <tr>
            <TableHeader>ID</TableHeader>
            <TableHeader>Data</TableHeader>
            <TableHeader>Cliente</TableHeader>
            <TableHeader>Total</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Ações</TableHeader>
          </tr>
        </TableHead>
        <tbody>
          {orders.length > 0 ? (
            orders.slice(0, 10).map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id.substring(0, 8)}...</TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell>{order.customer.user.name}</TableCell>
                <TableCell>{formatCurrency(order.total)}</TableCell>
                <TableCell>
                  <StatusBadge status={order.status}>
                    {getStatusLabel(order.status)}
                  </StatusBadge>
                </TableCell>
                <TableCell>
                  <ActionButtonsContainer>
                    <ActionButton 
                      onClick={() => navigate(`/restaurant/orders/${order.id}`)}
                    >
                      Ver Detalhes
                    </ActionButton>
                    
                    {getNextStatus(order.status) && (
                      <ActionButton 
                        color="#4CAF50"
                        onClick={() => handleUpdateOrderStatus(order.id, getNextStatus(order.status))}
                      >
                        {order.status === 'PENDING' ? 'Aceitar' : 'Avançar Status'}
                      </ActionButton>
                    )}
                    
                    {order.status === 'PENDING' && (
                      <ActionButton 
                        color="#F44336"
                        onClick={() => handleUpdateOrderStatus(order.id, 'CANCELLED')}
                      >
                        Recusar
                      </ActionButton>
                    )}
                  </ActionButtonsContainer>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="6" style={{ textAlign: 'center' }}>
                Nenhum pedido encontrado
              </TableCell>
            </TableRow>
          )}
        </tbody>
      </OrdersTable>
      
      <SectionTitle>Gerenciamento</SectionTitle>
      <StatsGrid>
        <StatCard onClick={() => navigate('/restaurant/menu')} style={{ cursor: 'pointer' }}>
          <StatHeader>
            <StatIcon color="#3498db">
              <FaUtensils />
            </StatIcon>
            <StatTitle>Gerenciar Cardápio</StatTitle>
          </StatHeader>
          <div>Adicione, edite ou remova itens do seu cardápio</div>
        </StatCard>
        
        <StatCard onClick={() => navigate('/restaurant/orders')} style={{ cursor: 'pointer' }}>
          <StatHeader>
            <StatIcon color="#e74c3c">
              <FaClipboardList />
            </StatIcon>
            <StatTitle>Gerenciar Pedidos</StatTitle>
          </StatHeader>
          <div>Visualize e atualize o status dos pedidos</div>
        </StatCard>
        
        <StatCard onClick={() => navigate('/restaurant/profile')} style={{ cursor: 'pointer' }}>
          <StatHeader>
            <StatIcon color="#2ecc71">
              <FaCog />
            </StatIcon>
            <StatTitle>Configurações</StatTitle>
          </StatHeader>
          <div>Atualize as informações do seu restaurante</div>
        </StatCard>
      </StatsGrid>
    </Container>
  );
};

export default RestaurantPanel;
