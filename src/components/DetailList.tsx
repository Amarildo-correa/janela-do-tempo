import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {color, size, space, type} from '../theme';
import {degrees, percent} from '../weather/format';
import {HeroModel} from '../weather/selection';
import {UiIcon} from './WeatherIcon';

type RowProps = {
  icon: 'thermometer' | 'umbrella' | 'water';
  label: string;
  children: React.ReactNode;
};

function Row({icon, label, children}: RowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.label}>
        <UiIcon name={icon} size={size.icon.detail} color={color.sky} />
        <Text style={styles.labelText}>{label}</Text>
      </View>
      <View style={styles.value}>{children}</View>
    </View>
  );
}

// Detalhes do momento selecionado. Sem fundo: não é focável e não pode
// parecer um botão.
export const DetailList = memo(function DetailList({hero}: {hero: HeroModel}) {
  return (
    <View
      style={styles.root}
      accessible
      aria-label={`Mínima ${degrees(hero.min)}, máxima ${degrees(
        hero.max,
      )}, chuva ${percent(hero.rain)}, umidade ${percent(hero.humidity)}`}>
      <Row icon="thermometer" label="Mín / Máx">
        <Text style={styles.valueText}>{degrees(hero.min)}</Text>
        <Text style={styles.slash}> / </Text>
        <Text style={styles.max}>{degrees(hero.max)}</Text>
      </Row>
      <Row icon="umbrella" label="Chuva">
        <Text style={styles.valueText}>{percent(hero.rain)}</Text>
      </Row>
      <Row icon="water" label="Umidade">
        <Text style={styles.valueText}>{percent(hero.humidity)}</Text>
      </Row>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {width: size.detailsW, gap: space.s36},
  row: {flexDirection: 'row', alignItems: 'center', gap: space.s48},
  label: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.s16,
    flex: 1,
  },
  labelText: {...type.detailLabel, color: color.inkMuted},
  value: {flexDirection: 'row', alignItems: 'baseline'},
  valueText: {...type.detailValue, color: color.ink},
  slash: {
    ...type.detailValue,
    fontFamily: type.whereMuted.fontFamily,
    color: color.inkFaint,
  },
  max: {...type.detailValue, color: color.warm},
});
