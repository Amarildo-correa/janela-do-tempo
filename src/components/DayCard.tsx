import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useCardFocused} from '../focus';
import {color, size, space, type} from '../theme';
import {degrees} from '../weather/format';
import {Day, dayA11y} from '../weather/forecast';
import {FocusCard} from './FocusCard';
import {WeatherIcon} from './WeatherIcon';

type Props = {item: Day; index: number};

// Card de "Próximos dias", dentro de um item do Vega Carousel. Em foco, tudo
// fica amarelo, inclusive a data e a máxima.
export const DayCard = memo(function DayCard({item, index}: Props) {
  const focused = useCardFocused('days', index);
  const s = focused ? focusedStyles : styles;

  return (
    <FocusCard
      width={size.cardW}
      height={size.dayCardH}
      focused={focused}
      label={dayA11y(item)}>
      <View style={styles.when}>
        <Text style={s.day}>{item.label}</Text>
        <Text style={s.date}>{item.dateLabel}</Text>
      </View>
      <WeatherIcon
        kind={item.condition.icon}
        solid={focused}
        size={size.icon.day}
        color={focused ? color.focus : color.ink}
        style={styles.icon}
      />
      <View style={styles.minMax}>
        <Text style={s.min}>{degrees(item.min)}</Text>
        <Text style={s.max}>{degrees(item.max)}</Text>
      </View>
    </FocusCard>
  );
});

const styles = StyleSheet.create({
  when: {alignItems: 'center', gap: space.s8},
  icon: {marginVertical: space.s14},
  minMax: {flexDirection: 'row', gap: space.s14},
  day: {...type.dayLabel, color: color.ink},
  date: {...type.cardDate, color: color.inkMuted},
  min: {...type.cardMinMax, color: color.ink},
  max: {...type.cardMinMax, color: color.warm},
});

const focusedStyles = StyleSheet.create({
  day: {...type.dayLabel, color: color.focus},
  date: {...type.cardDate, color: color.focus},
  min: {...type.cardMinMax, color: color.focus},
  max: {...type.cardMinMax, color: color.focus},
});
