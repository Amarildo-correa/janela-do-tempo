import React, {memo} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {useFocusAnimation} from '../focus';
import {color, focus, radius} from '../theme';

type Props = {
  width: number;
  height: number;
  focused: boolean;
  pressed: boolean;
  label: string;
  children: React.ReactNode;
};

// Moldura comum dos cards dos rails, dentro de um item do Vega Carousel.
//
// O item tem uma folga (focus.room) em volta do card; a camada de foco (fundo
// escuro + anel amarelo de 4 px por fora) cresce dentro dela, a partir do
// centro, sem empurrar nem cobrir os cards vizinhos. Ao apertar OK o card
// inteiro encolhe, também a partir do centro.
export const FocusCard = memo(function FocusCard({
  width,
  height,
  focused,
  pressed,
  label,
  children,
}: Props) {
  const {layerStyle, pressStyle} = useFocusAnimation(focused, pressed);

  return (
    <View style={styles.room}>
      <Animated.View
        style={[styles.card, {width, height}, pressStyle]}
        accessible
        aria-label={label}>
        <View style={[styles.rest, focused && styles.restHidden]} />
        <Animated.View style={[styles.layer, layerStyle]} />
        {children}
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  room: {padding: focus.room},
  card: {alignItems: 'center', justifyContent: 'center'},
  // Fundo de repouso (6% de branco); some quando a camada de foco aparece.
  rest: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radius.tile,
    backgroundColor: color.surfaceTile,
  },
  restHidden: {opacity: 0},
  layer: {
    position: 'absolute',
    top: -focus.borderWidth,
    right: -focus.borderWidth,
    bottom: -focus.borderWidth,
    left: -focus.borderWidth,
    borderRadius: radius.tile + focus.borderWidth,
    borderWidth: focus.borderWidth,
    borderColor: color.focus,
    backgroundColor: color.surfaceFocus,
  },
});
