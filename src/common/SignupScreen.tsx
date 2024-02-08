import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { useTasks } from './TasksContextProvider';
interface Props {
  navigation: NavigationProp<ParamListBase>;
}
const SignUpScreen = ({ navigation }: Props) => {
  const {password, setPassword,email, setEmail} = useTasks()
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [emailError, setEmailError] = useState('Please enter a valid email address.');
  const [passwordError, setPasswordError] = useState('Password must be 8-12 characters, include at least one uppercase, lowercase, digit, and special symbol.');
  const [confirmPasswordError, setConfirmPasswordError] = useState('Passwords do not match.');

  const handleSignUp = async () => {
    // Validate input
    setShowErrors(true);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation
    if (!emailRegex.test(email)) {

      return;
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;
    if (!passwordRegex.test(password)) {

      return;
    }

    // Other validations (already included in your code)
    if (!password || !confirmPassword) {
      Alert.alert('Please enter all required fields.');
      return;
    }

    if (password !== confirmPassword) {

      return;
    }

    // Perform sign-up with proper error handling
    // auth()
    //   .createUserWithEmailAndPassword(email, password)
    //   .then(() => {
    //     Alert.alert('User Created Successfully'); // Consider a more user-friendly message
    //      navigation.navigate('LoginScreen')// Redirect after successful signup
    //   })
    //   .catch((error) => {
    //     console.error('Error creating user:', error);
    //     Alert.alert('Signup Failed', error.message); // Display user-friendly error message
    //   });
    setIsLoading(true); // Start loading

    try {
      await auth().createUserWithEmailAndPassword(email, password);
      Alert.alert('User Created Successfully');
      navigation.navigate('LoginScreen');
    } catch (error) {
      console.error('Error creating user:', error);
      Alert.alert('Signup Failed', error.message);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
     {showErrors && emailError && <Text style={styles.errorText}>{emailError}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
        value={password}
      />
      {showErrors && passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        onChangeText={(text) => setConfirmPassword(text)}
        value={confirmPassword}
      />
      
      <Pressable style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>
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