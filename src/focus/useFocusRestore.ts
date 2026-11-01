import {useCallback, useRef} from 'react';
import {findNodeHandle, View} from 'react-native';
import {FocusManager} from '@amazon-devices/react-native-kepler';
import {useFocusEffect} from '@amazon-devices/react-navigation__native';

// Devolve o foco a um elemento quando a tela volta a aparecer (ex.: ao voltar
// da busca para o botão Buscar cidade). No Vega `hasTVPreferredFocus` só vale
// na montagem, então as voltas seguintes pedem o foco ao FocusManager.
export function useFocusRestore<T extends View>() {
  const ref = useRef<T | null>(null);
  const shouldRestore = useRef(false);

  useFocusEffect(
    useCallback(() => {
      if (shouldRestore.current) {
        shouldRestore.current = false;
        const tag = findNodeHandle(ref.current);
        if (tag != null) {
          FocusManager.focus(tag);
        }
      }
    }, []),
  );

  // Chamado antes de sair da tela pelo elemento que deve recuperar o foco.
  const restoreOnReturn = useCallback(() => {
    shouldRestore.current = true;
  }, []);

  return {ref, restoreOnReturn};
}
