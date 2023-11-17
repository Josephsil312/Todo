import { Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { RowContainer, TextInputSingleLine } from '../../../styled';
import CustomModal from './CustomModal';
const AddingTasks = (props: {
  setTask: (arg0: any) => any;
  task: any;
  inputRef: any;
  handleAddTask: (() => void) | undefined;
  handlePlusIconClick: (() => void) | undefined;

}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };
  return (
    <>
    
      <View style={{ padding: 5 }}>
        {/* <RowContainer> */}


        <TextInputSingleLine
          onChangeText={(text: any) => props.setTask(text)}
          value={props.task}
          placeholder={'Add task'}
          maxLength={256}
          color={'grey'}
          ref={props.inputRef}
        />
        <View style = {{flexDirection:'row',justifyContent:'space-between',paddingBottom:5}}>
          <TouchableOpacity onPress={openModal}>
            <Text >Set due date</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={props.handleAddTask}>
            <Text>Add</Text>
          </TouchableOpacity>

          
        </View>

        {/* </RowContainer> */}
      </View>
      <CustomModal modalVisible={modalVisible} setModalVisible={setModalVisible} openModal={openModal} closeModal={closeModal} />
   
    </>
  );
};

export default AddingTasks;
