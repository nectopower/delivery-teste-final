import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowLeft, FaPrint, FaUser, FaStore, FaMotorcycle, FaMapMarkerAlt, FaClock, FaMoneyBill, FaExclamationTriangle } from 'react-icons/fa';
import api from '../services/api';

const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const OrderId = styled.span`
  font-size: 16px;
  background-color: #f8fafc;
  padding: 4px 8px;
  border-radius: 4px;
  color: #64748b;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  background-color: ${props => props.primary ? '#3b82f6' : 'white'};
  color: ${props => props.primary ? 'white' : '#1e293b'};
  border: ${props => props.primary ? 'none' : '1px solid #e2e8f0'};
  border-radius: 4px;
  padding: 10px 16px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background-color: ${props => props.primary ? '#2563eb' : '#f8fafc'};
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h3`
  margin: 0 0 16px 0;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div`
  margin-bottom: 16px;
`;

const InfoLabel = styled.div`
  font-size: 14px;
  color: #64748b;
  margin-bottom: 4px;
`;

const InfoValue = styled.div`
  font-weight: 500;
  color: #1e293b;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 500;
  background-color: ${props => {
    switch (props.status) {
      case 'pending': return '#f59e0b';
      case 'preparing': return '#3b82f6';
      case 'ready': return '#8b5cf6';
      case 'delivering': return '#6366f1';
      case 'completed': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#64748b';
    }
  }};
  color: white;
`;

const ItemsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px 16px;
  background-color: #f8fafc;
  color: #1e293b;
  font-weight: 500;
  border-bottom: 1px solid #e2e8f0;
  
  &:last-child {
    text-align: right;
  }
`;

const Td = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
  color: #1e293b;
  
  &:last-child {
    text-align: right;
  }
`;

const TotalRow = styled.tr`
  font-weight: 600;
  
  td {
    padding-top: 16px;
  }
`;

const Timeline = styled.div`
  margin-top: 16px;
`;

const TimelineItem = styled.div`
  display: flex;
  margin-bottom: 16px;
  position: relative;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    left: 12px;
    top: 24px;
    bottom: -8px;
    width: 2px;
    background-color: #e2e8f0;
  }
`;

const TimelineDot = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${props => props.active ? '#3b82f6' : '#e2e8f0'};
  margin-right: 16px;
  flex-shrink: 0;
`;

const TimelineContent = styled.div`
  flex: 1;
`;

const TimelineTitle = styled.div`
  font-weight: 500;
  color: #1e293b;
`;

const TimelineTime = styled.div`
  font-size: 14px;
  color: #64748b;
  margin-top: 4px;
`;

const DeliveryInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background-color: #f0f9ff;
  border-radius: 8px;
  margin-top: 16px;
`;

const DeliveryAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #bfdbfe;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  font-size: 20px;
`;

const DeliveryDetails = styled.div`
  flex: 1;
`;

const DeliveryName = styled.div`
  font-weight: 500;
  color: #1e293b;
`;

const DeliveryContact = styled.div`
  font-size: 14px;
  color: #64748b;
  margin-top: 4px;
`;

const CancelledBanner = styled.div`
  background-color: #fee2e2;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
`;

const CancelledIcon = styled.div`
  color: #ef4444;
  font-size: 24px;
`;

const CancelledInfo = styled.div`
  flex: 1;
`;

const CancelledTitle = styled.div`
  font-weight: 500;
  color: #b91c1c;
`;

const CancelledReason = styled.div`
  font-size: 14px;
  color: #ef4444;
  margin-top: 4px;
