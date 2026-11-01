import React, {useCallback, useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  Carousel,
  CarouselRenderInfo,
  CarouselSelectionChangeEvent,
} from '@amazon-devices/vega-carousel';
import {RailId} from '../focus';
import {color, focus, px, radius, space, type} from '../theme';

type Props<T extends {key: string}> = {
  id: RailId;
  title: string;
  items: T[];
  itemHeight: number;
  renderCard: (item: T, index: number) => React.ReactElement;
  hasPreferredFocus?: boolean;
  onSelect: (rail: RailId, index: number) => void;
  onFocusChange: (rail: RailId, focused: boolean) => void;
};

// Espaço acima e abaixo do card para a escala de foco e a borda outset.
const FOCUS_ROOM = px(16);

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
  onFocusChange,
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
  const onFocus = useCallback(
    () => onFocusChange(id, true),
    [id, onFocusChange],
  );
  const onBlur = useCallback(
    () => onFocusChange(id, false),
    [id, onFocusChange],
  );

  const containerStyle = useMemo(
    () => [styles.carousel, {height: itemHeight + FOCUS_ROOM * 2}],
    [itemHeight],
  );

  return (
    <View>
      <Text style={styles.title}>{title}</Text>
      {/* Os eventos de foco do Carousel sobem até este View: é assim que o
          app sabe qual rail está com o foco. */}
      <View onFocus={onFocus} onBlur={onBlur}>
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
    // 14 px até o card; o Carousel já reserva FOCUS_ROOM acima dele.
    marginBottom: space.s14 - FOCUS_ROOM,
  },
  carousel: {width: '100%'},
});
