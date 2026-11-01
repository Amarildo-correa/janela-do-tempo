import {useEffect, useRef} from 'react';
import {Animated, Easing} from 'react-native';
import {focus} from '../theme';

// Animação de foco e de toque do design system: a camada de foco aparece
// (opacidade) e cresce para 1.06; ao apertar OK o elemento encolhe para
// 0.94. Só transform e opacity, no driver nativo. O transform do React
// Native escala a partir do centro do componente.
export function useFocusAnimation(focused: boolean, pressed: boolean) {
  const layer = useRef(new Animated.Value(focused ? 1 : 0)).current;
  const press = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(layer, {
      toValue: focused ? 1 : 0,
      duration: focus.duration,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [focused, layer]);

  useEffect(() => {
    Animated.timing(press, {
      toValue: pressed ? focus.pressedScale : 1,
      duration: focus.pressDuration,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [pressed, press]);

  return {
    // Camada atrás do conteúdo: fundo de foco + anel amarelo.
    layerStyle: {
      opacity: layer,
      transform: [
        {
          scale: layer.interpolate({
            inputRange: [0, 1],
            outputRange: [1, focus.scale],
          }),
        },
      ],
    },
    // O elemento inteiro (camada e conteúdo) ao apertar OK.
    pressStyle: {transform: [{scale: press}]},
  };
}
