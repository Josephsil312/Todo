import {  View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { TextInputSingleLine } from '../../../styled';
import { HeadingText } from '../../Texts';
import CustomModal from './CustomModal';

const AddingTasks = (props: {
  setTask: (arg0: any) => any;
  task: any;
  inputRef: any;
  handleAddTask: (() => void) | undefined;
  handlePlusIconClick: (() => void) | undefined;
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isDueToday, setIsDueToday] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      <View style={{ padding: 5 }}>
        <TextInputSingleLine
          onChangeText={(text: any) => props.setTask(text)}
          value={props.task}
          placeholder={'Add task'}
          maxLength={256}
          color={'grey'}
          ref={props.inputRef}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5 }}>
          <TouchableOpacity onPress={openModal}>
            <HeadingText
              textString={isDueToday ? 'Due Today' : 'Set Due date'}
              fontSize={16}
              fontWeight="500"
              fontFamily="SuisseIntl"
              marginLeft={10}
              marginVertical={10}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={props.handleAddTask}>
            <HeadingText
              textString={`Add`}
              fontSize={16}
              fontWeight="500"
              fontFamily="SuisseIntl"
              marginLeft={10}
              marginVertical={10}
            />
          </TouchableOpacity>
        </View>
      </View>
      <CustomModal isDueToday={isDueToday} setIsDueToday={setIsDueToday} modalVisible={modalVisible} setModalVisible={setModalVisible} openModal={openModal} closeModal={closeModal} />
    </>
  );
};

export default AddingTasks;
