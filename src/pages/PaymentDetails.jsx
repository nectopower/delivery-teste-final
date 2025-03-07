import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowLeft, FaPrint, FaUser, FaStore, FaMoneyBill, FaCreditCard, FaReceipt, FaExclamationTriangle, FaCheck, FaTimes, FaHistory, FaExchangeAlt } from 'react-icons/fa';
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

const PaymentId = styled.span`
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
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
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
      case 'COMPLETED': return '#10b981';
      case 'PENDING': return '#f59e0b';
      case 'FAILED': return '#ef4444';
      case 'REFUNDED': return '#6366f1';
      default: return '#64748b';
    }
  }};
  color: white;
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

const FailedBanner = styled.div`
  background-color: #fee2e2;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
`;

const FailedIcon = styled.div`
  color: #ef4444;
  font-size: 24px;
`;

const FailedInfo = styled.div`
  flex: 1;
`;

const FailedTitle = styled.div`
  font-weight: 500;
  color: #b91c1c;
`;

const FailedReason = styled.div`
  font-size: 14px;
  color: #ef4444;
  margin-top: 4px;
`;

const SuccessBanner = styled.div`
  background-color: #dcfce7;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
`;

const SuccessIcon = styled.div`
  color: #16a34a;
  font-size: 24px;
`;

const SuccessInfo = styled.div`
  flex: 1;
`;

const SuccessTitle = styled.div`
  font-weight: 500;
  color: #166534;
`;

const SuccessMessage = styled.div`
  font-size: 14px;
  color: #16a34a;
  margin-top: 4px;
`;

const PendingBanner = styled.div`
  background-color: #fef3c7;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
`;

const PendingIcon = styled.div`
  color: #d97706;
  font-size: 24px;
`;

const PendingInfo = styled.div`
  flex: 1;
`;

const PendingTitle = styled.div`
  font-weight: 500;
  color: #92400e;
`;

const PendingMessage = styled.div`
  font-size: 14px;
  color: #d97706;
  margin-top: 4px;
`;

const RefundedBanner = styled.div`
  background-color: #e0e7ff;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
`;

const RefundedIcon = styled.div`
  color: #4f46e5;
  font-size: 24px;
`;

const RefundedInfo = styled.div`
  flex: 1;
`;

const RefundedTitle = styled.div`
  font-weight: 500;
  color: #3730a3;
`;

const RefundedMessage = styled.div`
  font-size: 14px;
  color: #4f46e5;
  margin-top: 4px;
