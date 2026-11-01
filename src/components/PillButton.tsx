import React, {forwardRef, useCallback, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {color, focus, px, radius, size, space, type} from '../theme';
import {UiIcon} from './WeatherIcon';

type Props = {
  label: string;
  // O que acontece ao apertar OK, dito pelo leitor de tela.
  hint: string;
  icon?: 'search';
  onPress: () => void;
  hasTVPreferredFocus?: boolean;
};

// Botão em pílula de 80 px. Pressable do React Native, como manda o guia de
// migração do kepler-ui-components 3.x (o Button de lá está obsoleto no RN
// 0.83). Em foco: fundo escuro, borda amarela, texto amarelo e ícone mais
// grosso.
export const PillButton = forwardRef<View, Props>(function PillButton(
  {label, hint, icon, onPress, hasTVPreferredFocus},
  ref,
) {
  const [focused, setFocused] = useState(false);
  const onFocus = useCallback(() => setFocused(true), []);
  const onBlur = useCallback(() => setFocused(false), []);
  const fg = focused ? color.focus : color.ink;
  // Encolhe enquanto o OK está apertado, como os cards do Vega Carousel.
  const pressableStyle = useCallback(
    ({pressed}: {pressed: boolean}) => [
      focused ? styles.focused : styles.rest,
      pressed && styles.pressed,
    ],
    [focused],
  );

  return (
    <Pressable
      ref={ref}
      onPress={onPress}
      onFocus={onFocus}
      onBlur={onBlur}
      hasTVPreferredFocus={hasTVPreferredFocus}
      style={pressableStyle}
      role="button"
      aria-label={label}
      accessibilityHint={hint}>
      {icon ? (
        <UiIcon
          name={icon}
          solid={focused}
          size={size.icon.button}
          color={fg}
        />
      ) : null}
      <Text style={focused ? styles.labelFocused : styles.label}>{label}</Text>
    </Pressable>
  );
});

const base = {
  height: px(80),
  paddingHorizontal: space.s32,
  borderRadius: radius.pill,
  borderWidth: focus.borderWidth,
  flexDirection: 'row',
  alignItems: 'center',
  gap: space.s12,
} as const;

const styles = StyleSheet.create({
  rest: {
    ...base,
    backgroundColor: color.surfaceTile,
    borderColor: 'transparent',
  },
  focused: {
    ...base,
    backgroundColor: color.surfaceFocus,
    borderColor: color.focus,
    transform: [{scale: focus.scale}],
  },
  pressed: {transform: [{scale: focus.pressedScale}]},
  label: {...type.button, color: color.ink},
  labelFocused: {...type.button, color: color.focus},
});
