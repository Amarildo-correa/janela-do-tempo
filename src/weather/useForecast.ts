import {useCallback, useEffect, useRef, useState} from 'react';
import {fetchForecast, Forecast} from './forecast';

export type ForecastState =
  | {status: 'loading'}
  | {status: 'error'}
  | {status: 'ready'; forecast: Forecast};

// A previsão é buscada uma vez ao abrir e mantida em memória; `retry` busca
// de novo depois de um erro.
export function useForecast() {
  const [state, setState] = useState<ForecastState>({status: 'loading'});
  const controller = useRef<AbortController | null>(null);

  const load = useCallback(() => {
    controller.current?.abort();
    const current = new AbortController();
    controller.current = current;
    setState({status: 'loading'});
    fetchForecast(current.signal)
      .then((forecast) => {
        if (!current.signal.aborted) {
          setState({status: 'ready', forecast});
        }
      })
      .catch(() => {
        if (!current.signal.aborted) {
          setState({status: 'error'});
        }
      });
  }, []);

  useEffect(() => {
    load();
    return () => controller.current?.abort();
  }, [load]);

  return {state, retry: load};
}