`;

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
      // Em um cenário real, você buscaria esses dados da API
      // const response = await api.get(`/admin/orders/${id}`);
      // setOrder(response.data);
      
      // Dados simulados para demonstração
      setTimeout(() => {
        // Vamos simular um pedido baseado no ID
        const mockOrder = {
          id: id,
          customer: {
            id: 1,
            name: 'João Silva',
            email: 'joao.silva@email.com',
            phone: '(11) 98765-4321'
          },
          restaurant: {
            id: 1,
            name: 'Restaurante Bom Sabor',
            address: 'Rua das Flores, 123 - Centro, São Paulo - SP'
          },
          status: 'delivering',
          items: [
            {
              id: 1,
              name: 'Feijoada Completa',
              quantity: 1,
              price: 45.90,
              total: 45.90
            },
            {
              id: 2,
              name: 'Refrigerante 2L',
              quantity: 1,
              price: 12.00,
              total: 12.00
            },
            {
              id: 3,
              name: 'Pudim',
              quantity: 2,
              price: 8.50,
              total: 17.00
            }
          ],
          subtotal: 74.90,
          deliveryFee: 10.00,
          discount: 5.00,
          total: 79.90,
          paymentMethod: 'credit_card',
          paymentDetails: {
            cardLastDigits: '1234',
            installments: 1
          },
          address: {
            street: 'Av. Paulista',
            number: '1000',
            complement: 'Apto 123',
            neighborhood: 'Bela Vista',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01310-100'
          },
          delivery: {
            driver: {
              name: 'Carlos Oliveira',
              phone: '(11) 97777-8888'
            },
            estimatedTime: '30-45 min',
            distance: '3.5 km'
          },
          timeline: [
            {
              status: 'pending',
              time: '2023-05-15T15:30:00Z',
              description: 'Pedido recebido'
            },
            {
              status: 'confirmed',
              time: '2023-05-15T15:32:00Z',
              description: 'Pedido confirmado pelo restaurante'
            },
            {
              status: 'preparing',
              time: '2023-05-15T15:40:00Z',
              description: 'Pedido em preparação'
            },
            {
              status: 'ready',
              time: '2023-05-15T16:05:00Z',
              description: 'Pedido pronto para entrega'
            },
            {
              status: 'delivering',
              time: '2023-05-15T16:10:00Z',
              description: 'Pedido em rota de entrega'
            }
          ],
          createdAt: '2023-05-15T15:30:00Z',
          notes: 'Sem cebola na feijoada, por favor.'
        };
        
        setOrder(mockOrder);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Erro ao buscar detalhes do pedido:', error);
      setLoading(false);
      navigate('/orders');
    }
  };
  
  const handlePrintOrder = () => {
    window.print();
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  };
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'confirmed': return 'Confirmado';
      case 'preparing': return 'Preparando';
      case 'ready': return 'Pronto';
      case 'delivering': return 'Em entrega';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };
  
  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case 'credit_card': return 'Cartão de Crédito';
      case 'debit_card': return 'Cartão de Débito';
      case 'pix': return 'PIX';
      case 'cash': return 'Dinheiro';
      default: return method;
    }
  };
  
  if (loading) {
    return <p>Carregando...</p>;
  }
  
  if (!order) {
    return <p>Pedido não encontrado.</p>;
  }
  
  return (
    <DetailsContainer>
      <Header>
        <Title>
          Detalhes do Pedido
          <OrderId>{order.id}</OrderId>
        </Title>
        <ButtonsContainer>
          <Button onClick={() => navigate('/orders')}>
            <FaArrowLeft /> Voltar
          </Button>
          <Button primary onClick={handlePrintOrder}>
            <FaPrint /> Imprimir
          </Button>
        </ButtonsContainer>
      </Header>
      
      {order.status === 'cancelled' && (
        <CancelledBanner>
          <CancelledIcon>
            <FaExclamationTriangle />
          </CancelledIcon>
          <CancelledInfo>
            <CancelledTitle>Este pedido foi cancelado</CancelledTitle>
            <CancelledReason>
              Motivo: Cliente solicitou cancelamento por demora na entrega.
            </CancelledReason>
          </CancelledInfo>
        </CancelledBanner>
      )}
      
      <ContentGrid>
        <div>
          <Section>
            <SectionTitle>Itens do Pedido</SectionTitle>
            <ItemsTable>
              <thead>
                <tr>
                  <Th>Item</Th>
                  <Th>Qtd</Th>
                  <Th>Preço</Th>
                  <Th>Total</Th>
                </tr>
              </thead>
              <tbody>
                {order.items.map(item => (
                  <tr key={item.id}>
                    <Td>{item.name}</Td>
                    <Td>{item.quantity}</Td>
                    <Td>{formatCurrency(item.price)}</Td>
                    <Td>{formatCurrency(item.total)}</Td>
                  </tr>
                ))}
                <tr>
                  <Td colSpan="3" style={{ textAlign: 'right' }}>Subtotal</Td>
                  <Td>{formatCurrency(order.subtotal)}</Td>
                </tr>
                <tr>
                  <Td colSpan="3" style={{ textAlign: 'right' }}>Taxa de entrega</Td>
                  <Td>{formatCurrency(order.deliveryFee)}</Td>
                </tr>
                {order.discount > 0 && (
                  <tr>
                    <Td colSpan="3" style={{ textAlign: 'right' }}>Desconto</Td>
                    <Td>-{formatCurrency(order.discount)}</Td>
                  </tr>
                )}
                <TotalRow>
                  <Td colSpan="3" style={{ textAlign: 'right' }}>Total</Td>
                  <Td>{formatCurrency(order.total)}</Td>
                </TotalRow>
              </tbody>
            </ItemsTable>
            
            {order.notes && (
              <div style={{ marginTop: '20px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '4px' }}>
                <strong>Observações:</strong> {order.notes}
              </div>
            )}
          </Section>
          
          <Section style={{ marginTop: '20px' }}>
            <SectionTitle>
              <FaMapMarkerAlt /> Endereço de Entrega
            </SectionTitle>
            <p>
              {order.address.street}, {order.address.number}
              {order.address.complement && ` - ${order.address.complement}`}<br />
              {order.address.neighborhood}, {order.address.city} - {order.address.state}<br />
              CEP: {order.address.zipCode}
            </p>
            
            {order.status === 'delivering' && order.delivery && (
              <DeliveryInfo>
                <DeliveryAvatar>
                  <FaMotorcycle />
                </DeliveryAvatar>
                <DeliveryDetails>
                  <DeliveryName>{order.delivery.driver.name}</DeliveryName>
                  <DeliveryContact>
                    {order.delivery.driver.phone} • {order.delivery.distance} • {order.delivery.estimatedTime}
                  </DeliveryContact>
                </DeliveryDetails>
              </DeliveryInfo>
            )}
          </Section>
        </div>
        
        <div>
          <Section>
            <SectionTitle>
              <FaUser /> Informações do Cliente
            </SectionTitle>
            <InfoItem>
              <InfoLabel>Nome</InfoLabel>
              <InfoValue>{order.customer.name}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Email</InfoLabel>
              <InfoValue>{order.customer.email}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Telefone</InfoLabel>
              <InfoValue>{order.customer.phone}</InfoValue>
            </InfoItem>
          </Section>
          
          <Section style={{ marginTop: '20px' }}>
            <SectionTitle>
              <FaStore /> Restaurante
            </SectionTitle>
            <InfoItem>
              <InfoLabel>Nome</InfoLabel>
              <InfoValue>{order.restaurant.name}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Endereço</InfoLabel>
              <InfoValue>{order.restaurant.address}</InfoValue>
            </InfoItem>
          </Section>
          
          <Section style={{ marginTop: '20px' }}>
            <SectionTitle>
              <FaMoneyBill /> Pagamento
            </SectionTitle>
            <InfoItem>
              <InfoLabel>Método</InfoLabel>
              <InfoValue>{getPaymentMethodLabel(order.paymentMethod)}</InfoValue>
            </InfoItem>
            {order.paymentMethod === 'credit_card' && order.paymentDetails && (
              <>
                <InfoItem>
                  <InfoLabel>Cartão</InfoLabel>
                  <InfoValue>Final {order.paymentDetails.cardLastDigits}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Parcelas</InfoLabel>
                  <InfoValue>{order.paymentDetails.installments}x</InfoValue>
                </InfoItem>
              </>
            )}
          </Section>
          
          <Section style={{ marginTop: '20px' }}>
            <SectionTitle>
              <FaClock /> Status do Pedido
            </SectionTitle>
            <div style={{ marginBottom: '16px' }}>
              <StatusBadge status={order.status}>
                {getStatusLabel(order.status)}
              </StatusBadge>
            </div>
            
            <Timeline>
              {order.timeline.map((event, index) => (
                <TimelineItem key={index}>
                  <TimelineDot active={true} />
                  <TimelineContent>
                    <TimelineTitle>{event.description}</TimelineTitle>
                    <TimelineTime>{formatDate(event.time)}</TimelineTime>
                  </TimelineContent>
                </TimelineItem>
              ))}
              
              {order.status !== 'completed' && order.status !== 'cancelled' && (
                <TimelineItem>
                  <TimelineDot active={false} />
                  <TimelineContent>
                    <TimelineTitle>Pedido entregue</TimelineTitle>
                    <TimelineTime>Pendente</TimelineTime>
                  </TimelineContent>
                </TimelineItem>
              )}
            </Timeline>
          </Section>
        </div>
      </ContentGrid>
    </DetailsContainer>
  );
};

export default OrderDetails;
