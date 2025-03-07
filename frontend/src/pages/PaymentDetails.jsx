import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPaymentById, updatePaymentStatus } from '../services/api';
import styled from 'styled-components';
import { FaArrowLeft, FaCheck, FaTimes, FaUndo } from 'react-icons/fa';
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

const PaymentInfo = styled.div`
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
      case 'COMPLETED': return '#4CAF50';
      case 'FAILED': return '#F44336';
      case 'REFUNDED': return '#9C27B0';
      default: return '#9E9E9E';
    }
  }};
  color: white;
`;

const OrderStatusBadge = styled.span`
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

const PaymentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentDetails();
  }, [id]);

  const fetchPaymentDetails = async () => {
    try {
      setLoading(true);
      const response = await getPaymentById(id);
      setPayment(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching payment details:', error);
      toast.error('Erro ao carregar detalhes do pagamento');
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status) => {
    try {
      await updatePaymentStatus(id, status);
      toast.success(`Status do pagamento atualizado para ${getStatusLabel(status)}`);
      fetchPaymentDetails();
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error('Erro ao atualizar status do pagamento');
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'PENDING': return 'Pendente';
      case 'COMPLETED': return 'Concluído';
      case 'FAILED': return 'Falhou';
      case 'REFUNDED': return 'Reembolsado';
      default: return status;
    }
  };

  const getOrderStatusLabel = (status) => {
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
    return <Container>Carregando detalhes do pagamento...</Container>;
  }

  if (!payment) {
    return <Container>Pagamento não encontrado</Container>;
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/payments')}>
          <FaArrowLeft /> Voltar para Pagamentos
        </BackButton>
        <Title>Detalhes do Pagamento</Title>
      </Header>
      
      <PaymentInfo>
        <InfoCard>
          <CardTitle>Informações do Pagamento</CardTitle>
          <InfoRow>
            <InfoLabel>ID:</InfoLabel>
            <InfoValue>{payment.id}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Data:</InfoLabel>
            <InfoValue>{formatDate(payment.createdAt)}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Valor:</InfoLabel>
            <InfoValue>{formatCurrency(payment.amount)}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Método:</InfoLabel>
            <InfoValue>{payment.provider}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Status:</InfoLabel>
            <InfoValue>
              <StatusBadge status={payment.status}>
                {getStatusLabel(payment.status)}
              </StatusBadge>
            </InfoValue>
          </InfoRow>
          {payment.externalId && (
            <InfoRow>
              <InfoLabel>ID Externo:</InfoLabel>
              <InfoValue>{payment.externalId}</InfoValue>
            </InfoRow>
          )}
        </InfoCard>
        
        <InfoCard>
          <CardTitle>Informações do Pedido</CardTitle>
          <InfoRow>
            <InfoLabel>ID do Pedido:</InfoLabel>
            <InfoValue>
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/orders/${payment.order.id}`);
                }}
                style={{ color: '#2196F3', textDecoration: 'underline' }}
              >
                {payment.order.id}
              </a>
            </InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Data do Pedido:</InfoLabel>
            <InfoValue>{formatDate(payment.order.createdAt)}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Status do Pedido:</InfoLabel>
            <InfoValue>
              <OrderStatusBadge status={payment.order.status}>
                {getOrderStatusLabel(payment.order.status)}
              </OrderStatusBadge>
            </InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Total do Pedido:</InfoLabel>
            <InfoValue>{formatCurrency(payment.order.total)}</InfoValue>
          </InfoRow>
        </InfoCard>
        
        <InfoCard>
          <CardTitle>Restaurante</CardTitle>
          <InfoRow>
            <InfoLabel>Nome:</InfoLabel>
            <InfoValue>{payment.order.restaurant.name}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Endereço:</InfoLabel>
            <InfoValue>{payment.order.restaurant.address}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Telefone:</InfoLabel>
            <InfoValue>{payment.order.restaurant.phone}</InfoValue>
          </InfoRow>
        </InfoCard>
        
        <InfoCard>
          <CardTitle>Cliente</CardTitle>
          <InfoRow>
            <InfoLabel>Nome:</InfoLabel>
            <InfoValue>{payment.order.customer.user.name}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Email:</InfoLabel>
            <InfoValue>{payment.order.customer.user.email}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Endereço:</InfoLabel>
            <InfoValue>{payment.order.customer.address || 'Não informado'}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Telefone:</InfoLabel>
            <InfoValue>{payment.order.customer.phone || 'Não informado'}</InfoValue>
          </InfoRow>
        </InfoCard>
      </PaymentInfo>
      
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
          {payment.order.items.map((item) => (
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
        {payment.status === 'PENDING' && (
          <>
            <ActionButton 
              color="#4CAF50" 
              onClick={() => handleUpdateStatus('COMPLETED')}
            >
              <FaCheck /> Marcar como Pago
            </ActionButton>
            <ActionButton 
              color="#F44336" 
              onClick={() => handleUpdateStatus('FAILED')}
            >
              <FaTimes /> Marcar como Falho
            </ActionButton>
          </>
        )}
        
        {payment.status === 'COMPLETED' && (
          <ActionButton 
            color="#9C27B0" 
            onClick={() => handleUpdateStatus('REFUNDED')}
          >
            <FaUndo /> Reembolsar Pagamento
          </ActionButton>
        )}
      </ActionButtons>
    </Container>
  );
};

export default PaymentDetails;
