import {StyleSheet, View, TouchableOpacity,Image} from 'react-native';
import {HeadingText} from './common/Texts';
import React from 'react';
import Iconfont from 'react-native-vector-icons/Fontisto';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Props {
  navigation: NavigationProp<ParamListBase>;
}
const HomeScreen = ({navigation}: Props) => {
  return (
    <View style={styles.ListContainer}>
      <TouchableOpacity
        style={styles.imageTextContainer}
        onPress={() => navigation.navigate('MyDay')}>
         <Iconfont name="day-sunny" size={22} color="grey" style={{marginRight:20}}/>
        <HeadingText
          textString={'My Day'}
          fontSize={16}
          fontWeight="500"
          fontFamily="SuisseIntl"
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.imageTextContainer}
        onPress={() => navigation.navigate('Important')}>
        <Image source={require('../assets/images/importantt.png')} style = {{marginRight:20}}/>
        <HeadingText
          textString={'Important'}
          fontSize={16}
          fontWeight="500"
          fontFamily="SuisseIntl"
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.imageTextContainer}
        onPress={() => navigation.navigate('Planned')}>
        <Image source={require('../assets/images/planning.png')} style = {{marginRight:20}}/>
        <HeadingText
          textString={'Planned'}
          fontSize={16}
          fontWeight="500"
          fontFamily="SuisseIntl"
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.imageTextContainer}
        onPress={() => navigation.navigate('Tasks')}>
        <Image source={require('../assets/images/home.png')} style = {{marginRight:20}}/>
        <HeadingText
          textString={'Tasks'}
          fontSize={16}
          fontWeight="500"
          fontFamily="SuisseIntl"
        />
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
    width: 20,
    height: 20,
    marginRight: 20,
  },
});
