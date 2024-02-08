import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet,Alert } from 'react-native';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import auth,{ FirebaseAuthError }from '@react-native-firebase/auth';
import { useTasks } from '../common/TasksContextProvider';
interface Props {
    navigation: NavigationProp<ParamListBase>;
  }
const LoginScreen = ({navigation}: Props) => {
  const {password, setPassword,email, setEmail} = useTasks()
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const handleLogin = async () => {
    // Clear previous errors
    setEmailError('');
    setPasswordError('');

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    // Password validation
    if (!password) {
      setPasswordError('Please enter your password.');
      return;
    }

    setIsLoading(true);

    try {
      await auth().signInWithEmailAndPassword(email, password);
      // Successful login
      
    } catch (error) {
      console.error('Error logging in:', error);
      // Display error message based on error code
      if (error.code === 'auth/wrong-password') {
        setPasswordError('Incorrect password.');
      } else if (error.code === 'auth/user-not-found') {
        setEmailError('Email not found. Please check the email address and try again.');
      } else {
        Alert.alert('Login Failed', error as FirebaseAuthError);
      }
    } finally {
      setIsLoading(false);
      navigation.navigate('Home');
    }
  };
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
  
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(text) => setEmail(text)}
          value={email}
        />
  
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
          value={password}
        />
  
        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
  
        <Pressable
          style={styles.signupLink}
          onPress={() => navigation.navigate('SignUpScreen')}
>
          <Text style={styles.signupText}>Don't have an account? Sign Up</Text>
        </Pressable>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
 
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
      marginTop:150
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
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
      backgroundColor: '#4CAF50',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 5,
      marginBottom: 16,
    },
    buttonText: {
      color: 'white',
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

  export default LoginScreen