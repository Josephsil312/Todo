import {Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {RowContainer, TextInputSingleLine} from '../../../styled';
const AddingTasks = (props: {
  setTask: (arg0: any) => any;
  task: any;
  handleAddTask: (() => void) | undefined;
  handlePlusIconClick: (() => void) | undefined;
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

