
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import MyList from './src/MyList';

function App(): JSX.Element {
  return (
    <View style = {{flex:1}}>
      <MyList />
    </View>
  );
}

const styles = StyleSheet.create({});

export default App;
