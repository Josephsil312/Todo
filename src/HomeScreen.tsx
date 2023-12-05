import {StyleSheet, View, TouchableOpacity,Image} from 'react-native';
import {HeadingText} from './common/Texts';
import React from 'react';
import Iconfont from 'react-native-vector-icons/Fontisto';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import Star from 'react-native-vector-icons/Octicons';
import Task from 'react-native-vector-icons/FontAwesome'
import Calendar from 'react-native-vector-icons/MaterialCommunityIcons'
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
        <Star name="star" size={22} color="red" style={{marginRight:20}}/>
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
        <Calendar name="calendar-today" size={22} color="#42EA19" style={{marginRight:20}}/>
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
        <Task  name="calendar-check-o" size={20} color="#7568f8" style={{marginRight:20}}/>
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
