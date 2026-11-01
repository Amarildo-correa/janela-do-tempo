import React, {useCallback, useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  Carousel,
  CarouselRenderInfo,
  CarouselSelectionChangeEvent,
} from '@amazon-devices/vega-carousel';
import {RailId} from '../focus';
import {color, focus, radius, space, type} from '../theme';

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
// faz no nativo a navegação por D-pad, a rolagem sob foco fixo, a
// reciclagem, a borda amarela, a escala de foco e a de toque.
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
    // Da altura do card: o item do Carousel estica até a altura do
    // contêiner, e a borda de foco seguiria junto.
    () => [styles.carousel, {height: itemHeight}],
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
        navigableScrollAreaMargin={space.safeX}
        containerStyle={containerStyle}
        itemStyle={itemStyle}
        animationDuration={animationDuration}
        selectionBorder={selectionBorder}
        onSelectionChanged={onSelectionChanged}
      />
    </View>
  );
}

const itemStyle = {
  itemPadding: space.s20,
  selectedItemScaleFactor: focus.scale,
  pressedItemScaleFactor: focus.pressedScale,
};

const animationDuration = {
  itemScrollDuration: focus.railScroll / 1000,
  itemPressedDuration: 0.12,
  containerSelectionChangeDuration: focus.duration / 1000,
};

const selectionBorder = {
  borderStrategy: 'outset' as const,
  borderWidth: focus.borderWidth,
  borderColor: color.focus,
  borderRadius: radius.tile + focus.borderWidth,
  borderStrokeWidth: 0,
};

const styles = StyleSheet.create({
  title: {
    ...type.sectionTitle,
    color: color.ink,
    paddingHorizontal: space.safeX,
    marginBottom: space.s14,
  },
  carousel: {width: '100%'},
});
