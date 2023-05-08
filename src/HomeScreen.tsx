import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {HeadingText} from './common/Texts';
import React from 'react';
import Icon from 'react-native-vector-icons/Feather';
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
        <Icon name="sun" size={25} style={{marginRight: 20}} />
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
        <Icon name="star" size={25} style={{marginRight: 20}} color="red" />
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
        <Icon
          name="file-text"
          size={25}
          style={{marginRight: 20}}
          color="green"
        />
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
        <Icon
          name="check-square"
          size={25}
          style={{marginRight: 20}}
          color="grey"
        />
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
