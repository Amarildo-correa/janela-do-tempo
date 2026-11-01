// O gradiente é nativo (biblioteca do sistema); no Jest vira um View.
const React = require('react');
const {View} = require('react-native');

// eslint-disable-next-line no-unused-vars
const LinearGradient = ({colors, locations, ...props}) =>
  React.createElement(View, props);

module.exports = {__esModule: true, default: LinearGradient, LinearGradient};
