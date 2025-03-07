import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowLeft, FaEdit, FaTrash, FaStar, FaPhone, FaMapMarkerAlt, FaUtensils, FaCalendarAlt, FaCheck, FaTimes, FaComment } from 'react-icons/fa';
import api from '../services/api';
import StarRating from '../components/StarRating';

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
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  background-color: ${props => {
    if (props.primary) return '#3b82f6';
    if (props.danger) return '#ef4444';
    return 'white';
  }};
  color: ${props => {
    if (props.primary || props.danger) return 'white';
    return '#1e293b';
  }};
  border: ${props => (props.primary || props.danger) ? 'none' : '1px solid #e2e8f0'};
  border-radius: 4px;
  padding: 10px 16px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background-color: ${props => {
      if (props.primary) return '#2563eb';
      if (props.danger) return '#dc2626';
      return '#f8fafc';
    }};
  }
`;

const RestaurantHeader = styled.div`
  display: flex;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const RestaurantImage = styled.div`
  flex: 0 0 300px;
  background-image: url(${props => props.src || 'https://via.placeholder.com/300x300?text=Restaurante'});
  background-size: cover;
  background-position: center;
  
  @media (max-width: 768px) {
    height: 200px;
    flex: none;
  }
`;

const RestaurantInfo = styled.div`
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const RestaurantName = styled.h2`
  margin: 0;
  color: #1e293b;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const RestaurantStatus = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${props => props.active ? '#10b981' : '#ef4444'};
  color: white;
`;

const RestaurantDescription = styled.p`
  margin: 0;
  color: #64748b;
  line-height: 1.6;
`;

const RestaurantMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 14px;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #f59e0b;
  font-weight: 500;
`;

const SectionTitle = styled.h3`
  margin: 0 0 16px 0;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Section = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
`;

const MenuItem = styled.div`
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MenuItemName = styled.h4`
  margin: 0;
  color: #1e293b;
`;

const MenuItemPrice = styled.div`
  font-weight: 500;
  color: #10b981;
`;

const MenuItemDescription = styled.p`
  margin: 0;
  color: #64748b;
  font-size: 14px;
  line-height: 1.5;
`;

const NoItems = styled.p`
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

const DetailLabel = styled.span`
  color: #64748b;
  font-size: 14px;
`;

const ReviewsSection = styled.div`
  margin-top: 16px;
`;

const ReviewItem = styled.div`
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const ReviewAuthor = styled.div`
  font-weight: 500;
  color: #1e293b;
`;

const ReviewDate = styled.div`
  font-size: 12px;
  color: #94a3b8;
`;

const ReviewText = styled.p`
  margin: 8px 0 0;
  color: #64748b;
  font-size: 14px;
  line-height: 1.5;
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

const CommentTypeBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  margin-left: 8px;
  background-color: ${props => props.type === 'praise' ? '#dcfce7' : '#fee2e2'};
  color: ${props => props.type === 'praise' ? '#16a34a' : '#dc2626'};
