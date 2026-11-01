import React from 'react';
import {StyleSheet} from 'react-native';
import {GestureHandlerRootView} from '@amazon-devices/react-native-gesture-handler';
import {SafeAreaProvider} from '@amazon-devices/react-native-safe-area-context';
import {RootNavigator} from './navigation';

export const App = () => {
  // O stack navigator do Vega depende do react-native-gesture-handler, que
  // precisa envolver a árvore de navegação.
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <RootNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  root: {flex: 1},
});
