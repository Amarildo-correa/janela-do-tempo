import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {useIsFocused} from '@amazon-devices/react-navigation__native';
import {StackScreenProps} from '@amazon-devices/react-navigation__stack';
import {DayCard} from '../components/DayCard';
import {DetailList} from '../components/DetailList';
import {HeroNow} from '../components/HeroNow';
import {HourCard} from '../components/HourCard';
import {PillButton} from '../components/PillButton';
import {Rail} from '../components/Rail';
import {ScreenBackground} from '../components/ScreenBackground';
import {Wordmark} from '../components/Wordmark';
import {
  RailFocusProvider,
  RailId,
  useFocusRestore,
  useRegionFocus,
} from '../focus';
import {useLaunchMetrics} from '../launch';
import type {RootStackParamList} from '../navigation';
import {color, px, size, space, type} from '../theme';
import {Day, Forecast, Hour} from '../weather/forecast';
import {heroFor, INITIAL_SELECTION, Selection} from '../weather/selection';
import {useForecast} from '../weather/useForecast';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

const KIND: Record<RailId, Selection['kind']> = {hours: 'hour', days: 'day'};

export function HomeScreen({navigation}: Props) {
  const {state, retry} = useForecast();
  const search = useFocusRestore<View>();

  // A tela de abertura fica até a previsão chegar (ou falhar).
  useLaunchMetrics(state.status !== 'loading');

  const openSearch = useCallback(() => {
    search.restoreOnReturn();
    navigation.navigate('Search');
  }, [navigation, search]);

  return (
    <ScreenBackground>
      {state.status === 'ready' ? (
        <Weather
          forecast={state.forecast}
          searchRef={search.ref}
          onOpenSearch={openSearch}
        />
      ) : (
        <View style={styles.page}>
          <View style={styles.header}>
            <Wordmark />
          </View>
          <View style={styles.message}>
            {state.status === 'loading' ? (
              <>
                <ActivityIndicator size="large" color={color.sky} />
                <Text style={styles.messageText}>Buscando a previsão…</Text>
              </>
            ) : (
              <>
                <Text style={styles.messageText}>
                  Não foi possível carregar a previsão. Aperte OK para tentar de
                  novo.
                </Text>
                <PillButton
                  label="Tentar de novo"
                  hint="Busca a previsão de novo"
                  onPress={retry}
                  hasTVPreferredFocus
                />
              </>
            )}
          </View>
        </View>
      )}
    </ScreenBackground>
  );
}

type WeatherProps = {
  forecast: Forecast;
  searchRef: React.RefObject<View | null>;
  onOpenSearch: () => void;
};

// Tela com dados: hero e detalhes no topo, rails de horas e de dias embaixo.
function Weather({forecast, searchRef, onOpenSearch}: WeatherProps) {
  const [selection, setSelection] = useState<Selection>(INITIAL_SELECTION);
  const [selected, setSelected] = useState<Record<RailId, number>>({
    hours: 0,
    days: 0,
  });
  const selectedRef = useRef(selected);
  selectedRef.current = selected;

  // Faixa com o foco: começa em Próximos dias, como o foco inicial.
  const {region, setRegion} = useRegionFocus('days', useIsFocused());
  const activeRail: RailId | null = region === 'search' ? null : region;
  const onSearchFocused = useCallback(() => setRegion('search'), [setRegion]);

  // Foco é seleção: o card que ganha foco passa a ser o assunto do hero.
  const onSelect = useCallback((rail: RailId, index: number) => {
    setSelected((current) =>
      current[rail] === index ? current : {...current, [rail]: index},
    );
    setSelection({kind: KIND[rail], index});
  }, []);

  // Ao entrar num rail, o hero passa para o card em que ele estava. Ao subir
  // para Buscar cidade, o hero mantém a última seleção.
  useEffect(() => {
    if (activeRail) {
      setSelection({
        kind: KIND[activeRail],
        index: selectedRef.current[activeRail],
      });
    }
  }, [activeRail]);

  const renderHour = useCallback(
    (item: Hour, index: number) => <HourCard item={item} index={index} />,
    [],
  );
  const renderDay = useCallback(
    (item: Day, index: number) => <DayCard item={item} index={index} />,
    [],
  );

  const hero = useMemo(
    () => heroFor(forecast, selection),
    [forecast, selection],
  );

  return (
    <RailFocusProvider activeRail={activeRail} selected={selected}>
      <View style={styles.page}>
        <View style={styles.top}>
          <View style={styles.topLeft}>
            <View style={styles.header}>
              <Wordmark />
              <PillButton
                ref={searchRef}
                label="Buscar cidade"
                icon="search"
                hint="Abre a busca de cidades"
                onPress={onOpenSearch}
                onFocused={onSearchFocused}
              />
            </View>
            <HeroNow hero={hero} />
          </View>
          <View style={styles.topRight}>
            <DetailList hero={hero} />
          </View>
        </View>
      </View>
      <View style={styles.rails}>
        <Rail
          id="hours"
          title="Próximas horas"
          items={forecast.hours}
          itemHeight={size.hourCardH}
          renderCard={renderHour}
          onSelect={onSelect}
        />
        <View style={styles.railGap} />
        <Rail
          id="days"
          title="Próximos dias"
          items={forecast.days}
          itemHeight={size.dayCardH}
          renderCard={renderDay}
          hasPreferredFocus
          onSelect={onSelect}
        />
      </View>
    </RailFocusProvider>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingTop: space.safeY,
    paddingHorizontal: space.safeX,
  },
  header: {
    height: size.headerH,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.s40,
  },
  top: {
    height: size.heroH,
    flexDirection: 'row',
    gap: space.s64,
  },
  topLeft: {flex: 1, justifyContent: 'space-between'},
  topRight: {justifyContent: 'flex-end'},
  // Os rails vão até a borda direita da tela; o Carousel aplica a margem
  // segura à esquerda.
  rails: {marginTop: space.s36},
  railGap: {height: space.s36},
  message: {
    marginTop: px(160),
    alignItems: 'flex-start',
    gap: space.s36,
    maxWidth: px(1200),
  },
  messageText: {...type.message, color: color.ink},
});
