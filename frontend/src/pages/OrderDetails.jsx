import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById, updateOrderStatus } from '../services/api';
import styled from 'styled-components';
import { FaArrowLeft, FaCheck, FaTimes, FaUtensils, FaTruck, FaBoxOpen } from 'react-icons/fa';
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

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await getOrderById(id);
      setOrder(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Erro ao carregar detalhes do pedido');
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status) => {
    try {
      await updateOrderStatus(id, status);
      toast.success(`Status do pedido atualizado para ${getStatusLabel(status)}`);
      fetchOrderDetails();
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

  if (loading) {
    return <Container>Carregando detalhes do pedido...</Container>;
  }

  if (!order) {
    return <Container>Pedido não encontrado</Container>;
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/orders')}>
          <FaArrowLeft /> Voltar para Pedidos
        </BackButton>
        <Title>Detalhes do Pedido</Title>
      </Header>
      
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
          <CardTitle>Restaurante</CardTitle>
          <InfoRow>
            <InfoLabel>Nome:</InfoLabel>
            <InfoValue>{order.restaurant.name}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Endereço:</InfoLabel>
            <InfoValue>{order.restaurant.address}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Telefone:</InfoLabel>
            <InfoValue>{order.restaurant.phone}</InfoValue>
          </InfoRow>
        </InfoCard>
        
        <InfoCard>
          <CardTitle>Cliente</CardTitle>
          <InfoRow>
            <InfoLabel>Nome:</InfoLabel>
            <InfoValue>{order.customer.user.name}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Endereço:</InfoLabel>
            <InfoValue>{order.customer.address || 'Não informado'}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Telefone:</InfoLabel>
            <InfoValue>{order.customer.phone || 'Não informado'}</InfoValue>
          </InfoRow>
        </InfoCard>
        
        {order.payment && (
          <InfoCard>
            <CardTitle>Pagamento</CardTitle>
            <InfoRow>
              <InfoLabel>Status:</InfoLabel>
              <InfoValue>
                <StatusBadge status={order.payment.status}>
                  {order.payment.status === 'COMPLETED' ? 'Pago' : 
                   order.payment.status === 'PENDING' ? 'Pendente' : 
                   order.payment.status === 'FAILED' ? 'Falhou' : 
                   order.payment.status === 'REFUNDED' ? 'Reembolsado' : 
                   order.payment.status}
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
              <FaTimes /> Cancelar Pedido
            </ActionButton>
          </>
        )}
        
        {order.status === 'ACCEPTED' && (
          <ActionButton 
            color="#9C27B0" 
            onClick={() => handleUpdateStatus('PREPARING')}
          >
            <FaUtensils /> Marcar como Preparando
          </ActionButton>
        )}
        
        {order.status === 'PREPARING' && (
          <ActionButton 
            color="#00BCD4" 
            onClick={() => handleUpdateStatus('READY_FOR_PICKUP')}
          >
            <FaBoxOpen /> Marcar como Pronto para Retirada
          </ActionButton>
        )}
        
        {order.status === 'READY_FOR_PICKUP' && (
          <ActionButton 
            color="#FF9800" 
            onClick={() => handleUpdateStatus('OUT_FOR_DELIVERY')}
          >
            <FaTruck /> Marcar como Em Entrega
          </ActionButton>
        )}
        
        {order.status === 'OUT_FOR_DELIVERY' && (
          <ActionButton 
            color="#4CAF50" 
            onClick={() => handleUpdateStatus('DELIVERED')}
          >
            <FaCheck /> Marcar como Entregue
          </ActionButton>
        )}
      </ActionButtons>
    </Container>
  );
};

export default OrderDetails;
