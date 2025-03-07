import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const StarRating = ({ rating, size = 20, onRatingChange, editable = false }) => {
  // Arredondar para o meio mais próximo (0, 0.5, 1, 1.5, etc.)
  const roundedRating = Math.round(rating * 2) / 2;
  
  const renderStar = (position) => {
    // Determinar o tipo de estrela
    let iconName;
    
    if (roundedRating >= position) {
      // Estrela cheia
      iconName = 'star';
    } else if (roundedRating + 0.5 === position) {
      // Meia estrela
      iconName = 'star-half';
    } else {
      // Estrela vazia
      iconName = 'star-outline';
    }
    
    // Se for editável, envolver em TouchableOpacity
    if (editable) {
      return (
        <TouchableOpacity
          key={position}
          onPress={() => onRatingChange(position)}
          style={styles.starButton}
        >
          <Ionicons name={iconName} size={size} color="#FFD700" />
        </TouchableOpacity>
      );
    }
    
    // Se não for editável, apenas renderizar o ícone
    return (
      <Ionicons
        key={position}
        name={iconName}
        size={size}
        color="#FFD700"
        style={styles.star}
      />
    );
  };
  
  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map(position => renderStar(position))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  star: {
    marginRight: 2,
  },
  starButton: {
    padding: 5,
    marginHorizontal: -3, // Compensar o padding para manter as estrelas próximas
  },
});

export default StarRating;
