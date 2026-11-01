import React, {createContext, useContext, useMemo} from 'react';

// Qual rail tem o foco do controle e qual card está selecionado em cada um.
//
// O Vega Carousel cuida da navegação, da rolagem e da reciclagem, mas não
// diz ao card que ele está em foco: o app sabe disso pelo
// `onSelectionChanged` do Carousel e pelas teclas ↑/↓ (useRegionFocus). Os
// cards leem este contexto para desenhar a camada de foco.
export type RailId = 'hours' | 'days';

type RailFocusValue = {
  activeRail: RailId | null;
  selected: Record<RailId, number>;
};

const RailFocusContext = createContext<RailFocusValue>({
  activeRail: null,
  selected: {hours: 0, days: 0},
});

type ProviderProps = RailFocusValue & {children: React.ReactNode};

export function RailFocusProvider({
  activeRail,
  selected,
  children,
}: ProviderProps) {
  const value = useMemo(() => ({activeRail, selected}), [activeRail, selected]);
  return (
    <RailFocusContext.Provider value={value}>
      {children}
    </RailFocusContext.Provider>
  );
}

// Um card está em foco quando o rail dele tem o foco e ele é o selecionado.
export function useCardFocused(rail: RailId, index: number): boolean {
  const {activeRail, selected} = useContext(RailFocusContext);
  return activeRail === rail && selected[rail] === index;
}
