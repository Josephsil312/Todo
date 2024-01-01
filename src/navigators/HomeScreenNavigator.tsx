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
import TasksContextProvider, { useTasks } from '../common/TasksContextProvider';
import LeftChevron from 'react-native-vector-icons/AntDesign';
const Stack = createNativeStackNavigator();
function HomeScreenNavigator(props:any): JSX.Element {
  type RouteParams = {
    selectedItem?: string; // Adjust the type as needed
    navigation?: any;
  };
  const getSelectedItem = () => {
    const { selectedItem } = useTasks();
    return selectedItem;
  };
  return (
    <TasksContextProvider>
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
                  <LeftChevron name="left" size={22} color="grey" style={{ color: 'white',marginRight:20 }}   />
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
                fontSize: 25,
                color:'#971c3d'
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
                  <LeftChevron name="left" size={22} color="grey" style={{ color: '#971c3d',marginRight:20 }}   />
                </Pressable>
              ),
            })}
          />
           <Stack.Screen
            name="Add Note"
            component={AddNote}
            options={({ navigation}) => ({
              headerTitle: getSelectedItem() ?? 'Add Note',
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
    </TasksContextProvider>
  );
}

export default HomeScreenNavigator;
