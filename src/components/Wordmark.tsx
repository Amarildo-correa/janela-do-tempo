import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {color, radius, space, type} from '../theme';

// Logotipo tipográfico: "Janela do" em azul-céu + "Tempo" numa pílula azul.
export const Wordmark = memo(function Wordmark() {
  return (
    <View
      style={styles.row}
      accessible
      role="heading"
      aria-label="Janela do Tempo">
      <Text style={styles.lead}>Janela do</Text>
      <View style={styles.pill}>
        <Text style={styles.mark}>Tempo</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {flexDirection: 'row', alignItems: 'center', gap: space.s12},
  lead: {...type.wordmark, color: color.sky},
  pill: {
    backgroundColor: color.sky,
    borderRadius: radius.mark,
    paddingHorizontal: space.s14,
  },
  mark: {...type.wordmark, color: color.skyInk},
});
