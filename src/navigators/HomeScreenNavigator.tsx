import {Pressable, View,Image} from 'react-native';
import HomeScreen from '../HomeScreen';
import Tasks from '../common/components/screens/Tasks';
import Planned from '../common/components/screens/Planned';
import Important from '../common/components/screens/Important';
import MyDay from '../common/components/screens/MyDay';
import {NavigationContainer, useRoute} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AddNote from '../common/components/screens/AddNote';
import React from 'react';
const Stack = createNativeStackNavigator();
function HomeScreenNavigator(props:any): JSX.Element {
  type RouteParams = {
    selectedItem?: string; // Adjust the type as needed
    navigation?: any;
  };
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
                backgroundColor: '#7568f8', 
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
           <Stack.Screen
            name="Add Note"
            component={AddNote}
            options={({ route, navigation }: { route: { params?: RouteParams }; navigation: any }) => ({
              headerTitle:  'Add Note',
              headerTitleStyle: {
                fontWeight: '200',
                fontSize: 25,
                color:'black'
              },
              headerStyle: {
                backgroundColor: '#fff', 
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
