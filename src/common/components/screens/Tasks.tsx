import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
const Tasks = ({navigation}) => {
  return (
    <View style={styles.taskContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image
          source={require('./../../../../assets/images/back-arrow.png')}
          style={styles.image}
        />
      </TouchableOpacity>
      <Text style={{color: 'white', fontSize: 30}}>Tasks</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  image: {
    width: 40,
    height: 40,
  },
  taskContainer: {
    flex: 1,
    backgroundColor: '#3555d4',
  },
});
export default Tasks;
