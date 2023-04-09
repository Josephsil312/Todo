import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';

const Planned = ({navigation}) => {
  return (
    <View>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image
          source={require('./../../../../assets/images/back-arrow.png')}
          style={styles.image}
        />
      </TouchableOpacity>
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
