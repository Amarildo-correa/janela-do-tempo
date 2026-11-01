import 'react-native';
import {act, fireEvent, render, screen} from '@testing-library/react-native';
import * as React from 'react';

import fixture from './fixtures/open-meteo.json';
import {App} from '../src/App';

// Os hooks de splash e TTFD só funcionam no aparelho.
jest.mock('../src/launch', () => ({useLaunchMetrics: jest.fn()}));

const fetchMock = jest.fn();

beforeEach(() => {
  jest.useFakeTimers();
  fetchMock.mockReset();
  global.fetch = fetchMock as unknown as typeof fetch;
});
afterEach(() => jest.useRealTimers());

function respond(ok: boolean) {
  fetchMock.mockResolvedValueOnce({
    ok,
    status: ok ? 200 : 500,
    json: async () => fixture,
  });
}

async function renderApp() {
  render(<App />);
  // Deixa a promessa do fetch resolver.
  await act(async () => {});
}

// Aperta uma tecla do controle (eventos de tecla do mock do kepler).
function pressKey(eventType: string, eventKeyAction = 0) {
  const kepler = require('@amazon-devices/react-native-kepler');
  act(() => kepler.__emitTVEvent({eventType, eventKeyAction}));
}

function finish() {
  act(() => jest.runOnlyPendingTimers());
  screen.unmount();
}

describe('App', () => {
  it('mostra o tempo de agora, os detalhes e os dois rails', async () => {
    respond(true);
    await renderApp();

    expect(screen.getByLabelText('Janela do Tempo')).toBeTruthy();
    expect(
      screen.getByLabelText('Agora em Novo Hamburgo, 27°, Sol entre nuvens'),
    ).toBeTruthy();
    expect(screen.getByText('Sol entre nuvens')).toBeTruthy();
    expect(screen.getByText('Baixa chance de chuva')).toBeTruthy();
    expect(
      screen.getByLabelText(/^Mínima 14°, máxima 28°, chuva 5%/),
    ).toBeTruthy();
    expect(screen.getByText('Próximas horas')).toBeTruthy();
    expect(screen.getByText('Próximos dias')).toBeTruthy();
    expect(
      screen.getByLabelText('Agora, Sol entre nuvens, 27 graus'),
    ).toBeTruthy();
    expect(
      screen.getByLabelText(
        'Segunda, 2 de novembro, Garoa, mínima 18, máxima 31 graus',
      ),
    ).toBeTruthy();

    // Foco inicial em "Hoje": ícone sólido no card em foco.
    expect(screen.getAllByTestId('icon-cloudy').length).toBe(1);
    finish();
  });

  it('o card selecionado no Carousel passa a ser o assunto do hero', async () => {
    respond(true);
    await renderApp();

    const days = screen.getByTestId('rail-days');
    act(() =>
      days.props.onSelectionChanged({
        selectedIndex: 1,
        renderedRange: {start: 0, end: 9},
      }),
    );
    expect(screen.getByText('Segunda, 2 nov')).toBeTruthy();
    expect(screen.getByText('Máxima prevista')).toBeTruthy();

    // Subir para o rail de horas mostra o card em que ele estava ("Agora")
    // e passa o destaque amarelo para lá.
    pressKey('up');
    expect(
      screen.getByLabelText('Agora em Novo Hamburgo, 27°, Sol entre nuvens'),
    ).toBeTruthy();
    expect(screen.getAllByTestId('icon-partly-sunny').length).toBe(1);
    expect(screen.queryByTestId('icon-cloudy')).toBeNull();

    const hours = screen.getByTestId('rail-hours');
    act(() =>
      hours.props.onSelectionChanged({
        selectedIndex: 1,
        renderedRange: {start: 0, end: 9},
      }),
    );
    expect(screen.getByText('Hoje às 16:00')).toBeTruthy();
    expect(screen.getByText('Previsão para 16:00')).toBeTruthy();

    // Em Buscar cidade nenhum card fica amarelo e o hero não muda.
    pressKey('up');
    expect(screen.queryByTestId('icon-partly-sunny')).toBeNull();
    expect(screen.getByText('Hoje às 16:00')).toBeTruthy();
    finish();
  });

  it('Buscar cidade abre a tela "Em desenvolvimento"', async () => {
    respond(true);
    await renderApp();

    fireEvent.press(screen.getByLabelText('Buscar cidade'));
    act(() => jest.runOnlyPendingTimers());
    expect(screen.getByText('Em desenvolvimento')).toBeTruthy();
    finish();
  });

  it('avisa do erro e tenta de novo com OK', async () => {
    respond(false);
    await renderApp();

    expect(
      screen.getByText(
        'Não foi possível carregar a previsão. Aperte OK para tentar de novo.',
      ),
    ).toBeTruthy();

    respond(true);
    fireEvent.press(screen.getByLabelText('Tentar de novo'));
    await act(async () => {});
    expect(screen.getByText('Sol entre nuvens')).toBeTruthy();
    finish();
  });
});
