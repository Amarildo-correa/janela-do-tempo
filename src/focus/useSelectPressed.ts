import {useCallback, useState} from 'react';
import {useTVEventHandler} from '@amazon-devices/react-native-kepler';
import type {HWEvent} from '@amazon-devices/react-native-kepler';

// Se a tecla OK está apertada agora. O Vega Carousel não repassa o toque ao
// card, então o card em foco lê o OK dos eventos de tecla do Vega:
// eventKeyAction 0 ao apertar (e nas repetições), 1 ao soltar.
export function useSelectPressed(enabled: boolean) {
  const [pressed, setPressed] = useState(false);

  const onKey = useCallback(
    (event: HWEvent) => {
      if (event.eventType !== 'select') {
        // Qualquer outra tecla tira o foco do lugar: solta o toque.
        setPressed(false);
        return;
      }
      if (enabled && event.eventKeyAction === 0) {
        setPressed(true);
      } else if (event.eventKeyAction === 1) {
        setPressed(false);
      }
    },
    [enabled],
  );
  useTVEventHandler(onKey);

  return pressed;
}
