import React from 'react';
import {
  enableFreeze,
  enableScreens,
} from '@amazon-devices/react-native-screens';
import {
  DarkTheme,
  NavigationContainer,
} from '@amazon-devices/react-navigation__native';
import {createStackNavigator} from '@amazon-devices/react-navigation__stack';
import {HomeScreen} from './screens/HomeScreen';
import {SearchScreen} from './screens/SearchScreen';
import {color} from './theme';

export type RootStackParamList = {
  Home: undefined;
  Search: undefined;
};

// Otimizações recomendadas pela Amazon para a navegação no Vega.
enableScreens();
enableFreeze();

const Stack = createStackNavigator<RootStackParamList>();

const theme = {
  ...DarkTheme,
  colors: {...DarkTheme.colors, background: color.bgBase},
};

// Troca de tela sem animação, como nos apps de exemplo da Amazon para Vega
// (vega-audio-sample, vega-sports-app, vega-video-sample). No Vega o
// 'default' do stack vira o ScaleFromCenterAndroid, um zoom que deslocava a
// tela durante a troca.
const screenOptions = {headerShown: false, animation: 'none'} as const;

export function RootNavigator() {
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator initialRouteName="Home" screenOptions={screenOptions}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
