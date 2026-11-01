// O Vega Carousel desenha os itens no nativo. No Jest ele vira um View que
// renderiza todos os itens do dataAdapter; os testes disparam
// `onSelectionChanged` pelas props do View (testID = testID do Carousel).
const React = require('react');
const {View} = require('react-native');

function Carousel({dataAdapter, renderItem, testID, onSelectionChanged}) {
  const items = [];
  for (let index = 0; index < dataAdapter.getItemCount(); index++) {
    const item = dataAdapter.getItem(index);
    items.push(
      React.createElement(
        React.Fragment,
        {key: String(dataAdapter.getItemKey({item, index}))},
        renderItem({item, index}),
      ),
    );
  }
  return React.createElement(View, {testID, onSelectionChanged}, items);
}

module.exports = {Carousel};
