import { Text, View, Keyboard, TouchableOpacity, Pressable, StyleSheet, ScrollView } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { TextInputSingleLine } from '../../../styled';
import { HeadingText } from '../../Texts';
import CustomModal from './CustomModal';
import Iconn from 'react-native-vector-icons/Ionicons';
import Close from 'react-native-vector-icons/AntDesign';
import { useTasks } from '../../TasksContextProvider';
import Remind from 'react-native-vector-icons/AntDesign';
import CustomReminderModal from './CustomReminderModal';
import Calendarr from 'react-native-vector-icons/AntDesign';

const AddingTasks = (props: {
  setTask: (arg0: any) => any;
  task: any;
  handleAddTask: (() => void) | undefined;
  color: any;

}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [dateTimeModalVisible, setDateTimeModalVisible] = useState(false)
  const textInputRef = useRef(null);
  const { allTasks, selectedItem, setDueDateTimeReminderText, dueDateTimeDisplay, selectedDueDate, dueDateTimeReminderDate, setSelectedDueDate, setDueDate, dueDateTimeReminderText, dueDateTimeReminderTime, setDueDateTimeReminderTime, setDueDateTimeReminderDate } = useTasks();


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


  const handleReminderDuedateTime = (dueDateTimeText, dueDateTimeHour, dueDateTimeformatted) => {
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

        {/* <View style={styles.addtask}> */}
        <ScrollView
          horizontal
          contentContainerStyle={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: "center",
            height: 40,
            width: '100%'
          }}
        >
          <TouchableOpacity onPress={openModal}>
            <View style={{ flexDirection: 'row', paddingLeft: 5, justifyContent: 'space-between', borderRadius: 15, backgroundColor: '#71A6D2', alignItems: 'center' }}>
              <Calendarr name="calendar" size={19} color={'white'} style={{ marginRight: 3 }} />

              <HeadingText
                textString={
                  (selectedDueDate || 'Set Due Date')
                }
                fontSize={14}
                fontFamily="SuisseIntl"
                style={styles.dueDates}
                color='white' />
              {selectedDueDate && <Close name="closecircle" style={{paddingRight: 5 }} size={15} color={'white'} onPress={() => { setDueDate(''); setSelectedDueDate('') }} />}
              {/* </HeadingText> */}

            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={openDateTimeModal}>
            <View style={{ flexDirection: 'row', paddingLeft: 5, justifyContent: 'flex-start', borderRadius: 15, backgroundColor: '#71A6D2', alignItems: 'center' }}>
              <Remind name="bells" size={20} color="white" />
              <HeadingText
                textString={((dueDateTimeReminderText) || 'Remind me')}
                fontSize={14}
                textDecorationLine="none"
                color='white'
                style={styles.reminder}
              />
              {dueDateTimeReminderText && <Close name="closecircle" size={15} style={{ paddingRight: 5 }} color="white" onPress={() => { setDueDateTimeReminderText(''); setDueDateTimeReminderTime(''); setDueDateTimeReminderDate('') }} />}

            </View>
          </TouchableOpacity>

        </ScrollView>

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
  addtask: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: "center",
    height: 50,
  },

  addingtaskicon: {
    position: 'relative',
    zIndex: 9999999
  },
  dueDates: {
    borderRadius: 10,
    paddingLeft: 7,
    color: 'white',
    letterSpacing: 0.4,
    marginVertical: 5,
    textShadowRadius: 2,
    textShadowColor: '#5e54a0',
    paddingBottom: 5,
    paddingTop: 3,
    paddingRight: 7,
  },
  reminder: {
    borderRadius: 10,
    paddingLeft: 7,
    color: 'white',
    letterSpacing: 0.4,
    marginVertical: 5,
    textShadowRadius: 2,
    textShadowColor: '#5e54a0',
    paddingBottom: 4,
    paddingTop: 3,
    paddingRight: 7,
    maxWidth: 150,
    height:'auto'
  }

});
export default AddingTasks;
