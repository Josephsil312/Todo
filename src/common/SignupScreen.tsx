import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ActivityIndicator, Button, Image } from 'react-native';
import auth, { firebase } from '@react-native-firebase/auth';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { useTasks } from './TasksContextProvider';
import GoogleAuthProvider from '@react-native-firebase/auth';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
interface Props {
  navigation: NavigationProp<ParamListBase>;
}
const SignUpScreen = ({ navigation }: Props) => {
  const { password, setPassword, email, setEmail } = useTasks()
  const [confirmPassword, setConfirmPassword] = useState('');
  const[error,setError] = useState()
  const [isLoading, setIsLoading] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [emailError, setEmailError] = useState('Please enter a valid email address.');
  const [passwordError, setPasswordError] = useState('Password must be 8-12 characters, include at least one uppercase, lowercase, digit, and special symbol.');
  const [confirmPasswordError, setConfirmPasswordError] = useState('Passwords do not match.');
  // const [email,setEmail] = useState('')
  // const [password,setPassword] = useState('')
  const [userInfo, setUserInfo] = useState()
  useEffect(() => {
    GoogleSignin.configure({
      
      webClientId: '737738243110-urmsj0q3ipicbpc6ppru9mppo2s9gajf.apps.googleusercontent.com', // From Firebase Console
    });
  },[])
  
  const handleSignUp = async () => {

    try {
      console.log('hello')
      await auth().createUserWithEmailAndPassword(email, password);
      Alert.alert('User Created Successfully');
      navigation.navigate('LoginScreen');
    } catch (error) {
      console.error('Error creating user:', error);
      Alert.alert('Signup Failed',);
    } finally {
      // setIsLoading(false); // Stop loading
    }
  };

  
  const signIn = async () => {
    
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('userInfo',userInfo)
      const googleCredential = auth.GoogleAuthProvider.credential(userInfo.idToken,userInfo.accessToken);
     

      const userCredential = await auth().signInWithCredential(googleCredential);
      console.log('signed in with google', userCredential.user);
      setUserInfo(userInfo);
      
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('user cancelled the login flow')
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('operation (e.g. sign in) is in progress already')
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        setError(error)
        console.log('error in googlesignin',error)
      }
      setError(error)
    }
  };
  // const handleGoogleSignIn = async () => {
  //   try {
  //     // Check if your device supports Google Play
  //     await GoogleSignin.hasPlayServices();
  //     // Get the users ID token
  //     const { idToken } = await GoogleSignin.signIn();

  //     // Create a Google credential with the token
  //     const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  //     navigation.navigate('Home');
  //     // Sign-in the user with the credential
  //     return auth().signInWithCredential(googleCredential);
  //     // Navigate to the next screen or do something else

  //   } catch (error) {
  //     console.error('Google Sign-In Error:', error.stack);
  //     Alert.alert('Google Sign-In Failed');
  //   }
  // };
  return (
    <View style={styles.container}>
      {userInfo !== null && <Text>{JSON.stringify(userInfo)}</Text>}
      {/* {userInfo !== null && <Image source={{uri:userInfo.user.photo}}/>} */}
      <Text style={{ color: '#e93766', fontSize: 40 }}>Sign Up</Text>
      {/* {emailError &&
          <Text style={{ color: 'red' }}>
            {emailError}
          </Text>} */}
      <TextInput
        placeholder="Email"
        autoCapitalize="none"

        onChangeText={text => setEmail(text)}
        value={email}
      />
      <TextInput
        secureTextEntry
        placeholder="Password"
        autoCapitalize="none"

        onChangeText={text => setPassword(text)}
        value={password}
      />
      <Button title="Sign Up" color="#e93766" onPress={handleSignUp} />
      <View>
        <Text> Already have an account? <Text onPress={() => navigation.navigate('LoginScreen')} style={{ color: '#e93766', fontSize: 18 }}> Login </Text></Text>
        {/* <Button title="Sign Up with Google" color="#e93766" onPress={signIn} /> */}
       {userInfo ? (<Button title = "logout"/>) :(
        <GoogleSigninButton onPress = {signIn}/>
       )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {

    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    marginTop: 300
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black'
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: 'blue',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 16,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupLink: {
    marginTop: 10,
  },
  signupText: {
    color: 'blue',
    fontSize: 16,
  },
});

export default SignUpScreen
