import { StyleSheet, Text, View } from 'react-native';
import React,{useEffect} from 'react';
import HomeScreenNavigator from './src/navigators/HomeScreenNavigator';
import SplashScreen from 'react-native-splash-screen'
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Authentication from './src/common/Authentication';
import SignUpScreen from './src/common/SignupScreen'
const App = () => {

  // GoogleSignin.configure({
  //   webClientId:'802919083434-oam6h5j554sqqlesab5dr14nkgrbc1eh.apps.googleusercontent.com'
  // })

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

  return  <HomeScreenNavigator />;
};

export default App;
