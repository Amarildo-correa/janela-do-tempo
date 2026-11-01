# Janela do Tempo

Previsão do tempo para Fire TV, feita para ler do sofá. O app mostra o tempo de agora em Novo Hamburgo (RS) e as próximas horas e dias; o card em foco no controle remoto é o que o topo da tela conta.

App nativo em **React Native for Vega** (Vega OS 2.0, RN 0.83), montado com os componentes prontos da Amazon:

- **Vega Carousel** (`@amazon-devices/vega-carousel`) nos rails de horas e de dias: navegação pelo direcional, rolagem, borda de foco e escala de toque no nativo;
- **react-native-kepler**: foco do controle (`FocusManager`, `useTVEventHandler`), tela de abertura;
- **Ionicons** de `@amazon-devices/react-native-vector-icons`, **gradiente** de `@amazon-devices/react-linear-gradient`;
- navegação com os forks da Amazon de React Navigation; sons nativos de navegação do Fire TV.

Dados da [Open-Meteo](https://open-meteo.com/) (sem chave). A busca de cidades ainda está em desenvolvimento.

## Desenvolvimento

```bash
npm install --legacy-peer-deps
npx tsc --noEmit && npm run lint && npx jest
```

O pacote `.vpkg` é compilado pelo GitHub Actions (`.github/workflows/vega-build.yml`) a cada push na `main`; baixe o artefato `janela-do-tempo-vpkg` (o Fire TV Stick usa o `armv7`).
