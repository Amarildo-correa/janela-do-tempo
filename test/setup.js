// Os testes rodam sobre o react-native padrão (ver jest.config.json). O app é
// desenhado em 1920×1080 e escalado pela largura da tela: fixa a tela da TV.
jest.mock('react-native/Libraries/Utilities/Dimensions', () => {
  const size = { width: 1920, height: 1080, scale: 1, fontScale: 1 };
  return {
    __esModule: true,
    default: {
      get: () => size,
      set: jest.fn(),
      addEventListener: jest.fn(() => ({ remove: jest.fn() })),
    },
  };
});

jest.mock('react-native-safe-area-context', () =>
  require('react-native-safe-area-context/jest/mock').default,
);
