import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
interface Props {
  navigation: NavigationProp<ParamListBase>;
}
const Important = ({navigation}: Props) => {
  return (
    <View>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image
          source={require('./../../../../assets/images/back-arrow.png')}
          style={styles.image}
        />
      </TouchableOpacity>
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
