import { StyleSheet, View, Modal, TouchableWithoutFeedback, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { HeadingText } from '../../Texts';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format, addDays, startOfDay, getDay } from 'date-fns';
import { useTasks } from '../../TasksContextProvider';
import CalendarToday from 'react-native-vector-icons/AntDesign'
import CalendarTomorrow from 'react-native-vector-icons/FontAwesome';
import CalendarPick from 'react-native-vector-icons/FontAwesome';
const CustomModal = (props: {
    modalVisible: boolean;
    setModalVisible: any;
    onDueDateSelected: any;
    selectedDueDate: any;
    allTasks: any;
}) => {
    const [date, setDate] = useState(new Date());
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const { dueDate, setDueDate } = useTasks();
    const closeModal = () => {
        props.setModalVisible(false);
    };
    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        const formattedDate = format(date, 'dd/MM/yyyy');
        const formattedDueDateText = `Due on ${format(date, 'EEE, MMM d')}`;
        props.onDueDateSelected(formattedDueDateText, formattedDate);
        hideDatePicker();
        setDueDate(formattedDate)
        closeModal();
    };

    const formatDateToDayOfWeek = (selectedDate: any) => {
        const options = { weekday: 'long' };
        const dayOfWeek = selectedDate?.toLocaleDateString('en-US', options);
        return dayOfWeek?.split(',')[0];
    };

    const today = date;

    const tomorrow = new Date(today);

    tomorrow.setDate(today.getDate() + 1);
    const formattedToday = format(today, 'dd/MM/yyyy'); // Note the capitalization for month
    const formattedTomorrow = format(tomorrow, 'dd/MM/yyyy')
    return (
        <View>
            <Modal
                animationType="fade"
                transparent={true}
                visible={props.modalVisible}
                onRequestClose={() => {
                    props.setModalVisible(false);

                }}>
                <TouchableWithoutFeedback onPress={closeModal}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <TouchableOpacity onPress={() => props.onDueDateSelected('Due Today', formattedToday)}>
                                <View style={styles.modalcontainer}>
                                    <CalendarToday name='calendar' size={22} style={{ marginVertical: 10 }} />
                                    <HeadingText
                                        textString={`Today (${formatDateToDayOfWeek(today)})`}
                                        fontSize={16}
                                        fontWeight="500"
                                        fontFamily="SuisseIntl"
                                        marginLeft={10}
                                        marginVertical={10}
                                    />
                                </View>

                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => props.onDueDateSelected('Due Tomorrow', formattedTomorrow)}>
                                <View style={styles.modalcontainer}>

                                    <CalendarTomorrow name = "calendar-plus-o" size = {22} style={{ marginVertical: 10 }} />
                                    <HeadingText
                                        textString={`Tomorrow (${formatDateToDayOfWeek(tomorrow)})`}
                                        fontSize={16}
                                        fontWeight="500"
                                        fontFamily="SuisseIntl"
                                        marginLeft={10}
                                        marginVertical={10}
                                    />
                                </View>

                            </TouchableOpacity>
                            <TouchableOpacity onPress={showDatePicker}>
                                <View style={styles.modalcontainer}>
                                    <CalendarPick name="calendar-check-o" size={22} style={{ marginVertical: 10 }} />
                                    <HeadingText
                                        textString={`Pick a date`}
                                        fontSize={16}
                                        fontWeight="500"
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
                mode="date"
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
    todayContainer: {
        backgroundColor: '#f0ffe0', // Green color for Today
    },
    tomorrowContainer: {
        backgroundColor: '#f8f8f8', // Light grey color for Tomorrow
    },
    modalView: {
        marginBottom: '25%',
        backgroundColor: 'white',
        borderRadius: 10,
        
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