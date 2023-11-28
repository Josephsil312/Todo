import {Text, View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import React from 'react';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
interface Props {
  navigation: NavigationProp<ParamListBase>;
}
const MyDay = ({navigation}: Props) => {
  return (
    <View>
      <Text>MyDay</Text>
    </View>
  );
};

export default MyDay;

const styles = StyleSheet.create({
  image: {
    height: 40,
    width: 40,
  },
});
