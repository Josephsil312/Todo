import { StyleSheet, View, TouchableOpacity, Image, Pressable, Text, Alert, BackHandler } from 'react-native';
import { HeadingText } from './common/Texts';
import React, { useEffect, useRef } from 'react';
import Iconfont from 'react-native-vector-icons/Fontisto';
import { NavigationProp, ParamListBase, useIsFocused, useNavigation } from '@react-navigation/native';
import Star from 'react-native-vector-icons/Octicons';
import Task from 'react-native-vector-icons/FontAwesome'
import Calendar from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth, { FirebaseAuthError } from '@react-native-firebase/auth';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Props {
  navigation: NavigationProp<ParamListBase>;
}

const HomeScreen = ({ navigation }: Props) => {
  // const navigation = useNavigation()
  const isFocused = useIsFocused();
  const backHandlerRef = useRef(null);
  const handlePress = () => {
    AsyncStorage.setItem('isLoggedIn', "false")
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
    navigation.navigate('SignupScreen')
  }
  
  useEffect(() => {
    if (isFocused) {
      const backAction = () => {
        Alert.alert('Hold on!', 'Are you sure you want to exit?', [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          { text: 'YES', onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => backHandler.remove();
    }
  }, [isFocused]);
  
  return (
    <>
      <View style={styles.ListContainer}>
        <TouchableOpacity
          style={styles.imageTextContainer}
          onPress={() => navigation.navigate('MyDay')}>
          <Iconfont name="day-sunny" size={22} color="grey" style={{ marginRight: 20 }} />
          <HeadingText
            textString={'My Day'}
            fontSize={16}

            fontFamily="SuisseIntl"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.imageTextContainer}
          onPress={() => navigation.navigate('Important')}>
          <Star name="star" size={22} color="red" style={{ marginRight: 20 }} />
          <HeadingText
            textString={'Important'}
            fontSize={16}

            fontFamily="SuisseIntl"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.imageTextContainer}
          onPress={() => navigation.navigate('Planned')}>
          <Calendar name="calendar-today" size={22} color="#42EA19" style={{ marginRight: 20 }} />
          <HeadingText
            textString={'Planned'}
            fontSize={16}

            fontFamily="SuisseIntl"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.imageTextContainerr}
          onPress={() => navigation.navigate('Tasks')}>
          <Task name="calendar-check-o" size={19} color="#7568f8" style={{ marginRight: 20 }} />
          <HeadingText
            textString={'Tasks'}
            fontSize={16}

            fontFamily="SuisseIntl"
          />

        </TouchableOpacity>



      </View>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Pressable style={styles.button} onPress={handlePress} >
          <Text style={styles.buttonTitle}>Logout</Text>
        </Pressable>
      </View>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  ListContainer: {
    flex: 1,
    padding: 20,
  },
  buttonTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: "bold"
  },
  button: {
    backgroundColor: '#788eec',
    height: 48,
    alignItems: "center",
    justifyContent: 'center',
    width: '100%'
  },
  imageTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    height: 75,
  },
  image: {
    width: 20,
    height: 20,
    marginRight: 20,
  },
  imageTextContainerr: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    height: 75,
  }
});
