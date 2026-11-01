import {Condition, rainPhrase} from './conditions';
import {dateShort, dayLong, hourLabel} from './format';
import {Forecast} from './forecast';

// O card selecionado num dos rails. O hero e os detalhes contam o tempo
// desse momento ("foco é seleção").
export type Selection = {kind: 'hour' | 'day'; index: number};

// Foco inicial: o primeiro card de Próximos dias ("Hoje").
export const INITIAL_SELECTION: Selection = {kind: 'day', index: 0};

export type HeroModel = {
  when: string; // "Agora", "Hoje às 14:00", "Segunda, 2 nov"
  where: string; // "em Novo Hamburgo"
  temp: number | null;
  condition: Condition;
  support: string;
  min: number | null;
  max: number | null;
  rain: number | null;
  humidity: number | null;
};

export function heroFor(forecast: Forecast, selection: Selection): HeroModel {
  const where = `em ${forecast.city}`;
  const now = forecast.hours[0];

  // "Hoje" e "Agora" contam o tempo de agora, com a mínima e a máxima do dia.
  const showNow =
    (selection.kind === 'day' && selection.index === 0) ||
    (selection.kind === 'hour' && selection.index === 0);

  if (showNow && now) {
    const today = forecast.days[now.dayIndex];
    return {
      when: 'Agora',
      where,
      temp: now.temp,
      condition: now.condition,
      support: rainPhrase(now.rain),
      min: today?.min ?? null,
      max: today?.max ?? null,
      rain: now.rain,
      humidity: now.humidity,
    };
  }

  if (selection.kind === 'hour') {
    const hour = forecast.hours[selection.index] ?? now;
    const day = forecast.days[hour.dayIndex];
    const time = hourLabel(hour.time);
    const prefix =
      hour.dayIndex === 0
        ? 'Hoje'
        : hour.dayIndex === 1
        ? 'Amanhã'
        : dayLong(day.date);
    return {
      when: `${prefix} às ${time}`,
      where,
      temp: hour.temp,
      condition: hour.condition,
      support: `Previsão para ${time}`,
      min: day?.min ?? null,
      max: day?.max ?? null,
      rain: hour.rain,
      humidity: hour.humidity,
    };
  }

  const day = forecast.days[selection.index] ?? forecast.days[0];
  return {
    when: `${dayLong(day.date)}, ${dateShort(day.date)}`,
    where,
    temp: day.max,
    condition: day.condition,
    support: 'Máxima prevista',
    min: day.min,
    max: day.max,
    rain: day.rain,
    humidity: day.humidity,
  };
}
