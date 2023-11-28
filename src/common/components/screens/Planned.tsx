import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
interface Props {
  navigation: NavigationProp<ParamListBase>;
}
const Planned = ({navigation}: Props) => {
  return (
    <View>
      <Text>Planned</Text>
    </View>
  );
};

export default Planned;

const styles = StyleSheet.create({
  image: {
    height: 40,
    width: 40,
  },
});
