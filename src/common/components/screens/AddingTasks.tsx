import { Text, View, Keyboard, TouchableOpacity, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { TextInputSingleLine } from '../../../styled';
import { HeadingText } from '../../Texts';
import CustomModal from './CustomModal';
import Iconn from 'react-native-vector-icons/Ionicons';
import Close from 'react-native-vector-icons/EvilIcons';
import { useTasks } from '../../TasksContextProvider';
import Remind from 'react-native-vector-icons/AntDesign';
import CustomReminderModal from './CustomReminderModal';
import notifee, { TimestampTrigger, TriggerType } from '@notifee/react-native';
const AddingTasks = (props: {
  setTask: (arg0: any) => any;
  task: any;
  handleAddTask: (() => void) | undefined;
  color: any;

}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [dateTimeModalVisible,setDateTimeModalVisible] = useState(false)
  const textInputRef = useRef(null);
  const { allTasks, selectedItem,setDueDateTimeReminderText,dueDateTimeDisplay,selectedDueDate, dueDateTimeReminderDate,setSelectedDueDate, setDueDate,dueDateTimeReminderText,dueDateTimeReminderTime,setDueDateTimeReminderTime,setDueDateTimeReminderDate } = useTasks();


  const openModal = () => {
    setModalVisible(true);
    
  };

  const openDateTimeModal = () => {
    setDateTimeModalVisible(true)

  }
  const handleDueDateSelected = (dueDateText, dueDate) => {
    setSelectedDueDate(dueDateText);
    setModalVisible(false);
    Keyboard.dismiss();
    onFocusHandler();
    setDueDate(dueDate);
  }

  
  const handleReminderDuedateTime = (dueDateTimeText,dueDateTimeHour,dueDateTimeformatted) => {
    setDueDateTimeReminderText(dueDateTimeText)
    setDueDateTimeReminderTime(dueDateTimeHour)
    setDueDateTimeReminderDate(dueDateTimeformatted)
    setDateTimeModalVisible(false)
  }
  
  
  const onFocusHandler = () => {
    setTimeout(() => textInputRef.current && textInputRef.current.focus(), 250)
  }

  useEffect(() => {
    onFocusHandler();
  }, []);

  
  console.log('dueDateTimeReminderText', dueDateTimeReminderText)
  return (
    <>
      <View style={{ marginHorizontal: 5 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
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
            <View style={{ flexDirection: 'row', backgroundColor: '#7568f8', borderRadius: 5, padding: 2 }}>
              <HeadingText
                textString={
                  (selectedDueDate || 'Set Due Date')
                }
                fontSize={16}
                fontFamily="SuisseIntl"
                marginVertical={10}
                style={selectedDueDate ? styles.dueDates : {}}
                color='white'
              />
              {selectedDueDate && <Close name="close-o" size={20} color="white" onPress={() => { setDueDate(''); setSelectedDueDate('') }} />}
            </View>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={openDateTimeModal}>
              <Remind name="retweet" size={20} color="grey" />
              <HeadingText
                textString={((dueDateTimeReminderText ) || 'Remind me')}
                fontSize={16}
                textDecorationLine="none"
                color='grey'
              />
              {dueDateTimeDisplay && <Close name="close-o" size={20} color="black" onPress={() => {setDueDateTimeReminderText('');setDueDateTimeReminderTime('');setDueDateTimeReminderDate('')}} />}
            </TouchableOpacity>
            
          </View>
        </TouchableOpacity>
      </View>
      <CustomModal allTasks={allTasks} selectedDueDate={selectedDueDate} onDueDateSelected={handleDueDateSelected} modalVisible={modalVisible} setModalVisible={setModalVisible} />
      <CustomReminderModal
      dateTimeModalVisible={dateTimeModalVisible}
      setDateTimeModalVisible={setDateTimeModalVisible}
      handleReminderDuedateTime={handleReminderDuedateTime}
    />
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
    justifyContent: 'space-between',
    alignItems: "center",
    paddingHorizontal: 12
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
    padding: 10,                      /* Overall padding for content */
    paddingHorizontal: 15,             /* Wider horizontal padding */
    color: 'white',
    textAlign: 'center',
    fontSize: 16,                      /* Ensure comfortable text size */
    lineHeight: 20,                    /* Adjust line height for readability */
    letterSpacing: 0.4,                /* Optional: Slight letter spacing */
    width: 'auto',                      /* Adjust width if needed */
    marginVertical: 5,                  /* Space above and below */
    textShadowRadius: 1,
    textShadowColor: '#5e54a0',         /* Optional: Darker shadow for contrast */
  }

});
export default AddingTasks;
