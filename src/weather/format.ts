// Datas e horas na voz do app: "Agora", "13:00", "Hoje", "Seg", "2 nov".
// A Open-Meteo devolve horários locais (America/Sao_Paulo) como texto,
// então tudo sai do texto, sem depender do fuso configurado no aparelho.

const WEEKDAY_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const WEEKDAY_LONG = [
  'Domingo',
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
];
const MONTH_SHORT = [
  'jan',
  'fev',
  'mar',
  'abr',
  'mai',
  'jun',
  'jul',
  'ago',
  'set',
  'out',
  'nov',
  'dez',
];
const MONTH_LONG = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

type DateParts = {year: number; month: number; day: number};

// "2026-11-02" ou "2026-11-02T14:00" → partes da data.
function parts(iso: string): DateParts {
  const [year, month, day] = iso.slice(0, 10).split('-').map(Number);
  return {year, month, day};
}

function weekday({year, month, day}: DateParts): number {
  // Meio-dia em UTC: o dia da semana não muda com o fuso.
  return new Date(Date.UTC(year, month - 1, day, 12)).getUTCDay();
}

// "2026-11-01T14:00" → "14:00".
export function hourLabel(iso: string): string {
  return iso.slice(11, 16);
}

export function dayShort(iso: string, isToday: boolean): string {
  return isToday ? 'Hoje' : WEEKDAY_SHORT[weekday(parts(iso))];
}

export function dayLong(iso: string): string {
  return WEEKDAY_LONG[weekday(parts(iso))];
}

// "2 nov".
export function dateShort(iso: string): string {
  const {month, day} = parts(iso);
  return `${day} ${MONTH_SHORT[month - 1]}`;
}

// "2 de novembro", para os rótulos de acessibilidade.
export function dateLong(iso: string): string {
  const {month, day} = parts(iso);
  return `${day} de ${MONTH_LONG[month - 1]}`;
}

// 27.6 → "28°"; dado ausente vira travessão.
export function degrees(value: number | null): string {
  return value == null ? '—' : `${Math.round(value)}°`;
}

export function percent(value: number | null): string {
  return value == null ? '—' : `${Math.round(value)}%`;
}
