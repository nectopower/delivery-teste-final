import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowLeft, FaEdit, FaMotorcycle, FaBicycle, FaCar, FaTruck, FaCircle, FaUser, FaEnvelope, FaPhone, FaIdCard, FaCalendarAlt, FaStar, FaRoute, FaMoneyBillWave, FaCheck, FaTimes, FaComment } from 'react-icons/fa';
import api from '../services/api';
import StarRating from '../components/StarRating';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  margin: 0;
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

const ProfileSection = styled.div`
  display: flex;
  gap: 24px;
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ProfileImageContainer = styled.div`
  flex-shrink: 0;
`;

const ProfileImage = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: #94a3b8;
  overflow: hidden;
`;

const ProfileInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ProfileName = styled.h2`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 500;
  background-color: ${props => {
    switch (props.status) {
      case 'AVAILABLE': return '#dcfce7';
      case 'BUSY': return '#fef3c7';
      case 'OFFLINE': return '#f1f5f9';
      default: return '#f1f5f9';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'AVAILABLE': return '#16a34a';
      case 'BUSY': return '#d97706';
      case 'OFFLINE': return '#64748b';
      default: return '#64748b';
    }
  }};
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => {
    switch (props.status) {
      case 'AVAILABLE': return '#16a34a';
      case 'BUSY': return '#d97706';
      case 'OFFLINE': return '#64748b';
      default: return '#64748b';
    }
  }};
`;

const ProfileDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DetailLabel = styled.span`
  color: #64748b;
  font-size: 14px;
`;

const DetailValue = styled.span`
  color: #1e293b;
  font-weight: 500;
`;

const VehicleInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  padding: 8px 12px;
  background-color: #f8fafc;
  border-radius: 8px;
  width: fit-content;
`;

const VehicleIcon = styled.div`
  font-size: 18px;
  color: #64748b;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

const StatIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
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

const SectionTitle = styled.h3`
  margin: 0 0 16px 0;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const DeliveriesSection = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
  color: #64748b;
  font-weight: 500;
  font-size: 14px;
`;

const Td = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
  color: #1e293b;
  font-size: 14px;
`;

const OrderStatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 8px;
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

const NoDeliveries = styled.div`
  text-align: center;
  padding: 40px;
  color: #64748b;
  font-style: italic;
`;

const RatingSection = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const RatingForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 500px;
`;

const CommentInput = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
`;

const CharacterCounter = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: 12px;
  color: ${props => props.isLimit ? '#ef4444' : '#94a3b8'};
  margin-top: 4px;
`;

const SubmitButton = styled.button`
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 16px;
  font-size: 14px;
  cursor: pointer;
  width: fit-content;
  
  &:hover {
    background-color: #2563eb;
  }
  
  &:disabled {
    background-color: #94a3b8;
    cursor: not-allowed;
  }
`;

const CommentTypeSelector = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
`;

const CommentTypeButton = styled.button`
  background-color: ${props => props.active ? (props.type === 'praise' ? '#dcfce7' : '#fee2e2') : '#f1f5f9'};
  color: ${props => props.active ? (props.type === 'praise' ? '#16a34a' : '#dc2626') : '#64748b'};
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:hover {
    background-color: ${props => props.type === 'praise' ? '#dcfce7' : '#fee2e2'};
    color: ${props => props.type === 'praise' ? '#16a34a' : '#dc2626'};
  }
