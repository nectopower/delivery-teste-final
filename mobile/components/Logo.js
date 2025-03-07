import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Circle, G, Path, Text as SvgText } from 'react-native-svg';

const Logo = ({ width = 150, height = 150 }) => {
  return (
    <View style={styles.container}>
      <Svg width={width} height={height} viewBox="0 0 200 200">
        <Rect width="200" height="200" fill="#FF4500" rx="20" ry="20" />
        <G transform="translate(40, 40)">
          {/* Plate/dish icon */}
          <Circle cx="60" cy="60" r="50" fill="white" />
          <Circle cx="60" cy="60" r="40" fill="#FF4500" />
          <Circle cx="60" cy="60" r="30" fill="white" />
          
          {/* Fork and knife */}
          <Rect x="20" y="30" width="5" height="60" rx="2" fill="white" transform="rotate(-30, 20, 30)" />
          <Rect x="100" y="30" width="5" height="60" rx="2" fill="white" transform="rotate(30, 100, 30)" />
        </G>
        <SvgText x="100" y="160" fontSize="16" fontWeight="bold" fill="white" textAnchor="middle">FOOD DELIVERY</SvgText>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Logo;
