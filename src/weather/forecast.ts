import {Condition, describe} from './conditions';
import {dateLong, dateShort, dayLong, dayShort, hourLabel} from './format';

// Por enquanto o app mostra só Novo Hamburgo (RS).
export const CITY = {
  name: 'Novo Hamburgo',
  latitude: -29.6783,
  longitude: -51.1306,
  timezone: 'America/Sao_Paulo',
};

export const HOURS_COUNT = 24;
export const DAYS_COUNT = 10;

export type Hour = {
  key: string;
  time: string; // "2026-11-01T14:00", horário local
  label: string; // "Agora" ou "14:00"
  temp: number | null;
  rain: number | null;
  humidity: number | null;
  condition: Condition;
  dayIndex: number; // índice em Forecast.days
};

export type Day = {
  key: string;
  date: string; // "2026-11-02"
  label: string; // "Hoje" ou "Seg"
  dateLabel: string; // "2 nov"
  min: number | null;
  max: number | null;
  rain: number | null;
  humidity: number | null;
  condition: Condition;
};

export type Forecast = {
  city: string;
  hours: Hour[];
  days: Day[];
};

// Resposta da Open-Meteo, só com os campos pedidos em forecastUrl().
type OpenMeteoResponse = {
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    precipitation_probability: number | null;
    weather_code: number;
    is_day: number;
  };
  hourly: {
    time: string[];
    temperature_2m: (number | null)[];
    relative_humidity_2m: (number | null)[];
    precipitation_probability: (number | null)[];
    weather_code: (number | null)[];
    is_day: (number | null)[];
  };
  daily: {
    time: string[];
    weather_code: (number | null)[];
    temperature_2m_max: (number | null)[];
    temperature_2m_min: (number | null)[];
    precipitation_probability_max: (number | null)[];
    relative_humidity_2m_mean: (number | null)[];
  };
};

export function forecastUrl(): string {
  const query = [
    `latitude=${CITY.latitude}`,
    `longitude=${CITY.longitude}`,
    'current=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,is_day',
    'hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,is_day',
    'daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,relative_humidity_2m_mean',
    `timezone=${encodeURIComponent(CITY.timezone)}`,
    `forecast_days=${DAYS_COUNT}`,
  ].join('&');
  return `https://api.open-meteo.com/v1/forecast?${query}`;
}

// Converte a resposta da Open-Meteo no modelo da tela: o primeiro card de
// hora é "Agora" (valores atuais) e os seguintes são as próximas horas.
export function parseForecast(data: OpenMeteoResponse): Forecast {
  const {current, hourly, daily} = data;
  const today = current.time.slice(0, 10);
  const dayIndexOf = (time: string) =>
    Math.max(0, daily.time.indexOf(time.slice(0, 10)));

  const currentHour = current.time.slice(0, 13); // "2026-11-01T15"
  const first = Math.max(
    0,
    hourly.time.findIndex((time) => time.startsWith(currentHour)),
  );

  const hours: Hour[] = hourly.time
    .slice(first, first + HOURS_COUNT)
    .map((time, offset) => {
      const i = first + offset;
      if (offset === 0) {
        return {
          key: time,
          time: current.time,
          label: 'Agora',
          temp: current.temperature_2m,
          rain:
            current.precipitation_probability ??
            hourly.precipitation_probability[i],
          humidity: current.relative_humidity_2m,
          condition: describe(current.weather_code, current.is_day === 1),
          dayIndex: dayIndexOf(time),
        };
      }
      return {
        key: time,
        time,
        label: hourLabel(time),
        temp: hourly.temperature_2m[i],
        rain: hourly.precipitation_probability[i],
        humidity: hourly.relative_humidity_2m[i],
        condition: describe(
          hourly.weather_code[i] ?? 3,
          hourly.is_day[i] === 1,
        ),
        dayIndex: dayIndexOf(time),
      };
    });

  const days: Day[] = daily.time.map((date, i) => ({
    key: date,
    date,
    label: dayShort(date, date === today),
    dateLabel: dateShort(date),
    min: daily.temperature_2m_min[i],
    max: daily.temperature_2m_max[i],
    rain: daily.precipitation_probability_max[i],
    humidity: daily.relative_humidity_2m_mean[i],
    condition: describe(daily.weather_code[i] ?? 3, true),
  }));

  return {city: CITY.name, hours, days};
}

export async function fetchForecast(
  signal?: AbortController['signal'],
): Promise<Forecast> {
  const response = await fetch(forecastUrl(), {signal});
  if (!response.ok) {
    throw new Error(`Open-Meteo respondeu ${response.status}`);
  }
  return parseForecast((await response.json()) as OpenMeteoResponse);
}

// Rótulos completos para o leitor de tela (VoiceView).
export function hourA11y(hour: Hour): string {
  const temp =
    hour.temp == null ? 'sem dado' : `${Math.round(hour.temp)} graus`;
  return `${hour.label}, ${hour.condition.label}, ${temp}`;
}

export function dayA11y(day: Day): string {
  const name = day.label === 'Hoje' ? 'Hoje' : dayLong(day.date);
  const min = day.min == null ? 'sem dado' : Math.round(day.min);
  const max = day.max == null ? 'sem dado' : Math.round(day.max);
  return `${name}, ${dateLong(day.date)}, ${
    day.condition.label
  }, mínima ${min}, máxima ${max} graus`;
}
