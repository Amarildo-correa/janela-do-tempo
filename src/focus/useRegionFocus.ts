import {useCallback, useState} from 'react';
import {useTVEventHandler} from '@amazon-devices/react-native-kepler';
import type {HWEvent} from '@amazon-devices/react-native-kepler';

// As três faixas focáveis da Home, de cima para baixo.
export type Region = 'search' | 'hours' | 'days';

const ORDER: Region[] = ['search', 'hours', 'days'];

// O Vega Carousel move o foco no nativo e não emite onFocus/onBlur para o
// JS (o evento não sobe até um View em volta dele; conferido no Fire TV
// Stick). Como a Home tem só três faixas empilhadas, ↑ e ↓ dizem para qual
// faixa o foco foi: a navegação nativa sempre leva à faixa vizinha.
export function nextRegion(current: Region, eventType: string): Region {
  const index = ORDER.indexOf(current);
  if (eventType === 'up') {
    return ORDER[Math.max(0, index - 1)];
  }
  if (eventType === 'down') {
    return ORDER[Math.min(ORDER.length - 1, index + 1)];
  }
  return current;
}

// Acompanha a faixa com o foco. `enabled` desliga o acompanhamento quando
// outra tela está na frente; `setRegion` deixa um elemento que recebe
// onFocus (o botão Buscar cidade) confirmar a faixa.
export function useRegionFocus(initial: Region, enabled: boolean) {
  const [region, setRegion] = useState<Region>(initial);

  const onKey = useCallback(
    (event: HWEvent) => {
      // eventKeyAction 0: tecla apertada (e repetições ao segurar).
      if (enabled && event.eventKeyAction === 0) {
        setRegion((current) => nextRegion(current, event.eventType));
      }
    },
    [enabled],
  );
  useTVEventHandler(onKey);

  return {region, setRegion};
}
