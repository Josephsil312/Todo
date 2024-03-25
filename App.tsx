import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';

import SplashScreen from 'react-native-splash-screen'
import { firebase } from '@react-native-firebase/firestore';
import TasksContextProvider from './src/common/TasksContextProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, NavigationProp, ParamListBase } from '@react-navigation/native';
import SignupScreen from './src/common/SignupScreen';
import LoginScreen from './src/common/LoginScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LeftChevron from 'react-native-vector-icons/AntDesign';
import Important from './src/common/components/screens/Important';
import MyDay from './src/common/components/screens/MyDay';
import Planned from './src/common/components/screens/Planned';
import Tasks from './src/common/components/screens/Tasks';
import HomeScreen from './src/HomeScreen';
import Splash from './src/common/components/screens/Splash';
// import Notes from './src/common/components/screens/Notes';

interface Props {
  navigation: NavigationProp<ParamListBase>;
}
const Stack = createNativeStackNavigator();

const App = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

 useEffect(() => {
    const checkLoginState = async () => {
      const loggedIn = await AsyncStorage.getItem('isLoggedIn');
      setIsLoggedIn(loggedIn === 'true');
    };

    checkLoginState();
 }, []);

 useEffect(() => {
    SplashScreen.hide();
 }, []);
 
  return (<>
    <TasksContextProvider>
      <NavigationContainer>
        <View style={{ flex: 1 }}>
        
            <View style={{ flex: 1 }}>
              
              <Stack.Navigator initialRouteName={"Splash"}>
                
                <Stack.Screen
                  name="Splash"
                  component={Splash}
                  options={{ title: 'Home', headerShown: false }}
                />
                <Stack.Screen
                  name="Home"
                  component={HomeScreen}
                  options={{ title: 'Home', headerShown: false }}
                />
                <Stack.Screen
                  name="SignupScreen"
                  component={SignupScreen}
                  options={{ title: 'Home', headerShown: false }}
                />
                <Stack.Screen
                  name="Tasks"
                  component={Tasks}
                  options={({ navigation }) => ({
                    headerTitle: 'Tasks',
                    headerTitleStyle: {
                      fontWeight: '200',
                      fontSize: 25
                    },
                    headerStyle: {
                      backgroundColor: '#001d76',
                    },
                    headerTintColor: '#fff',
                    headerLeft: () => (
                      <Pressable
                        onPress={() => {
                          navigation.goBack();
                        }}
                      >
                        <LeftChevron name="left" size={22} color="grey" style={{ color: 'white', marginRight: 20 }} />
                      </Pressable>
                    ),
                  })}
                />

                <Stack.Screen
                  name="Planned"
                  component={Planned}
                  options={({ navigation }) => ({
                    headerTitle: 'Planned',
                    headerTitleStyle: {
                      fontWeight: '200',
                      fontSize: 25
                    },
                    headerStyle: {
                      backgroundColor: '#037754',
                    },
                    headerTintColor: '#fff',
                    headerLeft: () => (
                      <Pressable
                        onPress={() => {
                          navigation.goBack();
                        }}
                      >
                        <LeftChevron name="left" size={22} color="#fff" style={{ marginRight: 20 }} />
                      </Pressable>
                    ),
                  })}
                />
                <Stack.Screen
                  name="MyDay"
                  component={MyDay}
                  options={({ navigation }) => ({
                    headerTitle: 'My Day',
                    headerTitleStyle: {
                      fontWeight: '200',
                      fontSize: 25
                    },
                    headerStyle: {
                      backgroundColor: '#79015B',
                    },
                    headerTintColor: '#fff',
                    headerLeft: () => (
                      <Pressable
                        onPress={() => {
                          navigation.goBack();
                        }}
                      >
                        <LeftChevron name="left" size={22} color="#fff" style={{ marginRight: 20 }} />
                      </Pressable>
                    ),
                  })}
                />
                <Stack.Screen
                  name="Important"
                  component={Important}
                  options={({ navigation }) => ({
                    headerTitle: 'Important',
                    headerTitleStyle: {
                      fontWeight: '200',
                      fontSize: 25,
                      color: '#971c3d'
                    },
                    headerStyle: {
                      backgroundColor: '#ffcbd8',
                    },
                    headerTintColor: '#fff',
                    headerLeft: () => (
                      <Pressable
                        onPress={() => {
                          navigation.goBack();
                        }}
                      >
                        <LeftChevron name="left" size={22} color="grey" style={{ color: '#971c3d', marginRight: 20 }} />
                      </Pressable>
                    ),
                  })}
                />
                <Stack.Screen
                  name="LoginScreen"
                  component={LoginScreen}
                  options={{ title: 'Home', headerShown: false }}
                />
                
              </Stack.Navigator>
            </View>
         
        </View>
      </NavigationContainer>
    </TasksContextProvider>
  </>

  );
};

export default App;
