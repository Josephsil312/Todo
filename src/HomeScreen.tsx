import {StyleSheet, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import Texts from './common/Texts';

const HomeScreen = ({navigation}) => {
  return (
    <View style={styles.ListContainer}>
      <TouchableOpacity
        style={styles.imageTextContainer}
        onPress={() => navigation.navigate('MyDay')}>
        <Image
          source={require('../assets/images/sunlight.png')}
          style={styles.image}
        />
        <Texts text={'My Day'} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.imageTextContainer}
        onPress={() => navigation.navigate('Important')}>
        <Image
          source={require('../assets/images/important.png')}
          style={styles.image}
        />
        <Texts text={'Important'} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.imageTextContainer}
        onPress={() => navigation.navigate('Planned')}>
        <Image
          source={require('../assets/images/planning.png')}
          style={styles.image}
        />
        <Texts text={'Planned'} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.imageTextContainer}
        onPress={() => navigation.navigate('Tasks')}>
        <Image
          source={require('../assets/images/task.png')}
          style={styles.image}
        />
        <Texts text={'Tasks'} />
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  ListContainer: {
    flex: 1,
    padding: 20,
  },
  imageTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    height: 75,
    width: 150,
  },
  image: {
    width: 30,
    height: 30,
    marginRight: 20,
  },
});
