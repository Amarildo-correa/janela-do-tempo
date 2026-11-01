import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ScreenBackground} from '../components/ScreenBackground';
import {Wordmark} from '../components/Wordmark';
import {color, size, space, type} from '../theme';

// A busca de cidades ainda não existe. O Voltar do controle retorna à Home.
export function SearchScreen() {
  return (
    <ScreenBackground>
      <View style={styles.page}>
        <View style={styles.header}>
          <Wordmark />
        </View>
        <Text style={styles.title} role="heading">
          Em desenvolvimento
        </Text>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingTop: space.safeY,
    paddingHorizontal: space.safeX,
  },
  header: {height: size.headerH, justifyContent: 'center'},
  title: {
    ...type.whenWhere,
    color: color.ink,
    marginTop: space.s64,
  },
});
