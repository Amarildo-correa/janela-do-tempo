import React from 'react';
import {StyleSheet} from 'react-native';
import LinearGradient from '@amazon-devices/react-linear-gradient';
import {screenGradient} from '../theme';

// Fundo da tela: o gradiente de ardósia é a única camada de fundo.
export function ScreenBackground({children}: {children: React.ReactNode}) {
  return (
    <LinearGradient
      colors={screenGradient.colors}
      locations={screenGradient.locations}
      style={styles.root}>
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1},
});
