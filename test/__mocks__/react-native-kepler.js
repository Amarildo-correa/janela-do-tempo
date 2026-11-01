// No SDK 2.0 o @amazon-devices/react-native-kepler do npm só traz tipos: o
// código vem do sistema do aparelho. No Jest o app roda sobre o react-native
// padrão e este mock cobre as APIs do Vega que o app usa.
const React = require('react');
const { View } = require('react-native');

const store = new Map();

module.exports = {
  TVFocusGuideView: React.forwardRef((props, ref) =>
    React.createElement(View, { ...props, ref }),
  ),
  useTVEventHandler: jest.fn(),
  FocusManager: { focus: jest.fn() },
  // O AsyncStorage do Vega grava num banco nativo; aqui fica em memória.
  AsyncStorage: {
    getItem: jest.fn(async key => (store.has(key) ? store.get(key) : null)),
    setItem: jest.fn(async (key, value) => {
      store.set(key, value);
    }),
  },
  useHideSplashScreenCallback: () => () => {},
  usePreventHideSplashScreen: jest.fn(),
};
