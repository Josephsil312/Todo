import React, { useEffect,useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useTasks } from './TasksContextProvider';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import HomeScreenNavigator from '../navigators/HomeScreenNavigator';
import SignUpScreen from './SignupScreen';
import LoginScreen from './LoginScreen';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
interface Props {
    navigation: NavigationProp<ParamListBase>;
  }
const Authentication = ({navigation}: Props) => {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      await onGoogleButtonPress();
      console.log('Signed in with Google');
    } catch (error) {
      console.error('Google sign-in error:', error.code,error.message);
    }
  };

  // Handle user state changes
  // function onAuthStateChanged(user) {
  //   setUser(user);
  //   if (initializing) setInitializing(false);
  // }

  useEffect(() => {
    auth().onAuthStateChanged(userState => {
      setUser(userState);

      if (initializing) {
        setInitializing(false);
      }
    });
  }, []);

  if (initializing) return;

  if (!user) {
    return (
      <View>
        <SignUpScreen navigation={undefined}/>
        {/* <LoginScreen navigation={navigation}/> */}
        <Pressable onPress={handleGoogleSignIn}><Text>Login with google</Text></Pressable>
      </View>
    );
  }

  return <HomeScreenNavigator />;
  async function onGoogleButtonPress() {
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();
   
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
   
    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }
}

export default Authentication;