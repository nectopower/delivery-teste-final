import React from 'react';
import styled from 'styled-components';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';

const RatingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StarsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const StarWrapper = styled.div`
  cursor: ${props => props.readOnly ? 'default' : 'pointer'};
  color: #f59e0b;
  font-size: ${props => props.size || '24px'};
  
  &:hover {
    transform: ${props => props.readOnly ? 'none' : 'scale(1.1)'};
  }
`;

const RatingValue = styled.span`
  margin-left: 8px;
  font-weight: 500;
  color: #1e293b;
`;

const RatingLabel = styled.label`
  font-size: 14px;
  color: #64748b;
`;

const StarRating = ({ 
  rating, 
  onChange, 
  readOnly = false, 
  size, 
  showValue = true,
  label
}) => {
  const handleClick = (newRating) => {
    if (readOnly) return;
    onChange(newRating);
  };

  const renderStars = () => {
    const stars = [];
    const roundedRating = Math.round(rating * 2) / 2; // Arredonda para o 0.5 mais próximo

    for (let i = 1; i <= 5; i++) {
      if (i <= roundedRating) {
        // Estrela cheia
        stars.push(
          <StarWrapper 
            key={i} 
            onClick={() => handleClick(i)}
            readOnly={readOnly}
            size={size}
          >
            <FaStar />
          </StarWrapper>
        );
      } else if (i - 0.5 === roundedRating) {
        // Meia estrela
        stars.push(
          <StarWrapper 
            key={i} 
            onClick={() => handleClick(i)}
            readOnly={readOnly}
            size={size}
          >
            <FaStarHalfAlt />
          </StarWrapper>
        );
      } else {
        // Estrela vazia
        stars.push(
          <StarWrapper 
            key={i} 
            onClick={() => handleClick(i)}
            readOnly={readOnly}
            size={size}
          >
            <FaRegStar />
          </StarWrapper>
        );
      }
    }

    return stars;
  };

  return (
    <RatingContainer>
      {label && <RatingLabel>{label}</RatingLabel>}
      <StarsContainer>
        {renderStars()}
        {showValue && <RatingValue>{rating.toFixed(1)}</RatingValue>}
      </StarsContainer>
    </RatingContainer>
  );
};

export default StarRating;
