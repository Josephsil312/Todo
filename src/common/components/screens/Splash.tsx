import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, ParamListBase } from '@react-navigation/native';

interface Props {
 navigation: NavigationProp<ParamListBase>;
}

const Splash = ({ navigation }: Props) => {
 const [isLoggedIn, setIsLoggedIn] = useState(false); // Initialize isLoggedIn as false
 const [loading, setLoading] = useState(true); // Initialize loading as true

 useEffect(() => {
    const hideSplashScreenAndNavigate = async () => {
      // Check if the user is logged in
      const loggedIn = await AsyncStorage.getItem('isLoggedIn');
      setIsLoggedIn(loggedIn === 'true');

      // Hide the splash screen
      SplashScreen.hide();

      // Set loading to false to indicate the app is ready to navigate
      setLoading(false);

      // Navigate based on the login state
      if (isLoggedIn) {
        navigation.navigate('Home');
      } else {
        navigation.navigate('SignupScreen');
      }
    };
    setTimeout(() => {
        setLoading(true); // Start loading after a delay
      }, 2000); 
    hideSplashScreenAndNavigate();
 }, [navigation, isLoggedIn]); // Depend on navigation and isLoggedIn

 if (loading) {
    return (
      <View style={styles.container}>
        {/* You can display a loading indicator here if needed */}
        <ActivityIndicator/>
      </View>
    );
 }

 return null; // Return null or an empty view if not loading to avoid rendering anything
};

const styles = StyleSheet.create({
 container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
 },
});

export default Splash;
