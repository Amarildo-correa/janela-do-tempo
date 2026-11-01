import React, {memo} from 'react';
import {StyleSheet, Text} from 'react-native';
import {useCardFocused} from '../focus';
import {color, size, space, type} from '../theme';
import {degrees} from '../weather/format';
import {Hour, hourA11y} from '../weather/forecast';
import {FocusCard} from './FocusCard';
import {WeatherIcon} from './WeatherIcon';

type Props = {item: Hour; index: number};

// Card de "Próximas horas", desenhado dentro de um item do Vega Carousel. Em
// foco, a hora, o ícone (sólido) e a temperatura ficam amarelos.
export const HourCard = memo(function HourCard({item, index}: Props) {
  const focused = useCardFocused('hours', index);
  const s = focused ? focusedStyles : styles;

  return (
    <FocusCard
      width={size.cardW}
      height={size.hourCardH}
      focused={focused}
      label={hourA11y(item)}>
      <Text style={s.label}>{item.label}</Text>
      <WeatherIcon
        kind={item.condition.icon}
        solid={focused}
        size={size.icon.hour}
        color={focused ? color.focus : color.ink}
        style={styles.icon}
      />
      <Text style={s.temp}>{degrees(item.temp)}</Text>
    </FocusCard>
  );
});

const styles = StyleSheet.create({
  label: {...type.cardLabel, color: color.inkMuted},
  icon: {marginVertical: space.s12},
  temp: {...type.cardTemp, color: color.ink},
});

const focusedStyles = StyleSheet.create({
  label: {...type.cardLabel, color: color.focus},
  temp: {...type.cardTemp, color: color.focus},
});