`;

const DeliveryPersonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deliveryPerson, setDeliveryPerson] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminRating, setAdminRating] = useState(0);
  const [comment, setComment] = useState('');
  const [commentType, setCommentType] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const MAX_COMMENT_LENGTH = 140;
  
  useEffect(() => {
    fetchDeliveryPerson();
    fetchStats();
  }, [id]);
  
  const fetchDeliveryPerson = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/delivery-persons/${id}`);
      setDeliveryPerson(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar dados do entregador:', error);
      setLoading(false);
    }
  };
  
  const fetchStats = async () => {
    try {
      const response = await api.get(`/delivery-persons/${id}/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Erro ao buscar estatísticas do entregador:', error);
    }
  };
  
  const handleSubmitRating = async (e) => {
    e.preventDefault();
    
    if (adminRating === 0) {
      alert('Por favor, selecione uma avaliação de 1 a 5 estrelas.');
      return;
    }
    
    try {
      setSubmitting(true);
      
      await api.post(`/delivery-persons/${id}/rate`, {
        rating: adminRating,
        comment,
        commentType
      });
      
      alert('Avaliação enviada com sucesso!');
      setAdminRating(0);
      setComment('');
      setCommentType('');
      fetchStats(); // Atualizar as estatísticas após a avaliação
      
      setSubmitting(false);
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
      alert('Erro ao enviar avaliação. Tente novamente.');
      setSubmitting(false);
    }
  };
  
  const handleCommentChange = (e) => {
    const value = e.target.value;
    if (value.length <= MAX_COMMENT_LENGTH) {
      setComment(value);
    }
  };
  
  const getStatusLabel = (status) => {
    switch (status) {
      case 'AVAILABLE': return 'Disponível';
      case 'BUSY': return 'Ocupado';
      case 'OFFLINE': return 'Offline';
      default: return status;
    }
  };
  
  const getVehicleTypeLabel = (type) => {
    switch (type) {
      case 'BICYCLE': return 'Bicicleta';
      case 'MOTORCYCLE': return 'Moto';
      case 'CAR': return 'Carro';
      case 'VAN': return 'Van';
      default: return type;
    }
  };
  
  const getVehicleIcon = (type) => {
    switch (type) {
      case 'BICYCLE':
        return <FaBicycle />;
      case 'MOTORCYCLE':
        return <FaMotorcycle />;
      case 'CAR':
        return <FaCar />;
      case 'VAN':
        return <FaTruck />;
      default:
        return null;
    }
  };
  
  const getOrderStatusLabel = (status) => {
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
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  if (loading) {
    return <p>Carregando dados do entregador...</p>;
  }
  
  if (!deliveryPerson) {
    return <p>Entregador não encontrado.</p>;
  }
  
  return (
    <Container>
      <Header>
        <Title>Detalhes do Entregador</Title>
        <ButtonsContainer>
          <Button onClick={() => navigate('/delivery-persons')}>
            <FaArrowLeft /> Voltar
          </Button>
          <Button primary as={Link} to={`/delivery-persons/${id}/edit`}>
            <FaEdit /> Editar
          </Button>
        </ButtonsContainer>
      </Header>
      
      <ProfileSection>
        <ProfileImageContainer>
          <ProfileImage>
            <FaUser />
          </ProfileImage>
        </ProfileImageContainer>
        
        <ProfileInfo>
          <ProfileName>
            {deliveryPerson.user.name}
            <StatusBadge status={deliveryPerson.status}>
              <StatusDot status={deliveryPerson.status} />
              {getStatusLabel(deliveryPerson.status)}
            </StatusBadge>
            {!deliveryPerson.isActive && (
              <StatusBadge status="OFFLINE" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
                Inativo
              </StatusBadge>
            )}
          </ProfileName>
          
          <ProfileDetails>
            <DetailItem>
              <FaEnvelope style={{ color: '#64748b' }} />
              <DetailLabel>Email:</DetailLabel>
              <DetailValue>{deliveryPerson.user.email}</DetailValue>
            </DetailItem>
            
            <DetailItem>
              <FaPhone style={{ color: '#64748b' }} />
              <DetailLabel>Telefone:</DetailLabel>
              <DetailValue>{deliveryPerson.phone}</DetailValue>
            </DetailItem>
            
            <DetailItem>
              <FaIdCard style={{ color: '#64748b' }} />
              <DetailLabel>CPF:</DetailLabel>
              <DetailValue>{deliveryPerson.cpf}</DetailValue>
            </DetailItem>
            
            <DetailItem>
              <FaCalendarAlt style={{ color: '#64748b' }} />
              <DetailLabel>Cadastro:</DetailLabel>
              <DetailValue>{formatDate(deliveryPerson.createdAt)}</DetailValue>
            </DetailItem>
          </ProfileDetails>
          
          <VehicleInfo>
            <VehicleIcon>
              {getVehicleIcon(deliveryPerson.vehicleType)}
            </VehicleIcon>
            <span>{getVehicleTypeLabel(deliveryPerson.vehicleType)}</span>
            {deliveryPerson.vehiclePlate && (
              <span style={{ marginLeft: '8px', color: '#64748b' }}>
                Placa: {deliveryPerson.vehiclePlate}
              </span>
            )}
          </VehicleInfo>
        </ProfileInfo>
      </ProfileSection>
      
      {stats && (
        <StatsGrid>
          <StatCard>
            <StatIcon bgColor="#e0f2fe" color="#0284c7">
              <FaRoute />
            </StatIcon>
            <StatTitle>Total de Entregas</StatTitle>
            <StatValue>{stats.totalDeliveries}</StatValue>
          </StatCard>
          
          <StatCard>
            <StatIcon bgColor="#dcfce7" color="#16a34a">
              <FaCheck />
            </StatIcon>
            <StatTitle>Entregas Concluídas</StatTitle>
            <StatValue>{stats.completedDeliveries}</StatValue>
          </StatCard>
          
          <StatCard>
            <StatIcon bgColor="#fee2e2" color="#dc2626">
              <FaTimes />
            </StatIcon>
            <StatTitle>Entregas Canceladas</StatTitle>
            <StatValue>{stats.canceledDeliveries}</StatValue>
          </StatCard>
          
          <StatCard>
            <StatIcon bgColor="#fef3c7" color="#d97706">
              <FaMoneyBillWave />
            </StatIcon>
            <StatTitle>Ganhos Totais</StatTitle>
            <StatValue>{formatCurrency(stats.totalEarnings)}</StatValue>
          </StatCard>
          
          <StatCard style={{ gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <StatIcon bgColor="#dbeafe" color="#2563eb">
                <FaStar />
              </StatIcon>
              <div>
                <StatTitle>Avaliação Média</StatTitle>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <StatValue>{stats.rating.toFixed(1)}</StatValue>
                  <StarRating 
                    rating={stats.rating} 
                    readOnly={true} 
                    size="20px" 
                    showValue={false}
                  />
                </div>
              </div>
            </div>
          </StatCard>
        </StatsGrid>
      )}
      
      <RatingSection>
        <SectionTitle>
          <FaStar /> Avaliar Entregador
        </SectionTitle>
        
        <RatingForm onSubmit={handleSubmitRating}>
          <StarRating 
            rating={adminRating} 
            onChange={setAdminRating} 
            label="Selecione uma avaliação (1-5 estrelas)"
          />
          
          <div>
            <DetailLabel>Tipo de comentário (opcional):</DetailLabel>
            <CommentTypeSelector>
              <CommentTypeButton 
                type="praise" 
                active={commentType === 'praise'}
                onClick={(e) => {
                  e.preventDefault();
                  setCommentType(commentType === 'praise' ? '' : 'praise');
                }}
              >
                <FaCheck /> Elogio
              </CommentTypeButton>
              <CommentTypeButton 
                type="criticism" 
                active={commentType === 'criticism'}
                onClick={(e) => {
                  e.preventDefault();
                  setCommentType(commentType === 'criticism' ? '' : 'criticism');
                }}
              >
                <FaTimes /> Crítica
              </CommentTypeButton>
            </CommentTypeSelector>
          </div>
          
          <div>
            <DetailLabel>Comentário (opcional, máx. 140 caracteres):</DetailLabel>
            <CommentInput 
              value={comment}
              onChange={handleCommentChange}
              placeholder="Deixe um comentário sobre o desempenho deste entregador..."
              maxLength={MAX_COMMENT_LENGTH}
            />
            <CharacterCounter isLimit={comment.length >= MAX_COMMENT_LENGTH}>
              {comment.length}/{MAX_COMMENT_LENGTH}
            </CharacterCounter>
          </div>
          
          <SubmitButton type="submit" disabled={submitting || adminRating === 0}>
            {submitting ? 'Enviando...' : 'Enviar Avaliação'}
          </SubmitButton>
        </RatingForm>
      </RatingSection>
      
      <DeliveriesSection>
        <SectionTitle>
          <FaRoute /> Últimas Entregas
        </SectionTitle>
        
        {deliveryPerson.deliveries && deliveryPerson.deliveries.length > 0 ? (
          <Table>
            <thead>
              <tr>
                <Th>Data</Th>
                <Th>Pedido</Th>
                <Th>Cliente</Th>
                <Th>Restaurante</Th>
                <Th>Valor</Th>
                <Th>Status</Th>
                <Th>Avaliação</Th>
              </tr>
            </thead>
            <tbody>
              {deliveryPerson.deliveries.map(delivery => (
                <tr key={delivery.id}>
                  <Td>{formatDateTime(delivery.createdAt)}</Td>
                  <Td>
                    <Link to={`/orders/${delivery.order.id}`} style={{ color: '#3b82f6', textDecoration: 'none' }}>
                      #{delivery.order.id.substring(0, 8)}
                    </Link>
                  </Td>
                  <Td>{delivery.order.customer.user.name}</Td>
                  <Td>{delivery.order.restaurant.user.name}</Td>
                  <Td>{formatCurrency(delivery.order.total)}</Td>
                  <Td>
                    <OrderStatusBadge status={delivery.order.status}>
                      {getOrderStatusLabel(delivery.order.status)}
                    </OrderStatusBadge>
                  </Td>
                  <Td>
                    {delivery.customerRating ? (
                      <StarRating 
                        rating={delivery.customerRating} 
                        readOnly={true} 
                        size="16px" 
                        showValue={true}
                      />
                    ) : (
                      <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '14px' }}>
                        Sem avaliação
                      </span>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <NoDeliveries>
            Este entregador ainda não realizou nenhuma entrega.
          </NoDeliveries>
        )}
      </DeliveriesSection>
    </Container>
  );
};

export default DeliveryPersonDetails;
