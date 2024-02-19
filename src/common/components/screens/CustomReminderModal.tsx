import { StyleSheet, View, Modal, TouchableWithoutFeedback, Image, TouchableOpacity, Text } from 'react-native'
import React, { useState } from 'react'
import { HeadingText } from '../../Texts';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format, addDays, startOfDay, getDay, addHours, startOfToday, isAfter, isBefore, parse, isYesterday, isSameDay, isTomorrow, startOfTomorrow } from 'date-fns';
import { useTasks } from '../../TasksContextProvider';
import CalendarToday from 'react-native-vector-icons/AntDesign'
import CalendarTomorrow from 'react-native-vector-icons/FontAwesome';
import CalendarPick from 'react-native-vector-icons/FontAwesome';
const CustomModal = (props: {
    dateTimeModalVisible: any;
    setDateTimeModalVisible: any;
    handleReminderDuedateTime: any;
}) => {
    // const [date, setDate] = useState(new Date());
    // const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    // const { dueDate, setDueDate } = useTasks();
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const {setDueDateTimeDisplay} = useTasks()
    const [date, setDate] = useState(new Date());
    const closeModal = () => {
        props.setDateTimeModalVisible(false);
    };
    const showDateTimePicker = () => {
        setDatePickerVisibility(true);
    };

    // const hideDatePicker = () => {
    //     setDatePickerVisibility(false);
    // };

    const handleConfirm = (date) => {
       const timeFromDateTimePicker =  format(date, 'HH:mm') //12:00
        const formattedDate = format(date, 'dd/MM/yyyy'); // 15/02/2024
        const formattedDueDateText = `${format(date, 'EEE, MMM d')}`; //thu, feb 15
        let textFromDateTimePicker = `Remind me at ${timeFromDateTimePicker} ${formattedDueDateText}`
        setDueDateTimeDisplay(textFromDateTimePicker)
        props.handleReminderDuedateTime(textFromDateTimePicker,timeFromDateTimePicker,formattedDate)
        hideDatePicker();
        closeModal();
    };

 

    const currentTime = new Date();
    const formattedTime = currentTime.toLocaleTimeString('en-US', { hour12: false });

    const hours = parseInt(formattedTime.split(':')[0]);
    const newHours = (hours + 3) % 24;
    const timeWithAddedHours = `${newHours.toString().padStart(2, '0')}:00`;
    console.log(`Current time + 3 hours: ${timeWithAddedHours}`);

   
    const formatDateToDayOfWeek = (selectedDateTime: any) => {
        const options = { weekday: 'long' };
        const dayOfWeek = selectedDateTime?.toLocaleDateString('en-US', options);
        return dayOfWeek?.split(',')[0].slice(0, 3);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const today = date;
    const formattedToday = format(today, 'dd/MM/yyyy');

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const formattedTomorrow = format(tomorrow, 'dd/MM/yyyy')
    const tomorrowAtNine = addHours(addDays(startOfDay(new Date()), 1), 9);
    const formattedTomorrowAtNine = format(tomorrowAtNine, 'HH:mm');
    console.log('tomat9',formattedTomorrowAtNine) //tom at 9:00
    const todayNinePM = addHours(startOfToday(), 21);
    // Check if the current time is after 21:00
    const isDisabled = isAfter(currentTime, todayNinePM);
   
    return (
        <View>
            <Modal
                animationType="fade"
                transparent={true}
                visible={props.dateTimeModalVisible}
                onRequestClose={() => {
                    props.setDateTimeModalVisible(false);

                }}>
                <TouchableWithoutFeedback onPress={closeModal}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <TouchableOpacity disabled={isDisabled} onPress={() => {props.handleReminderDuedateTime(`Remind me at ${timeWithAddedHours} today`,timeWithAddedHours,formattedToday) }}
                            >
                                <View style={[styles.modalcontainer, isDisabled && styles.disabledOption]}>
                                    <CalendarToday name='calendar' size={22} style={{ marginVertical: 10 }} />
                                    <HeadingText
                                        textString={`Later today ${isDisabled ? '' : `(${timeWithAddedHours})`}`}
                                        fontSize={16}
                                        fontFamily="SuisseIntl"
                                        marginLeft={10}
                                        marginVertical={10}
                                    />
                                </View>

                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { props.handleReminderDuedateTime(`Remind me at 09:00 tomorrow`,formattedTomorrowAtNine,formattedTomorrow) }}>
                                <View style={styles.modalcontainer}>

                                    <CalendarTomorrow name="calendar-plus-o" size={22} style={{ marginVertical: 10 }} />
                                    <HeadingText
                                        textString={`Tomorrow (${formatDateToDayOfWeek(tomorrow)} 9:00)`}
                                        fontSize={16}

                                        fontFamily="SuisseIntl"
                                        marginLeft={10}
                                        marginVertical={10}
                                    />
                                </View>

                            </TouchableOpacity>
                            <TouchableOpacity onPress={showDateTimePicker}>
                                <View style={styles.modalcontainer}>
                                    <CalendarPick name="calendar-check-o" size={22} style={{ marginVertical: 10 }} />
                                    <HeadingText
                                        textString={`Pick a date & time`}
                                        fontSize={16}
                                        fontFamily="SuisseIntl"
                                        marginLeft={10}
                                        marginVertical={10}
                                    />
                                </View>
                            </TouchableOpacity>
                            
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode='datetime'
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
        </View>
    )
}

export default CustomModal

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-start',

    },
    disabledOption: {
        opacity: 0.5,
        color: 'red' // Reduce opacity to visually indicate the option is disabled
    },
    todayContainer: {
        backgroundColor: '#f0ffe0', // Green color for Today
    },
    tomorrowContainer: {
        backgroundColor: '#f8f8f8', // Light grey color for Tomorrow
    },
    modalView: {

        backgroundColor: 'white',
        borderRadius: 10,
        bottom: 120,
        left: 130,
        padding: 10,
        alignItems: 'flex-start',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: 230,
        height: 'auto',
        flexDirection: 'column',
        marginLeft: 20
    },
    dueTodayContainer: {
        backgroundColor: 'purple',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    dueTodayText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalcontainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
});