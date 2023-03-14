import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const Textt = (props: {text: string}) => {
  return (
    <View>
      <Text style={styles.list}>{props.text}</Text>
    </View>
  );
};

export default Textt;

const styles = StyleSheet.create({
  list: {
    fontFamily: 'Roboto',
    fontSize: 25,
  },
});
