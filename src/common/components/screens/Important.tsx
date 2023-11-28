import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
interface Props {
  navigation: NavigationProp<ParamListBase>;
}
const Important = ({navigation}: Props) => {
  return (
    <View>
      <Text>Important</Text>
    </View>
  );
};

export default Important;

const styles = StyleSheet.create({
  image: {
    width: 40,
    height: 40,
  },
});
