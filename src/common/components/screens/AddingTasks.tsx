import {  View, TouchableOpacity, Image,Pressable} from 'react-native';
import React, { useState } from 'react';
import { TextInputSingleLine } from '../../../styled';
import { HeadingText } from '../../Texts';
import CustomModal from './CustomModal';

const AddingTasks = (props: {
  setTask: (arg0: any) => any;
  task: any;
  inputRef: any;
  handleAddTask: (() => void) | undefined;
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
      <View style={{ padding: 0 }}>
        <TextInputSingleLine
          onChangeText={(text: any) => props.setTask(text)}
          value={props.task}
          placeholder={'Add task'}
          maxLength={256}
          color={'grey'}
          ref={props.inputRef}
          // onLayout={() => props.inputRef.current?.focus()}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between',alignItems:'center'}}>
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
          <Pressable onPress={props.handleAddTask} style = {{position:'relative',zIndex:9999999}}>
          <Image
                 style = {{}}
                  source={
                    props.task.trim() !== ''
                      ? require('../../../../assets/images/arrow_circle_up_enabled.png')
                      : require('../../../../assets/images/arrow_circle_up_disabled.png')
                  }
                  resizeMode="contain"
                />
            
          </Pressable>
        </View>
      </View>
      <CustomModal isDueToday={isDueToday} setIsDueToday={setIsDueToday} modalVisible={modalVisible} setModalVisible={setModalVisible} openModal={openModal} closeModal={closeModal} />
    </>
  );
};

export default AddingTasks;
