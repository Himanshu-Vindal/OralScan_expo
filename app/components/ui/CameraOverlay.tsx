import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path } from 'react-native-svg';

interface CameraOverlayProps {
  isScanning?: boolean;
  progress?: number;
  instruction?: string;
  className?: string;
}

export const CameraOverlay: React.FC<CameraOverlayProps> = ({
  isScanning = false,
  progress = 0,
  instruction = "Position your mouth in the center",
  className = '',
}) => {
  const { width, height } = Dimensions.get('window');
  const overlaySize = width * 0.7;
  const centerX = width / 2;
  const centerY = height / 2;

  return (
    <View className={`absolute inset-0 ${className}`}>
      {/* Dark overlay with cutout */}
      <View className="absolute inset-0 bg-black/60" />
      
      {/* Center guide circle */}
      <View 
        className="absolute border-4 border-white rounded-full"
        style={{
          width: overlaySize,
          height: overlaySize,
          left: centerX - overlaySize / 2,
          top: centerY - overlaySize / 2,
        }}
      >
        {/* Scanning animation */}
        {isScanning && (
          <View className="absolute inset-0">
            <LinearGradient
              colors={['transparent', '#3b82f6', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="absolute inset-0 rounded-full opacity-60"
              style={{
                transform: [{ rotate: `${progress * 360}deg` }]
              }}
            />
          </View>
        )}
        
        {/* Corner guides */}
        <View className="absolute -top-2 -left-2">
          <View className="w-6 h-6 border-l-4 border-t-4 border-primary-500 rounded-tl-lg" />
        </View>
        <View className="absolute -top-2 -right-2">
          <View className="w-6 h-6 border-r-4 border-t-4 border-primary-500 rounded-tr-lg" />
        </View>
        <View className="absolute -bottom-2 -left-2">
          <View className="w-6 h-6 border-l-4 border-b-4 border-primary-500 rounded-bl-lg" />
        </View>
        <View className="absolute -bottom-2 -right-2">
          <View className="w-6 h-6 border-r-4 border-b-4 border-primary-500 rounded-br-lg" />
        </View>
      </View>
      
      {/* Instruction text */}
      <View 
        className="absolute px-6 py-3 bg-black/80 rounded-xl"
        style={{
          left: centerX - 120,
          top: centerY + overlaySize / 2 + 40,
          width: 240,
        }}
      >
        <Text className="text-white text-center text-sm font-medium">
          {instruction}
        </Text>
      </View>
      
      {/* Grid lines for positioning */}
      <Svg 
        width={width} 
        height={height} 
        className="absolute inset-0"
        style={{ opacity: 0.3 }}
      >
        {/* Vertical center line */}
        <Path
          d={`M ${centerX} ${centerY - overlaySize / 2} L ${centerX} ${centerY + overlaySize / 2}`}
          stroke="white"
          strokeWidth="1"
          strokeDasharray="5,5"
        />
        {/* Horizontal center line */}
        <Path
          d={`M ${centerX - overlaySize / 2} ${centerY} L ${centerX + overlaySize / 2} ${centerY}`}
          stroke="white"
          strokeWidth="1"
          strokeDasharray="5,5"
        />
      </Svg>
    </View>
  );
};

export default CameraOverlay;
