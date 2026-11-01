// Códigos de tempo da OMM (WMO) usados pela Open-Meteo, em palavras comuns e
// com o ícone de cada condição. Os ícones são do Ionicons empacotado pela
// Amazon (@amazon-devices/react-native-vector-icons): contorno em repouso,
// sólido em foco.
export type IconKind =
  | 'sun'
  | 'moon'
  | 'cloud-sun'
  | 'cloud-moon'
  | 'cloud'
  | 'rain'
  | 'storm'
  | 'snow';

export type Condition = {label: string; icon: IconKind};

export function describe(code: number, isDay: boolean): Condition {
  if (code === 0) {
    return isDay
      ? {label: 'Ensolarado', icon: 'sun'}
      : {label: 'Céu limpo', icon: 'moon'};
  }
  if (code === 1 || code === 2) {
    return isDay
      ? {label: 'Sol entre nuvens', icon: 'cloud-sun'}
      : {label: 'Poucas nuvens', icon: 'cloud-moon'};
  }
  if (code === 3) {
    return {label: 'Nublado', icon: 'cloud'};
  }
  if (code === 45 || code === 48) {
    return {label: 'Neblina', icon: 'cloud'};
  }
  if (code >= 51 && code <= 57) {
    return {label: 'Garoa', icon: 'rain'};
  }
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) {
    return {label: 'Chuva', icon: 'rain'};
  }
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
    return {label: 'Neve', icon: 'snow'};
  }
  if (code >= 95) {
    return {label: 'Tempestade', icon: 'storm'};
  }
  return {label: 'Nublado', icon: 'cloud'};
}

// Linha de apoio do hero quando o assunto é a chuva.
export function rainPhrase(probability: number | null): string {
  if (probability == null) {
    return 'Sem previsão de chuva';
  }
  if (probability < 20) {
    return 'Baixa chance de chuva';
  }
  if (probability < 50) {
    return 'Pode chover';
  }
  if (probability < 80) {
    return 'Chance alta de chuva';
  }
  return 'Chuva quase certa';
}
