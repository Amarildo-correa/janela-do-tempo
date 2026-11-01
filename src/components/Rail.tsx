import React, {useCallback, useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  Carousel,
  CarouselRenderInfo,
  CarouselSelectionChangeEvent,
} from '@amazon-devices/vega-carousel';
import {RailId} from '../focus';
import {color, focus, space, type} from '../theme';

type Props<T extends {key: string}> = {
  id: RailId;
  title: string;
  items: T[];
  itemHeight: number;
  renderCard: (item: T, index: number) => React.ReactElement;
  hasPreferredFocus?: boolean;
  onSelect: (rail: RailId, index: number) => void;
};

// Um rail de cards com o Vega Carousel (@amazon-devices/vega-carousel): ele
// faz no nativo a navegação por D-pad, a rolagem sob foco fixo e a
// reciclagem.
export function Rail<T extends {key: string}>({
  id,
  title,
  items,
  itemHeight,
  renderCard,
  hasPreferredFocus = false,
  onSelect,
}: Props<T>) {
  const dataAdapter = useMemo(
    () => ({
      getItem: (index: number) => items[index],
      getItemCount: () => items.length,
      getItemKey: (info: CarouselRenderInfo<T>) => info.item.key,
      notifyDataError: () => false,
    }),
    [items],
  );

  const renderItem = useCallback(
    ({item, index}: CarouselRenderInfo<T>) => renderCard(item, index),
    [renderCard],
  );

  const onSelectionChanged = useCallback(
    (event: CarouselSelectionChangeEvent) => onSelect(id, event.selectedIndex),
    [id, onSelect],
  );

  const containerStyle = useMemo(
    // O item do Carousel estica até a altura do contêiner: card + folga.
    () => [styles.carousel, {height: itemHeight + focus.room * 2}],
    [itemHeight],
  );

  return (
    <View>
      <Text style={styles.title}>{title}</Text>
      <Carousel
        uniqueId={`rail-${id}`}
        testID={`rail-${id}`}
        dataAdapter={dataAdapter}
        renderItem={renderItem}
        orientation="horizontal"
        selectionStrategy="pinned"
        pinnedSelectedItemOffset="start"
        hasPreferredFocus={hasPreferredFocus}
        renderedItemsCount={11}
        numOffsetItems={2}
        navigableScrollAreaMargin={space.safeX - focus.room}
        containerStyle={containerStyle}
        itemStyle={itemStyle}
        animationDuration={animationDuration}
        onSelectionChanged={onSelectionChanged}
      />
    </View>
  );
}

// O card desenha a própria camada de foco e o toque (FocusCard), a partir
// do centro; o Carousel não escala nem desenha borda. O vão visível entre os
// cards é de 32 px: o item tem focus.room de folga de cada lado.
const itemStyle = {
  itemPadding: space.s32 - focus.room * 2,
  selectedItemScaleFactor: 1,
  pressedItemScaleFactor: 1,
};

const animationDuration = {
  itemScrollDuration: focus.railScroll / 1000,
  itemPressedDuration: 0.12,
};

const styles = StyleSheet.create({
  title: {
    ...type.sectionTitle,
    color: color.ink,
    paddingHorizontal: space.safeX,
    // 14 px até o card; a folga do item já fica entre os dois.
    marginBottom: space.s14 - focus.room,
  },
  carousel: {width: '100%'},
});
