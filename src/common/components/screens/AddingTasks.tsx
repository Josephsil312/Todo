import { View, TouchableOpacity, Pressable,StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { TextInputSingleLine } from '../../../styled';
import { HeadingText } from '../../Texts';
import CustomModal from './CustomModal';
import Iconn from 'react-native-vector-icons/Ionicons';

const AddingTasks = (props: {
  setTask: (arg0: any) => any;
  task: any;
  inputRef: any;
  handleAddTask: (() => void) | undefined;
  color: any;
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
        <View style={styles.addtask}>
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
          <Pressable onPress={props.handleAddTask} style={styles.addingtaskicon}>
            {
              props.task.trim() !== ''
                ? <Iconn name="arrow-up-circle" size={30} color={props.color} />
                : <Iconn name="arrow-up-circle-outline" size={30} color="grey" />
            }
          </Pressable>
        </View>
      </View>
      <CustomModal isDueToday={isDueToday} setIsDueToday={setIsDueToday} modalVisible={modalVisible} setModalVisible={setModalVisible} openModal={openModal} closeModal={closeModal} />
    </>
  );
};


const styles = StyleSheet.create({
  image: {
    height: 40,
    width: 40,
  },
  addtask:{
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center'
  },
  addingtaskicon:{
    position: 'relative', 
    zIndex: 9999999 
  }
});
export default AddingTasks;
