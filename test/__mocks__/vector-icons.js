// Os ícones do Ionicons são glifos de uma fonte; no Jest viram um Text com o
// nome do ícone, para os testes conferirem contorno/sólido.
const React = require('react');
const {Text} = require('react-native');

module.exports = {
  __esModule: true,
  default: ({name}) => React.createElement(Text, {testID: `icon-${name}`}),
};
