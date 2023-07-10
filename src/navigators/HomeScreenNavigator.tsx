import {View} from 'react-native';
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
            options={{title: '', headerShown: false}}
          />
          <Stack.Screen
            name="Planned"
            component={Planned}
            options={{title: '', headerShown: false}}
          />
          <Stack.Screen
            name="MyDay"
            component={MyDay}
            options={{title: '', headerShown: false}}
          />
          <Stack.Screen
            name="Important"
            component={Important}
            options={{
              title: '',
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
}

export default HomeScreenNavigator;
