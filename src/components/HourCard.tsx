import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useCardFocused} from '../focus';
import {color, radius, size, space, type} from '../theme';
import {degrees} from '../weather/format';
import {Hour, hourA11y} from '../weather/forecast';
import {WeatherIcon} from './WeatherIcon';

type Props = {item: Hour; index: number};

// Card de "Próximas horas", desenhado dentro de um item do Vega Carousel. A
// borda amarela, a escala e a rolagem vêm do Carousel; o card troca o fundo,
// as cores e o ícone quando está em foco.
export const HourCard = memo(function HourCard({item, index}: Props) {
  const focused = useCardFocused('hours', index);
  const s = focused ? focusedStyles : styles;

  return (
    <View style={s.card} accessible aria-label={hourA11y(item)}>
      <Text style={s.label}>{item.label}</Text>
      <WeatherIcon
        kind={item.condition.icon}
        solid={focused}
        size={size.icon.hour}
        color={focused ? color.focus : color.ink}
      />
      <Text style={s.temp}>{degrees(item.temp)}</Text>
    </View>
  );
});

const card = {
  width: size.cardW,
  height: size.hourCardH,
  borderRadius: radius.tile,
  alignItems: 'center',
  justifyContent: 'center',
  gap: space.s12,
} as const;

const styles = StyleSheet.create({
  card: {...card, backgroundColor: color.surfaceTile},
  label: {...type.cardLabel, color: color.inkMuted},
  temp: {...type.cardTemp, color: color.ink},
});

const focusedStyles = StyleSheet.create({
  card: {...card, backgroundColor: color.surfaceFocus},
  label: {...type.cardLabel, color: color.focus},
  temp: {...type.cardTemp, color: color.focus},
});