`;

const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminRating, setAdminRating] = useState(0);
  const [comment, setComment] = useState('');
  const [commentType, setCommentType] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reviews, setReviews] = useState([]);
  
  const MAX_COMMENT_LENGTH = 140;
  
  useEffect(() => {
    fetchRestaurantDetails();
    fetchReviews();
  }, [id]);
  
  const fetchRestaurantDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/restaurants/${id}`);
      setRestaurant(response.data);
      
      const menuResponse = await api.get(`/admin/restaurants/${id}/dishes`);
      setMenu(menuResponse.data);
      
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar detalhes do restaurante:', error);
      setLoading(false);
      
      // Dados simulados para demonstração
      setTimeout(() => {
        const mockRestaurant = {
          id: parseInt(id),
          name: 'Restaurante Bom Sabor',
          description: 'Especializado em comida caseira com ingredientes frescos e de qualidade. Nossa missão é proporcionar uma experiência gastronômica que remeta ao aconchego de casa, com pratos tradicionais e um toque especial do nosso chef.',
          address: 'Rua das Flores, 123 - Centro, São Paulo - SP',
          phone: '(11) 98765-4321',
          rating: 4.7,
          isActive: true,
          imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
          createdAt: '2023-01-10'
        };
        
        const mockMenu = [
          {
            id: 1,
            name: 'Feijoada Completa',
            description: 'Tradicional feijoada com todas as carnes, acompanha arroz, couve, farofa e laranja.',
            price: 45.90,
            isAvailable: true,
            imageUrl: 'https://images.unsplash.com/photo-1564671546498-aa134e5e9f5d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZmVpam9hZGF8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60'
          },
          {
            id: 2,
            name: 'Picanha na Brasa',
            description: 'Suculenta picanha grelhada na brasa, acompanha arroz, feijão, farofa e vinagrete.',
            price: 59.90,
            isAvailable: true,
            imageUrl: 'https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGljYW5oYXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60'
          },
          {
            id: 3,
            name: 'Filé de Frango Grelhado',
            description: 'Filé de frango grelhado com ervas finas, acompanha purê de batatas e legumes salteados.',
            price: 39.90,
            isAvailable: true,
            imageUrl: 'https://images.unsplash.com/photo-1598515214146-dab39da1243d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Z3JpbGxlZCUyMGNoaWNrZW58ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60'
          },
          {
            id: 4,
            name: 'Salmão ao Molho de Maracujá',
            description: 'Filé de salmão grelhado com molho de maracujá, acompanha arroz com brócolis e batata sauté.',
            price: 65.90,
            isAvailable: false,
            imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2FsbW9ufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60'
          },
        ];
        
        setRestaurant(mockRestaurant);
        setMenu(mockMenu);
        setLoading(false);
      }, 500);
    }
  };
  
  const fetchReviews = async () => {
    try {
      const response = await api.get(`/admin/restaurants/${id}/reviews`);
      setReviews(response.data);
    } catch (error) {
      console.error('Erro ao buscar avaliações do restaurante:', error);
      
      // Dados simulados para demonstração
      const mockReviews = [
        {
          id: 1,
          rating: 5,
          comment: 'Comida excelente e entrega rápida! Recomendo a todos.',
          commentType: 'praise',
          author: 'Maria Silva',
          createdAt: '2023-05-15T14:30:00Z'
        },
        {
          id: 2,
          rating: 4,
          comment: 'Muito bom, mas a entrega demorou um pouco mais do que o esperado.',
          commentType: 'criticism',
          author: 'João Santos',
          createdAt: '2023-05-10T19:45:00Z'
        },
        {
          id: 3,
          rating: 5,
          comment: 'A feijoada é simplesmente incrível! Melhor da cidade.',
          commentType: 'praise',
          author: 'Ana Oliveira',
          createdAt: '2023-05-05T12:15:00Z'
        }
      ];
      
      setReviews(mockReviews);
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
      
      await api.post(`/admin/restaurants/${id}/rate`, {
        rating: adminRating,
        comment,
        commentType
      });
      
      alert('Avaliação enviada com sucesso!');
      setAdminRating(0);
      setComment('');
      setCommentType('');
      fetchRestaurantDetails(); // Atualizar os detalhes após a avaliação
      fetchReviews(); // Atualizar as avaliações
      
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
  
  const handleDeleteRestaurant = async () => {
    if (window.confirm('Tem certeza que deseja excluir este restaurante? Esta ação não pode ser desfeita.')) {
      try {
        await api.delete(`/admin/restaurants/${id}`);
        alert('Restaurante excluído com sucesso!');
        navigate('/restaurants');
      } catch (error) {
        console.error('Erro ao excluir restaurante:', error);
        alert('Erro ao excluir restaurante. Tente novamente.');
      }
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
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
    return <p>Carregando...</p>;
  }
  
  if (!restaurant) {
    return <p>Restaurante não encontrado.</p>;
  }
  
  return (
    <DetailsContainer>
      <Header>
        <Title>Detalhes do Restaurante</Title>
        <ButtonsContainer>
          <Button onClick={() => navigate('/restaurants')}>
            <FaArrowLeft /> Voltar
          </Button>
          <Link to={`/restaurants/edit/${id}`}>
            <Button primary>
              <FaEdit /> Editar
            </Button>
          </Link>
          <Button danger onClick={handleDeleteRestaurant}>
            <FaTrash /> Excluir
          </Button>
        </ButtonsContainer>
      </Header>
      
      <RestaurantHeader>
        <RestaurantImage src={restaurant.imageUrl} />
        <RestaurantInfo>
          <RestaurantName>
            {restaurant.name}
            <RestaurantStatus active={restaurant.isActive}>
              {restaurant.isActive ? 'Ativo' : 'Inativo'}
            </RestaurantStatus>
          </RestaurantName>
          
          <RestaurantDescription>{restaurant.description}</RestaurantDescription>
          
          <RestaurantMeta>
            <MetaItem>
              <FaMapMarkerAlt />
              {restaurant.address}
            </MetaItem>
            <MetaItem>
              <FaPhone />
              {restaurant.phone}
            </MetaItem>
            <MetaItem>
              <FaCalendarAlt />
              Cadastrado em {formatDate(restaurant.createdAt)}
            </MetaItem>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaStar style={{ color: '#f59e0b' }} />
              <span style={{ fontWeight: 500 }}>{restaurant.rating.toFixed(1)}</span>
              <StarRating 
                rating={restaurant.rating} 
                readOnly={true} 
                size="16px" 
                showValue={false}
              />
            </div>
          </RestaurantMeta>
        </RestaurantInfo>
      </RestaurantHeader>
      
      <RatingSection>
        <SectionTitle>
          <FaStar /> Avaliar Restaurante
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
              placeholder="Deixe um comentário sobre este restaurante..."
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
      
      <Section>
        <SectionTitle>
          <FaStar /> Avaliações dos Clientes
        </SectionTitle>
        
        {reviews.length > 0 ? (
          <ReviewsSection>
            {reviews.map(review => (
              <ReviewItem key={review.id}>
                <ReviewHeader>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <ReviewAuthor>{review.author}</ReviewAuthor>
                    {review.commentType && (
                      <CommentTypeBadge type={review.commentType}>
                        {review.commentType === 'praise' ? (
                          <><FaCheck /> Elogio</>
                        ) : (
                          <><FaTimes /> Crítica</>
                        )}
                      </CommentTypeBadge>
                    )}
                  </div>
                  <ReviewDate>{formatDateTime(review.createdAt)}</ReviewDate>
                </ReviewHeader>
                <StarRating 
                  rating={review.rating} 
                  readOnly={true} 
                  size="16px" 
                />
                {review.comment && <ReviewText>{review.comment}</ReviewText>}
              </ReviewItem>
            ))}
          </ReviewsSection>
        ) : (
          <NoItems>Nenhuma avaliação disponível.</NoItems>
        )}
      </Section>
      
      <Section>
        <SectionTitle>
          <FaUtensils /> Cardápio
        </SectionTitle>
        
        {menu.length > 0 ? (
          <MenuGrid>
            {menu.map(item => (
              <MenuItem key={item.id}>
                <MenuItemName>{item.name}</MenuItemName>
                <MenuItemDescription>{item.description}</MenuItemDescription>
                <MenuItemPrice>{formatCurrency(item.price)}</MenuItemPrice>
                {!item.isAvailable && (
                  <RestaurantStatus active={false}>
                    Indisponível
                  </RestaurantStatus>
                )}
              </MenuItem>
            ))}
          </MenuGrid>
        ) : (
          <NoItems>Nenhum item no cardápio.</NoItems>
        )}
      </Section>
    </DetailsContainer>
  );
};

export default RestaurantDetails;
