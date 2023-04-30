import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import GlobalStyle from '../utils/GlobalStyle';
const Texts = (props: {text: string}) => {
  return (
    <View>
      <Text style={[GlobalStyle.customFont, styles.list]}>{props.text}</Text>
    </View>
  );
};

export default Texts;

const styles = StyleSheet.create({
  list: {
    fontSize: 25,
  },
});