`;

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
      // Em um cenário real, você buscaria esses dados da API
      // const response = await api.get(`/payments/${id}`);
      // setPayment(response.data);
      
      // Dados simulados para demonstração
      setTimeout(() => {
        // Vamos simular um pagamento baseado no ID
        const mockPayment = {
          id: id,
          orderId: 'ORD-001234',
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
          amount: 89.90,
          method: 'CREDIT_CARD',
          status: 'COMPLETED',
          paymentDetails: {
            cardBrand: 'Visa',
            cardLastDigits: '1234',
            installments: 1,
            authorizationCode: 'AUTH123456',
            transactionId: 'TRX987654321'
          },
          timeline: [
            {
              status: 'CREATED',
              time: '2023-05-15T14:30:00Z',
              description: 'Pagamento criado'
            },
            {
              status: 'PROCESSING',
              time: '2023-05-15T14:31:00Z',
              description: 'Processando pagamento'
            },
            {
              status: 'COMPLETED',
              time: '2023-05-15T14:32:00Z',
              description: 'Pagamento aprovado'
            }
          ],
          createdAt: '2023-05-15T14:30:00Z',
          updatedAt: '2023-05-15T14:32:00Z'
        };
        
        setPayment(mockPayment);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Erro ao buscar detalhes do pagamento:', error);
      setLoading(false);
      navigate('/payments');
    }
  };
  
  const handlePrintReceipt = () => {
    window.print();
  };
  
  const handleUpdateStatus = async (newStatus) => {
    try {
      // Em um cenário real, você enviaria essa atualização para a API
      // await api.put(`/payments/${id}/status`, { status: newStatus });
      
      // Simulação de atualização
      alert(`Status do pagamento atualizado para: ${newStatus}`);
      
      // Atualizar o estado local
      setPayment(prev => ({
        ...prev,
        status: newStatus,
        timeline: [
          ...prev.timeline,
          {
            status: newStatus,
            time: new Date().toISOString(),
            description: getStatusUpdateDescription(newStatus)
          }
        ]
      }));
    } catch (error) {
      console.error('Erro ao atualizar status do pagamento:', error);
      alert('Erro ao atualizar status do pagamento');
    }
  };
  
  const getStatusUpdateDescription = (status) => {
    switch (status) {
      case 'COMPLETED': return 'Pagamento aprovado manualmente';
      case 'FAILED': return 'Pagamento marcado como falho';
      case 'REFUNDED': return 'Reembolso processado';
      default: return `Status alterado para ${status}`;
    }
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
      case 'CREATED': return 'Criado';
      case 'PROCESSING': return 'Processando';
      case 'COMPLETED': return 'Concluído';
      case 'PENDING': return 'Pendente';
      case 'FAILED': return 'Falhou';
      case 'REFUNDED': return 'Reembolsado';
      default: return status;
    }
  };
  
  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case 'CREDIT_CARD': return 'Cartão de Crédito';
      case 'DEBIT_CARD': return 'Cartão de Débito';
      case 'PIX': return 'PIX';
      case 'CASH': return 'Dinheiro';
      default: return method;
    }
  };
  
  const renderStatusBanner = () => {
    switch (payment.status) {
      case 'COMPLETED':
        return (
          <SuccessBanner>
            <SuccessIcon>
              <FaCheck />
            </SuccessIcon>
            <SuccessInfo>
              <SuccessTitle>Pagamento aprovado</SuccessTitle>
              <SuccessMessage>
                O pagamento foi processado com sucesso e aprovado.
              </SuccessMessage>
            </SuccessInfo>
          </SuccessBanner>
        );
      case 'PENDING':
        return (
          <PendingBanner>
            <PendingIcon>
              <FaHistory />
            </PendingIcon>
            <PendingInfo>
              <PendingTitle>Pagamento pendente</PendingTitle>
              <PendingMessage>
                O pagamento está sendo processado e aguarda confirmação.
              </PendingMessage>
            </PendingInfo>
          </PendingBanner>
        );
      case 'FAILED':
        return (
          <FailedBanner>
            <FailedIcon>
              <FaTimes />
            </FailedIcon>
            <FailedInfo>
              <FailedTitle>Pagamento falhou</FailedTitle>
              <FailedReason>
                O pagamento não pôde ser processado. Motivo: Fundos insuficientes.
              </FailedReason>
            </FailedInfo>
          </FailedBanner>
        );
      case 'REFUNDED':
        return (
          <RefundedBanner>
            <RefundedIcon>
              <FaExchangeAlt />
            </RefundedIcon>
            <RefundedInfo>
              <RefundedTitle>Pagamento reembolsado</RefundedTitle>
              <RefundedMessage>
                O valor foi reembolsado para o cliente.
              </RefundedMessage>
            </RefundedInfo>
          </RefundedBanner>
        );
      default:
        return null;
    }
  };
  
  if (loading) {
    return <p>Carregando...</p>;
  }
  
  if (!payment) {
    return <p>Pagamento não encontrado.</p>;
  }
  
  return (
    <DetailsContainer>
      <Header>
        <Title>
          Detalhes do Pagamento
          <PaymentId>{payment.id}</PaymentId>
        </Title>
        <ButtonsContainer>
          <Button onClick={() => navigate('/payments')}>
            <FaArrowLeft /> Voltar
          </Button>
          <Button primary onClick={handlePrintReceipt}>
            <FaPrint /> Imprimir Recibo
          </Button>
        </ButtonsContainer>
      </Header>
      
      {renderStatusBanner()}
      
      <ContentGrid>
        <div>
          <Section>
            <SectionTitle>
              <FaMoneyBill /> Informações do Pagamento
            </SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>ID do Pagamento</InfoLabel>
                <InfoValue>{payment.id}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>ID do Pedido</InfoLabel>
                <InfoValue>{payment.orderId}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Valor</InfoLabel>
                <InfoValue>{formatCurrency(payment.amount)}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Método</InfoLabel>
                <InfoValue>{getPaymentMethodLabel(payment.method)}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Data de Criação</InfoLabel>
                <InfoValue>{formatDate(payment.createdAt)}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Última Atualização</InfoLabel>
                <InfoValue>{formatDate(payment.updatedAt)}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Status</InfoLabel>
                <InfoValue>
                  <StatusBadge status={payment.status}>
                    {getStatusLabel(payment.status)}
                  </StatusBadge>
                </InfoValue>
              </InfoItem>
            </InfoGrid>
          </Section>
          
          {payment.method === 'CREDIT_CARD' && payment.paymentDetails && (
            <Section style={{ marginTop: '20px' }}>
              <SectionTitle>
                <FaCreditCard /> Detalhes do Cartão
              </SectionTitle>
              <InfoGrid>
                <InfoItem>
                  <InfoLabel>Bandeira</InfoLabel>
                  <InfoValue>{payment.paymentDetails.cardBrand}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Últimos Dígitos</InfoLabel>
                  <InfoValue>**** **** **** {payment.paymentDetails.cardLastDigits}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Parcelas</InfoLabel>
                  <InfoValue>{payment.paymentDetails.installments}x</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Código de Autorização</InfoLabel>
                  <InfoValue>{payment.paymentDetails.authorizationCode}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>ID da Transação</InfoLabel>
                  <InfoValue>{payment.paymentDetails.transactionId}</InfoValue>
                </InfoItem>
              </InfoGrid>
            </Section>
          )}
          
          <Section style={{ marginTop: '20px' }}>
            <SectionTitle>
              <FaHistory /> Histórico do Pagamento
            </SectionTitle>
            <Timeline>
              {payment.timeline.map((event, index) => (
                <TimelineItem key={index}>
                  <TimelineDot active={true} />
                  <TimelineContent>
                    <TimelineTitle>{event.description}</TimelineTitle>
                    <TimelineTime>{formatDate(event.time)}</TimelineTime>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </Section>
        </div>
        
        <div>
          <Section>
            <SectionTitle>
              <FaUser /> Informações do Cliente
            </SectionTitle>
            <InfoItem>
              <InfoLabel>Nome</InfoLabel>
              <InfoValue>{payment.customer.name}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Email</InfoLabel>
              <InfoValue>{payment.customer.email}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Telefone</InfoLabel>
              <InfoValue>{payment.customer.phone}</InfoValue>
            </InfoItem>
          </Section>
          
          <Section style={{ marginTop: '20px' }}>
            <SectionTitle>
              <FaStore /> Restaurante
            </SectionTitle>
            <InfoItem>
              <InfoLabel>Nome</InfoLabel>
              <InfoValue>{payment.restaurant.name}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Endereço</InfoLabel>
              <InfoValue>{payment.restaurant.address}</InfoValue>
            </InfoItem>
          </Section>
          
          <Section style={{ marginTop: '20px' }}>
            <SectionTitle>
              <FaReceipt /> Ações
            </SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {payment.status === 'PENDING' && (
                <>
                  <Button 
                    primary 
                    onClick={() => handleUpdateStatus('COMPLETED')}
                    style={{ justifyContent: 'center' }}
                  >
                    <FaCheck /> Aprovar Pagamento
                  </Button>
                  <Button 
                    onClick={() => handleUpdateStatus('FAILED')}
                    style={{ justifyContent: 'center' }}
                  >
                    <FaTimes /> Marcar como Falho
                  </Button>
                </>
              )}
              
              {payment.status === 'COMPLETED' && (
                <Button 
                  onClick={() => handleUpdateStatus('REFUNDED')}
                  style={{ justifyContent: 'center' }}
                >
                  <FaExchangeAlt /> Processar Reembolso
                </Button>
              )}
              
              {payment.status === 'FAILED' && (
                <Button 
                  primary
                  onClick={() => handleUpdateStatus('PENDING')}
                  style={{ justifyContent: 'center' }}
                >
                  <FaHistory /> Tentar Novamente
                </Button>
              )}
              
              <Button 
                onClick={() => window.open(`/orders/${payment.orderId}`, '_blank')}
                style={{ justifyContent: 'center' }}
              >
                <FaReceipt /> Ver Detalhes do Pedido
              </Button>
            </div>
          </Section>
        </div>
      </ContentGrid>
    </DetailsContainer>
  );
};

export default PaymentDetails;
