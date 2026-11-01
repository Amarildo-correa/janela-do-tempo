import fixture from './fixtures/open-meteo.json';
import {describe as describeCode} from '../src/weather/conditions';
import {dayA11y, hourA11y, parseForecast} from '../src/weather/forecast';
import {heroFor} from '../src/weather/selection';

// Resposta real da Open-Meteo para Novo Hamburgo em 2026-11-01 às 15:30.
const forecast = parseForecast(fixture);

describe('parseForecast', () => {
  it('começa as horas em "Agora" com os valores atuais', () => {
    expect(forecast.hours).toHaveLength(24);
    const [now, next] = forecast.hours;
    expect(now.label).toBe('Agora');
    expect(now.temp).toBe(27.3);
    expect(now.condition.label).toBe('Sol entre nuvens');
    expect(next.label).toBe('16:00');
    expect(next.temp).toBe(26.6);
  });

  it('nomeia os dias como Hoje, Seg, Ter…', () => {
    expect(forecast.days).toHaveLength(10);
    expect(forecast.days.slice(0, 3).map((day) => day.label)).toEqual([
      'Hoje',
      'Seg',
      'Ter',
    ]);
    expect(forecast.days[1].dateLabel).toBe('2 nov');
  });

  it('escreve os rótulos de acessibilidade completos', () => {
    expect(hourA11y(forecast.hours[0])).toBe(
      'Agora, Sol entre nuvens, 27 graus',
    );
    expect(dayA11y(forecast.days[1])).toBe(
      'Segunda, 2 de novembro, Garoa, mínima 18, máxima 31 graus',
    );
  });
});

describe('heroFor', () => {
  it('"Hoje" conta o tempo de agora com a mínima e a máxima do dia', () => {
    const hero = heroFor(forecast, {kind: 'day', index: 0});
    expect(hero.when).toBe('Agora');
    expect(hero.where).toBe('em Novo Hamburgo');
    expect(hero.support).toBe('Baixa chance de chuva');
    expect([hero.min, hero.max, hero.humidity]).toEqual([13.6, 28.1, 57]);
  });

  it('uma hora mostra a previsão daquela hora', () => {
    const hero = heroFor(forecast, {kind: 'hour', index: 1});
    expect(hero.when).toBe('Hoje às 16:00');
    expect(hero.support).toBe('Previsão para 16:00');
    expect([hero.temp, hero.rain, hero.humidity]).toEqual([26.6, 7, 62]);
  });

  it('um dia mostra a máxima prevista', () => {
    const hero = heroFor(forecast, {kind: 'day', index: 1});
    expect(hero.when).toBe('Segunda, 2 nov');
    expect(hero.temp).toBe(30.7);
    expect(hero.support).toBe('Máxima prevista');
    expect(hero.rain).toBe(59);
  });
});

describe('condições', () => {
  it('troca o texto e o ícone à noite', () => {
    expect(describeCode(0, true)).toEqual({label: 'Ensolarado', icon: 'sun'});
    expect(describeCode(0, false)).toEqual({label: 'Céu limpo', icon: 'moon'});
    expect(describeCode(63, true).label).toBe('Chuva');
  });
});
