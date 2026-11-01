import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {color, size, space, type} from '../theme';
import {degrees} from '../weather/format';
import {HeroModel} from '../weather/selection';
import {WeatherIcon} from './WeatherIcon';

// Hero: espelha o card em foco. Não é focável.
export const HeroNow = memo(function HeroNow({hero}: {hero: HeroModel}) {
  return (
    <View
      style={styles.root}
      accessible
      aria-label={`${hero.when} ${hero.where}, ${degrees(hero.temp)}, ${
        hero.condition.label
      }`}>
      <View style={styles.title}>
        <Text style={styles.when} numberOfLines={1}>
          {hero.when}
        </Text>
        <Text style={styles.where} numberOfLines={1}>
          {` ${hero.where}`}
        </Text>
      </View>
      <View style={styles.row}>
        <WeatherIcon
          kind={hero.condition.icon}
          solid={false}
          size={size.icon.hero}
          color={color.inkSoft}
        />
        <Text style={styles.temp}>{degrees(hero.temp)}</Text>
        <View style={styles.condition}>
          <Text style={styles.conditionText} numberOfLines={1}>
            {hero.condition.label}
          </Text>
          <Text style={styles.support} numberOfLines={1}>
            {hero.support}
          </Text>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {gap: space.s28},
  title: {flexDirection: 'row'},
  when: {...type.whenWhere, color: color.ink},
  where: {...type.whereMuted, color: color.inkMuted},
  row: {flexDirection: 'row', alignItems: 'center', gap: space.s32},
  temp: {...type.tempHero, color: color.ink},
  condition: {gap: space.s10, marginLeft: space.s8, flexShrink: 1},
  conditionText: {...type.condition, color: color.ink},
  support: {...type.conditionSub, color: color.inkMuted},
});
