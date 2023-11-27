import { StyleSheet, Text, View } from 'react-native';
import React,{useEffect} from 'react';
import HomeScreenNavigator from './src/navigators/HomeScreenNavigator';
import SplashScreen from 'react-native-splash-screen'
const App = () => {
  useEffect(() => {
    // Set a timeout to hide the splash screen after a certain duration (e.g., 2000 milliseconds or 2 seconds)
    const timeoutId = setTimeout(() => {
      SplashScreen.hide();
      // You can add navigation logic here to navigate to the HomeScreen or another screen
    }, 2000);

    // Clear the timeout when the component unmounts
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return <HomeScreenNavigator />;
};

export default App;
