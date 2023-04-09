import React from 'react';
import {View} from 'react-native';
import HomeScreen from './src/HomeScreen';
import Tasks from './src/common/components/screens/Tasks';
import Planned from './src/common/components/screens/Planned';
import Important from './src/common/components/screens/Important';
import MyDay from './src/common/components/screens/MyDay';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();
function App(): JSX.Element {
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

export default App;
