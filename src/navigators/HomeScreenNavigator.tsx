import {Pressable, View,Image} from 'react-native';
import HomeScreen from '../HomeScreen';
import Tasks from '../common/components/screens/Tasks';
import Planned from '../common/components/screens/Planned';
import Important from '../common/components/screens/Important';
import MyDay from '../common/components/screens/MyDay';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import React from 'react';
const Stack = createNativeStackNavigator();
function HomeScreenNavigator(): JSX.Element {
  return (
    <NavigationContainer>
      <View style={{flex: 1}}>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{title: 'Home', headerShown: false}}
          />
          <Stack.Screen
            name="Tasks"
            component={Tasks}
            options={({navigation}) => ({
              headerTitle: 'Tasks',
              headerTitleStyle: {
                fontWeight: '200',
                fontSize: 25
              },
              headerStyle: {
                backgroundColor: '#8B80F9', 
              },
              headerTintColor: '#fff',
              headerLeft: () => (
                <Pressable
                  onPress={() => {
                    navigation.goBack();
                  }}
                >
                  <Image source={require('../../assets/images/chevron_left.png')} style={{ width: 23, height: 23,marginRight:20 }} />
                </Pressable>
              ),
            })}
          />
          <Stack.Screen
            name="Planned"
            component={Planned}
            options={({navigation}) => ({
              headerTitle: 'Planned',
              headerTitleStyle: {
                fontWeight: '200',
                fontSize: 25
              },
              headerStyle: {
                backgroundColor: '#375E31', 
              },
              headerTintColor: '#fff',
              headerLeft: () => (
                <Pressable
                  onPress={() => {
                    navigation.goBack();
                  }}
                >
                  <Image source={require('../../assets/images/chevron_left.png')} style={{ width: 23, height: 23,marginRight:20 }} />
                </Pressable>
              ),
            })}
          />
          <Stack.Screen
            name="MyDay"
            component={MyDay}
            options={({navigation}) => ({
              headerTitle: 'My Day',
              headerTitleStyle: {
                fontWeight: '200',
                fontSize: 25
              },
              headerStyle: {
                backgroundColor: '#A755C2', 
              },
              headerTintColor: '#fff',
              headerLeft: () => (
                <Pressable
                  onPress={() => {
                    navigation.goBack();
                  }}
                >
                  <Image source={require('../../assets/images/chevron_left.png')} style={{ width: 23, height: 23,marginRight:20 }} />
                </Pressable>
              ),
            })}
          />
          <Stack.Screen
            name="Important"
            component={Important}
            options={({navigation}) => ({
              headerTitle: 'Important',
              headerTitleStyle: {
                fontWeight: '200',
                fontSize: 25
              },
              headerStyle: {
                backgroundColor: '#56101A', 
              },
              headerTintColor: '#fff',
              headerLeft: () => (
                <Pressable
                  onPress={() => {
                    navigation.goBack();
                  }}
                >
                  <Image source={require('../../assets/images/chevron_left.png')} style={{ width: 23, height: 23,marginRight:20 }} />
                </Pressable>
              ),
            })}
          />
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
}

export default HomeScreenNavigator;
