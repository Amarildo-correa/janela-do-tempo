import React, {forwardRef, useCallback, useState} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import {useFocusAnimation} from '../focus';
import {color, focus, px, radius, size, space, type} from '../theme';
import {UiIcon} from './WeatherIcon';

type Props = {
  label: string;
  // O que acontece ao apertar OK, dito pelo leitor de tela.
  hint: string;
  icon?: 'search';
  onPress: () => void;
  hasTVPreferredFocus?: boolean;
  // Avisa quem precisa saber que o botão recebeu o foco.
  onFocused?: () => void;
};

// Botão em pílula de 80 px. Pressable do React Native, como manda o guia de
// migração do kepler-ui-components 3.x (o Button de lá está obsoleto no RN
// 0.83). Mesma assinatura de foco dos cards: a camada (fundo escuro + anel
// amarelo por fora) aparece e cresce a partir do centro, o texto fica
// amarelo, o ícone engrossa, e o botão encolhe enquanto o OK está apertado.
export const PillButton = forwardRef<View, Props>(function PillButton(
  {label, hint, icon, onPress, hasTVPreferredFocus, onFocused},
  ref,
) {
  const [focused, setFocused] = useState(false);
  const [pressed, setPressed] = useState(false);
  const {layerStyle, pressStyle} = useFocusAnimation(focused, pressed);

  const onFocus = useCallback(() => {
    setFocused(true);
    onFocused?.();
  }, [onFocused]);
  const onBlur = useCallback(() => {
    setFocused(false);
    setPressed(false);
  }, []);
  const onPressIn = useCallback(() => setPressed(true), []);
  const onPressOut = useCallback(() => setPressed(false), []);

  return (
    <Pressable
      ref={ref}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onFocus={onFocus}
      onBlur={onBlur}
      hasTVPreferredFocus={hasTVPreferredFocus}
      role="button"
      aria-label={label}
      accessibilityHint={hint}>
      <Animated.View style={[styles.pill, pressStyle]}>
        <View style={[styles.rest, focused && styles.restHidden]} />
        <Animated.View style={[styles.layer, layerStyle]} />
        {icon ? (
          <UiIcon
            name={icon}
            solid={focused}
            size={size.icon.button}
            color={focused ? color.focus : color.ink}
          />
        ) : null}
        <Text style={focused ? styles.labelFocused : styles.label}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  pill: {
    height: px(80),
    paddingHorizontal: space.s32 + focus.borderWidth,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.s12,
  },
  // Fundo de repouso (6% de branco); some quando a camada de foco aparece.
  rest: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radius.pill,
    backgroundColor: color.surfaceTile,
  },
  restHidden: {opacity: 0},
  layer: {
    position: 'absolute',
    top: -focus.borderWidth,
    right: -focus.borderWidth,
    bottom: -focus.borderWidth,
    left: -focus.borderWidth,
    borderRadius: radius.pill + focus.borderWidth,
    borderWidth: focus.borderWidth,
    borderColor: color.focus,
    backgroundColor: color.surfaceFocus,
  },
  label: {...type.button, color: color.ink},
  labelFocused: {...type.button, color: color.focus},
});
