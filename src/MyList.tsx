import {StyleSheet, View} from 'react-native';
import React from 'react';
import Textt from './common/Textt';

const MyList = () => {
  return (
    <View style={styles.ListContainer}>
      <Textt text={'My Day'} />
      <Textt text={'Important'} />
      <Textt text={'Planned'} />
      <Textt text={'Assigned to me'} />
      <Textt text={'Tasks'} />
    </View>
  );
};

export default MyList;

const styles = StyleSheet.create({
  ListContainer: {
    flex: 1,
  },
});
