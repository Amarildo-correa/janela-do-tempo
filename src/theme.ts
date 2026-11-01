import {Dimensions, TextStyle} from 'react-native';

// Fonte única dos tokens do design system "Janela do Tempo" (tokens.json e
// VEGA.md). Nenhum componente usa hex, px ou duração fora daqui.
//
// O layout é desenhado em pixels de uma tela 1920×1080 e escalado para a
// largura real da janela.
const BASE_WIDTH = 1920;

export function px(value: number): number {
  return (value * Dimensions.get('window').width) / BASE_WIDTH;
}

export const color = {
  bgTop: '#2C3B4A',
  bgMid: '#1B2835',
  bgBase: '#14202B',
  surfaceTile: 'rgba(255,255,255,0.06)',
  surfaceFocus: '#0A1628',
  ink: '#FFFFFF',
  inkSoft: '#E6EEF5',
  inkMuted: '#B9C6D3',
  inkFaint: 'rgba(255,255,255,0.4)',
  sky: '#8ECDF5',
  skyInk: '#0E1A24',
  focus: '#FFC933',
  warm: '#FF8A80',
} as const;

// Gradiente da tela: um único LinearGradient em tela cheia.
export const screenGradient = {
  colors: [color.bgTop, color.bgMid, color.bgBase, color.bgBase],
  locations: [0, 0.38, 0.56, 1],
};

// Roboto empacotada em assets/fonts/, um arquivo por peso, com o nome do
// arquivo igual à família.
export const font = {
  semibold: 'Roboto-SemiBold', // 600
  bold: 'Roboto-Bold', // 700
  extrabold: 'Roboto-ExtraBold', // 800
} as const;

const tabular: TextStyle['fontVariant'] = ['tabular-nums'];

function style(
  fontFamily: string,
  size: number,
  lineHeight: number,
  extra: TextStyle = {},
): TextStyle {
  return {
    fontFamily,
    fontSize: px(size),
    lineHeight: px(lineHeight),
    ...extra,
    ...(extra.letterSpacing != null
      ? {letterSpacing: px(extra.letterSpacing)}
      : null),
  };
}

export const type = {
  tempHero: style(font.bold, 176, 158, {
    letterSpacing: -8,
    fontVariant: tabular,
  }),
  whenWhere: style(font.extrabold, 48, 55, {letterSpacing: -0.5}),
  whereMuted: style(font.semibold, 48, 55, {letterSpacing: -0.5}),
  condition: style(font.bold, 48, 53),
  conditionSub: style(font.bold, 40, 48),
  detailValue: style(font.bold, 52, 57, {fontVariant: tabular}),
  detailLabel: style(font.bold, 40, 46),
  sectionTitle: style(font.bold, 32, 38),
  cardTemp: style(font.bold, 44, 48, {fontVariant: tabular}),
  cardMinMax: style(font.bold, 40, 44, {fontVariant: tabular}),
  dayLabel: style(font.bold, 36, 40),
  cardLabel: style(font.bold, 32, 35, {fontVariant: tabular}),
  cardDate: style(font.semibold, 32, 35),
  wordmark: style(font.extrabold, 44, 53, {letterSpacing: -0.5}),
  button: style(font.semibold, 32, 38),
  message: style(font.bold, 48, 55),
} as const;

export const space = {
  safeX: px(96),
  safeY: px(54),
  s8: px(8),
  s10: px(10),
  s12: px(12),
  s14: px(14),
  s16: px(16),
  s20: px(20),
  s28: px(28),
  s32: px(32),
  s36: px(36),
  s40: px(40),
  s48: px(48),
  s64: px(64),
} as const;

export const radius = {
  mark: px(10),
  panel: px(20),
  tile: px(24),
  pill: px(40),
} as const;

export const size = {
  headerH: px(80),
  heroH: px(356),
  detailsW: px(560),
  cardW: px(198.5),
  hourCardH: px(186),
  dayCardH: px(244),
  icon: {
    hero: px(128),
    day: px(52),
    hour: px(44),
    detail: px(40),
    button: px(36),
  },
} as const;

export const focus = {
  borderWidth: px(4), // outset
  scale: 1.06,
  // Escala do botão enquanto o OK está apertado (os cards não encolhem:
  // não abrem nenhuma tela).
  pressedScale: 0.94,
  duration: 160, // ms
  pressDuration: 120, // ms
  // Folga em volta de cada card do rail para a camada de foco crescer
  // (escala 1.06 + anel de 4 px por fora) sem cobrir os vizinhos.
  room: px(12),
  railScroll: 240, // ms
} as const;
