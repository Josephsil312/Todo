import { Text, View, Keyboard, TouchableOpacity, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { TextInputSingleLine } from '../../../styled';
import { HeadingText } from '../../Texts';
import CustomModal from './CustomModal';
import Iconn from 'react-native-vector-icons/Ionicons';
import Close from 'react-native-vector-icons/EvilIcons';
import { useTasks } from '../../TasksContextProvider';
const AddingTasks = (props: {
  setTask: (arg0: any) => any;
  task: any;
  handleAddTask: (() => void) | undefined;
  color: any;

}) => {
  const [modalVisible, setModalVisible] = useState(false);
  
  const textInputRef = useRef(null);
  const { allTasks, setAllTasks,selectedDueDate,setSelectedDueDate,dueDate,setDueDate } = useTasks();

  const openModal = () => {
    setModalVisible(true);
  };

  
  const handleDueDateSelected = (dueDateText,dueDate) => {
    setSelectedDueDate(dueDateText);
    setModalVisible(false);
    Keyboard.dismiss();
    onFocusHandler();
    setDueDate(dueDate);
  }

  const onFocusHandler = () => {
    setTimeout(() => textInputRef.current && textInputRef.current.focus(), 250)
  }

  useEffect(() => {
    onFocusHandler();
  }, []);

  console.log('selectedDueDate',selectedDueDate)
  return (
    <>
    <View style = {{marginHorizontal:5}}>
    <View style={{ flexDirection: 'row', alignItems: 'center',justifyContent:'space-between' }}>
        <TextInputSingleLine
          onChangeText={(text: any) => props.setTask(text)}
          value={props.task}
          placeholder={'Add task'}
          maxLength={256}
          color={'grey'}
          ref={textInputRef}
          
        />
        <Pressable onPress={props.handleAddTask} style={styles.addingtaskicon}>
          {
            props.task.trim() !== ''
              ? <Iconn name="arrow-up-circle" size={30} color={props.color} />
              : <Iconn name="arrow-up-circle-outline" size={30} color="grey" />
          }
        </Pressable>
      </View>
      
        <TouchableOpacity onPress={openModal}>
          <View style={styles.addtask}>
         
          <HeadingText
            textString={selectedDueDate || 'Set Due Date'}
            fontSize={16}
            fontWeight="500"
            fontFamily="SuisseIntl"
            marginVertical={10}
            style={selectedDueDate ? styles.dueDates : {}}
          >
          {selectedDueDate && <Close name="close-o" size={20} color="white" style={{paddingHorizontal:5}}/>}
          </HeadingText>
          <Text>Hiii</Text>
          </View>
         
        </TouchableOpacity>
    </View>
      <CustomModal allTasks={allTasks} selectedDueDate={selectedDueDate} onDueDateSelected={handleDueDateSelected} modalVisible={modalVisible} setModalVisible={setModalVisible} />
    </>
  );
};


const styles = StyleSheet.create({
  image: {
    height: 40,
    width: 40,
  },
  addtask: {
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems:"center",
    padding:15,
    flexWrap: 'wrap'
  },
 
  addingtaskicon: {
    position: 'relative',
    zIndex: 9999999
  },
  addtaskContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 60,
    flex: 1,
  },
  dueDates: {
    backgroundColor: '#7568f8',
    borderRadius: 10,
    paddingHorizontal:17,       /* Added padding */
    color: 'white',
    textAlign: 'center',
    width: 'auto',             /* Optional: Adjust width as needed */  /* Optional: For better contrast */
    
    textShadowRadius: 1,
  }
});
export default AddingTasks;
