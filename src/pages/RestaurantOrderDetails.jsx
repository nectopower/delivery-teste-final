import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowLeft, FaCheck, FaUtensils, FaMotorcycle, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';

const Container = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 5px;
  color: #2196F3;
  cursor: pointer;
  font-size: 16px;
  padding: 0;
  margin-right: 15px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  color: #333;
  margin: 0;
`;

const OrderInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const InfoCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const CardTitle = styled.h3`
  font-size: 18px;
  color: #333;
  margin-top: 0;
  margin-bottom: 15px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const InfoLabel = styled.span`
  color: #666;
  font-weight: 500;
`;

const InfoValue = styled.span`
  color: #333;
  font-weight: 600;
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

const ItemsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
`;

const TableHead = styled.thead`
  background-color: #f5f5f5;
`;

const TableHeader = styled.th`
  padding: 12px 15px;
  text-align: left;
  font-weight: 600;
  color: #333;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const TableCell = styled.td`
  padding: 12px 15px;
  border-top: 1px solid #eee;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const ActionButton = styled.button`
  background-color: ${props => props.color || '#2196F3'};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const StatusTimeline = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 25px;
    left: 0;
    right: 0;
    height: 4px;
    background-color: #e0e0e0;
    z-index: 1;
  }
`;

const StatusStep = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  width: 16%;
`;

const StatusIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${props => props.active ? props.color : '#e0e0e0'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  color: white;
  font-size: 20px;
  transition: all 0.3s;
`;

const StatusText = styled.div`
  font-size: 12px;
  color: ${props => props.active ? '#333' : '#999'};
  text-align: center;
  font-weight: ${props => props.active ? '600' : '400'};
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

const RestaurantOrderDetails = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser && currentUser.role === 'RESTAURANT') {
      fetchOrderDetails();
    } else {
      navigate('/login');
    }
  }, [id, currentUser]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Erro ao carregar detalhes do pedido');
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      await api.put(`/orders/${id}/status`, { status: newStatus });
      toast.success(`Status do pedido atualizado para ${getStatusLabel(newStatus)}`);
      fetchOrderDetails(); // Refresh data
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

  const isStatusActive = (status) => {
    if (!order) return false;
    
    const statusOrder = [
      'PENDING',
      'ACCEPTED',
      'PREPARING',
      'READY_FOR_PICKUP',
      'OUT_FOR_DELIVERY',
      'DELIVERED'
    ];
    
    const currentIndex = statusOrder.indexOf(order.status);
    const statusIndex = statusOrder.indexOf(status);
    
    return statusIndex <= currentIndex;
  };

  if (loading) {
    return <Container>Carregando detalhes do pedido...</Container>;
  }

  if (!order) {
    return <Container>Pedido não encontrado</Container>;
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/restaurant/orders')}>
          <FaArrowLeft /> Voltar para Pedidos
        </BackButton>
        <Title>Detalhes do Pedido #{order.id.substring(0, 8)}</Title>
      </Header>
      
      {order.status !== 'CANCELLED' && (
        <StatusTimeline>
          <StatusStep>
            <StatusIcon active={isStatusActive('PENDING')} color="#FFC107">
              <FaCheck />
            </StatusIcon>
            <StatusText active={isStatusActive('PENDING')}>Pendente</StatusText>
          </StatusStep>
          
          <StatusStep>
            <StatusIcon active={isStatusActive('ACCEPTED')} color="#2196F3">
              <FaCheck />
            </StatusIcon>
            <StatusText active={isStatusActive('ACCEPTED')}>Aceito</StatusText>
          </StatusStep>
          
          <StatusStep>
            <StatusIcon active={isStatusActive('PREPARING')} color="#9C27B0">
              <FaUtensils />
            </StatusIcon>
            <StatusText active={isStatusActive('PREPARING')}>Preparando</StatusText>
          </StatusStep>
          
          <StatusStep>
            <StatusIcon active={isStatusActive('READY_FOR_PICKUP')} color="#00BCD4">
              <FaCheck />
            </StatusIcon>
            <StatusText active={isStatusActive('READY_FOR_PICKUP')}>Pronto</StatusText>
          </StatusStep>
          
          <StatusStep>
            <StatusIcon active={isStatusActive('OUT_FOR_DELIVERY')} color="#FF9800">
              <FaMotorcycle />
            </StatusIcon>
            <StatusText active={isStatusActive('OUT_FOR_DELIVERY')}>Em Entrega</StatusText>
          </StatusStep>
          
          <StatusStep>
            <StatusIcon active={isStatusActive('DELIVERED')} color="#4CAF50">
              <FaCheckCircle />
            </StatusIcon>
            <StatusText active={isStatusActive('DELIVERED')}>Entregue</StatusText>
          </StatusStep>
        </StatusTimeline>
      )}
      
      <OrderInfo>
        <InfoCard>
          <CardTitle>Informações do Pedido</CardTitle>
          <InfoRow>
            <InfoLabel>ID:</InfoLabel>
            <InfoValue>{order.id}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Data:</InfoLabel>
            <InfoValue>{formatDate(order.createdAt)}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Status:</InfoLabel>
            <InfoValue>
              <StatusBadge status={order.status}>
                {getStatusLabel(order.status)}
              </StatusBadge>
            </InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Total:</InfoLabel>
            <InfoValue>{formatCurrency(order.total)}</InfoValue>
          </InfoRow>
        </InfoCard>
        
        <InfoCard>
          <CardTitle>Cliente</CardTitle>
          <InfoRow>
            <InfoLabel>Nome:</InfoLabel>
            <InfoValue>{order.customer.user.name}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Email:</InfoLabel>
            <InfoValue>{order.customer.user.email}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Telefone:</InfoLabel>
            <InfoValue>{order.customer.phone || 'Não informado'}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Endereço:</InfoLabel>
            <InfoValue>{order.customer.address || 'Não informado'}</InfoValue>
          </InfoRow>
        </InfoCard>
        
        {order.payment && (
          <InfoCard>
            <CardTitle>Pagamento</CardTitle>
            <InfoRow>
              <InfoLabel>Status:</InfoLabel>
              <InfoValue>
                <StatusBadge status={order.payment.status}>
                  {order.payment.status}
                </StatusBadge>
              </InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Método:</InfoLabel>
              <InfoValue>{order.payment.provider}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Valor:</InfoLabel>
              <InfoValue>{formatCurrency(order.payment.amount)}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Data:</InfoLabel>
              <InfoValue>{formatDate(order.payment.createdAt)}</InfoValue>
            </InfoRow>
          </InfoCard>
        )}
      </OrderInfo>
      
      <CardTitle>Itens do Pedido</CardTitle>
      <ItemsTable>
        <TableHead>
          <tr>
            <TableHeader>Item</TableHeader>
            <TableHeader>Preço Unitário</TableHeader>
            <TableHeader>Quantidade</TableHeader>
            <TableHeader>Subtotal</TableHeader>
          </tr>
        </TableHead>
        <tbody>
          {order.items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.dish.name}</TableCell>
              <TableCell>{formatCurrency(item.price)}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{formatCurrency(item.price * item.quantity)}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </ItemsTable>
      
      <ActionButtons>
        {order.status === 'PENDING' && (
          <>
            <ActionButton 
              color="#4CAF50" 
              onClick={() => handleUpdateStatus('ACCEPTED')}
            >
              <FaCheck /> Aceitar Pedido
            </ActionButton>
            <ActionButton 
              color="#F44336" 
              onClick={() => handleUpdateStatus('CANCELLED')}
            >
              Recusar Pedido
            </ActionButton>
          </>
        )}
        
        {getNextStatus(order.status) && order.status !== 'PENDING' && (
          <ActionButton 
            color="#4CAF50" 
            onClick={() => handleUpdateStatus(getNextStatus(order.status))}
          >
            Avançar para {getStatusLabel(getNextStatus(order.status))}
          </ActionButton>
        )}
      </ActionButtons>
    </Container>
  );
};

export default RestaurantOrderDetails;
