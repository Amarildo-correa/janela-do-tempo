import React, {memo} from 'react';
import Ionicons from '@amazon-devices/react-native-vector-icons/Ionicons';
import {IconKind} from '../weather/conditions';

// Ícones de condição do Ionicons (via @amazon-devices/react-native-vector-icons):
// contorno em repouso, sólido em foco.
const NAMES: Record<IconKind, string> = {
  sun: 'sunny',
  moon: 'moon',
  'cloud-sun': 'partly-sunny',
  'cloud-moon': 'cloudy-night',
  cloud: 'cloudy',
  rain: 'rainy',
  storm: 'thunderstorm',
  snow: 'snow',
};

type Props = {
  kind: IconKind;
  solid: boolean;
  size: number;
  color: string;
};

export const WeatherIcon = memo(function WeatherIcon({
  kind,
  solid,
  size,
  color,
}: Props) {
  const name = solid ? NAMES[kind] : `${NAMES[kind]}-outline`;
  return (
    <Ionicons
      name={name}
      size={size}
      color={color}
      accessible={false}
      importantForAccessibility="no"
    />
  );
});

type UiIconProps = {
  name: 'search' | 'thermometer' | 'umbrella' | 'water';
  solid?: boolean;
  size: number;
  color: string;
};

// Ícones de interface (busca e rótulos dos detalhes).
export const UiIcon = memo(function UiIcon({
  name,
  solid = false,
  size,
  color,
}: UiIconProps) {
  return (
    <Ionicons
      name={solid ? name : `${name}-outline`}
      size={size}
      color={color}
      accessible={false}
      importantForAccessibility="no"
    />
  );
});
