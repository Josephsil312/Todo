import {Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {RowContainer, TextInputSingleLine} from '../../../styled';
const AddingTasks = (props: {
  setTask: (arg0: any) => any;
  task: any;
  handleAddTask: (() => void) | undefined;
}) => {
  return (
    <>
      <View style={{padding: 10}}>
        <RowContainer>
          <TextInputSingleLine
            onChangeText={(text: any) => props.setTask(text)}
            value={props.task}
            placeholder={'Add task'}
            maxLength={256}
            color={'grey'}
          />

          <TouchableOpacity onPress={props.handleAddTask}>
            <Text>Add</Text>
          </TouchableOpacity>
        </RowContainer>
      </View>
    </>
  );
};

export default AddingTasks;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 20,
//   },
//   heading: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   addButton: {
//     backgroundColor: 'blue',
//     padding: 10,
//     borderRadius: 5,
//   },
//   addButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   taskList: {
//     flex: 1,
//     alignSelf: 'stretch',
//   },
//   taskItem: {
//     backgroundColor: '#f0f0f0',
//     padding: 10,
//     marginVertical: 5,
//     borderRadius: 5,
//   },
// });
