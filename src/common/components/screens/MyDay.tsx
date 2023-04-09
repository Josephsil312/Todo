import {Text, View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import React from 'react';

const MyDay = ({navigation}) => {
  return (
    <View>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image
          source={require('./../../../../assets/images/back-arrow.png')}
          style={styles.image}
        />
      </TouchableOpacity>
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
