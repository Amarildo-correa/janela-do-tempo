import {useEffect, useRef} from 'react';
import {AppState} from 'react-native';
import {
  useHideSplashScreenCallback,
  usePreventHideSplashScreen,
} from '@amazon-devices/react-native-kepler';
import {useReportFullyDrawn} from '@amazon-devices/kepler-performance-api';

// Tela de abertura e medição de "fully drawn" (TTFD), exigidas pelo Vega.
// Fica num módulo próprio para os testes poderem substituí-lo: esses hooks
// só funcionam no aparelho.
//
// `ready` diz quando a Home tem o primeiro quadro com dados (ou o erro).
export function useLaunchMetrics(ready: boolean) {
  usePreventHideSplashScreen();
  const hideSplashScreen = useHideSplashScreenCallback();
  const reportFullyDrawnCallback = useReportFullyDrawn();
  const appStateRef = useRef(AppState.currentState ?? 'active');
  const reported = useRef(false);

  // Partida a frio: a tela de abertura sai antes do relatório.
  useEffect(() => {
    if (ready && !reported.current) {
      reported.current = true;
      hideSplashScreen();
      reportFullyDrawnCallback();
    }
  }, [ready, hideSplashScreen, reportFullyDrawnCallback]);

  // Partida a quente: o app volta do segundo plano já desenhado.
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (
        (appStateRef.current === 'inactive' ||
          appStateRef.current === 'background') &&
        nextState === 'active'
      ) {
        reportFullyDrawnCallback();
      }
      appStateRef.current = nextState;
    });
    return () => subscription.remove();
  }, [reportFullyDrawnCallback]);
}
