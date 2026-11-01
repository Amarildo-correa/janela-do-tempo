import React, {createContext, useContext, useMemo} from 'react';

// Qual rail tem o foco do controle, qual card está selecionado em cada um e
// se o OK está apertado.
//
// O Vega Carousel cuida da navegação, da rolagem e da reciclagem, mas não
// diz ao card que ele está em foco: o app sabe disso pelo
// `onSelectionChanged` do Carousel e pelas teclas ↑/↓ (useRegionFocus). Os
// cards leem este contexto para desenhar a camada de foco e o toque.
export type RailId = 'hours' | 'days';

type RailFocusValue = {
  activeRail: RailId | null;
  selected: Record<RailId, number>;
  pressed: boolean;
};

const RailFocusContext = createContext<RailFocusValue>({
  activeRail: null,
  selected: {hours: 0, days: 0},
  pressed: false,
});

type ProviderProps = RailFocusValue & {children: React.ReactNode};

export function RailFocusProvider({
  activeRail,
  selected,
  pressed,
  children,
}: ProviderProps) {
  const value = useMemo(
    () => ({activeRail, selected, pressed}),
    [activeRail, selected, pressed],
  );
  return (
    <RailFocusContext.Provider value={value}>
      {children}
    </RailFocusContext.Provider>
  );
}

// Um card está em foco quando o rail dele tem o foco e ele é o selecionado;
// só o card em foco reage ao OK.
export function useCardState(rail: RailId, index: number) {
  const {activeRail, selected, pressed} = useContext(RailFocusContext);
  const focused = activeRail === rail && selected[rail] === index;
  return {focused, pressed: focused && pressed};
}
