
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Pressable, Alert, Text, Modal } from 'react-native';
import { HeadingText } from '../../common/Texts';
import { TextInputSingleLine } from '../../styled';
import Icon from 'react-native-vector-icons/FontAwesome';
import Iconfont from 'react-native-vector-icons/Fontisto';
import DateIcon from 'react-native-vector-icons/Fontisto';
import { useTasks } from '../TasksContextProvider';
import Iconfromentypo from 'react-native-vector-icons/Entypo';
import Remind from 'react-native-vector-icons/AntDesign';
import { parse, format, startOfToday, isBefore, isYesterday, isSameDay, isTomorrow } from 'date-fns';
import Cross from 'react-native-vector-icons/Entypo';
import Iconn from 'react-native-vector-icons/EvilIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp, getFirestore, doc, updateDoc } from '@react-native-firebase/firestore';
import CustomModal from '../components/screens/CustomModal';
import firestore, { firebase } from '@react-native-firebase/firestore';
import Close from 'react-native-vector-icons/EvilIcons';
import CustomReminderModal from './screens/CustomReminderModal';
import LeftChevron from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import Animated, { Easing, FadeInUp, FadeInDown } from 'react-native-reanimated'
const Editable = (props: any) => {

    const [editedText, setEditedText] = useState(props.selectedItem);
    const { allTasks, taskCompleted, setDueDateTimeReminderText, captureDateTimeReminderTime, noteContent, setNoteContent, dueDateAdded, setAllTasks, setMyDayState, docId, captureDateTimeReminderDate, myDayState, myDay, setMyDay, dueDateTimeReminderDate, selectedDueDate, dueDateTimeReminderTime, setSelectedDueDate, setDueDate, dueDateTimeReminderText } = useTasks()
    const [modalVisible, setModalVisible] = useState(false);
    const [dateTimeModalVisible, setDateTimeModalVisible] = useState(false)
    const userCollection = firestore().collection('users');
    const [editableDueDate, setEditableDueDate] = useState(dueDateAdded)
    const [editableDueDateText, setEditableDueDateText] = useState('')
    const [editableDateTimeDateReminder, setEditableDateTimeDateReminder] = useState(captureDateTimeReminderDate)
    const [editableDateTimeTimeReminder, setEditableDateTimeTimeReminder] = useState(captureDateTimeReminderTime)
    const navigation = useNavigation();
    const handleSave = async (docId) => {
        await saveNoteToFirestore();
        if (editableDueDate === '') {
            // Clear the dateSet in Firestore
            try {
                const taskRef = userCollection.doc(docId);
                await taskRef.update({ dateSet: '', name: editedText, myDay: myDayState, timeReminder: editableDateTimeTimeReminder, dateReminder: editableDateTimeDateReminder });
                console.log('Due date removed successfully from Firestore.');
                // Update local state if using Context API
                setAllTasks((prevTasks) =>
                    prevTasks.map((task) =>
                        task.firestoreDocId === docId ? { ...task, dateSet: '' } : task
                    )
                );
            } catch (error) {
                console.error('Error removing due date from Firestore:', error);
                // Handle errors gracefully
            }
        } else {
            // Proceed with saving the changes
            const parsedDate = parse(editableDueDate, 'dd/MM/yyyy', new Date());
            let formattedDate = '';
            if (parsedDate) {
                formattedDate = format(parsedDate, 'dd/MM/yyyy');
            } else {
                // Handle parsing error, e.g., show an alert
                console.error('Invalid due date format:', editableDueDate);
            }

            try {
                const taskRef = userCollection.doc(docId);
                await taskRef.set(
                    { name: editedText, myDay: myDayState, dateSet: formattedDate, timeReminder: editableDateTimeTimeReminder, dateReminder: editableDateTimeDateReminder },
                    { merge: true }
                );
                console.log('Task updated successfully.');
                // Update local state if using Context API
                setAllTasks((prevTasks) =>
                    prevTasks.map((task) =>
                        task.firestoreDocId === docId
                            ? { ...task, name: editedText, myDay: myDayState, dateSet: formattedDate, timeReminder: editableDateTimeTimeReminder, dateReminder: editableDateTimeDateReminder }
                            : task
                    )
                );
            } catch (error) {
                console.error('Error updating task:', error);
                // Handle errors gracefully
            }
        }
    };

    const openModal = () => {
        setModalVisible(true);
    };

    const handleDueDateSelected = (dueDateText, dueDate) => {
        setEditableDueDateText(dueDateText);
        setModalVisible(false);
        setEditableDueDate(dueDate);
    }

    const handleReminderDuedateTime = (dueDateTimeText, dueDateTimeHour, dueDateTimeformatted) => {
        setDueDateTimeReminderText(dueDateTimeText)
        setEditableDateTimeTimeReminder(dueDateTimeHour)
        setEditableDateTimeDateReminder(dueDateTimeformatted)
        setDateTimeModalVisible(false)
    }
    const renderDateConditional = () => {
        if (!editableDueDate) {
            return <HeadingText
                textString={'Add due date'}
                marginLeft={25}
                fontSize={16}
                color='grey' />
        } else {
            const currentDate = startOfToday();
            const parsedDate = parse(editableDueDate, "dd/MM/yyyy", new Date());
            const currentYear = new Date().getFullYear();
            const isCurrentYear = parsedDate.getFullYear() === currentYear;
            const iconColor = isBefore(parsedDate, currentDate) || isYesterday(parsedDate)
                ? "#C02136"
                : isSameDay(parsedDate, currentDate)
                    ? "#71A6D2" // Your original color for today
                    : "grey";
            return (
                <>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                        {isBefore(parse(editableDueDate, 'dd/MM/yyyy', new Date()), startOfToday()) ? (
                            <Text style={styles.overdueTag}>
                                {isYesterday(parse(editableDueDate, 'dd/MM/yyyy', new Date())) ? (
                                    `Due Yesterday`
                                ) : (
                                    `Due ${format(parse(editableDueDate, 'dd/MM/yyyy', new Date()), 'EEE, MMM d')}`
                                )}
                            </Text>
                        ) : isSameDay(parse(editableDueDate, 'dd/MM/yyyy', new Date()), startOfToday()) ? (
                            <Text style={styles.dueTodayTag}>Due Today</Text>
                        ) : isTomorrow(parse(editableDueDate, 'dd/MM/yyyy', new Date())) ? (
                            <Text style={styles.dueTomorrowTag}>Due Tomorrow</Text>
                        ) : (
                            !isCurrentYear ?
                                <Text style={styles.dueTomorrowTag}>{format(parsedDate, "EEE, MMM d, yyyy")}</Text> // Year included for non-current years (past and future)
                                :
                                <Text style={styles.dueTomorrowTag}>{format(parsedDate, "EEE, MMM d")}</Text>
                        )}
                    </View>
                </>
            );
        }
    };

    const renderRemindMeText = () => {
        if (!editableDateTimeDateReminder) {
            return <HeadingText
                textString={'Remind me'}
                marginLeft={25}
                fontSize={16}
                color='grey' />
        } else {
            const parsedDate = parse(editableDateTimeDateReminder, "dd/MM/yyyy", new Date());
            const currentYear = new Date().getFullYear();
            const isCurrentYear = parsedDate.getFullYear() === currentYear;
            const formattedTime = editableDateTimeTimeReminder || '';
            const dateText = isBefore(parse(editableDateTimeDateReminder, 'dd/MM/yyyy', new Date()), startOfToday())
                ? isYesterday(parse(editableDateTimeDateReminder, 'dd/MM/yyyy', new Date())) ? 'Yesterday'
                    : format(parse(editableDateTimeDateReminder, 'dd/MM/yyyy', new Date()), 'EEE, MMM d')
                : isSameDay(parse(editableDateTimeDateReminder, 'dd/MM/yyyy', new Date()), startOfToday()) ? 'Today'
                    : isTomorrow(parse(editableDateTimeDateReminder, 'dd/MM/yyyy', new Date())) ? 'Tomorrow'
                        : !isCurrentYear ? format(parsedDate, "EEE, MMM d, yyyy")
                            : format(parsedDate, "EEE, MMM d");
            return (
                <>
                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', flex: 1 }}>
                        <Text style={{ color: '#71A6D2', fontSize: 16, marginLeft: 25 }}>{`Remind me at ${formattedTime}`}</Text>
                        <Text style={styles.dueTomorrowTag}>{dateText}</Text>
                    </View>
                </>
            )
        }
    };

    const handleCrossMarkPress = () => {
        setEditableDueDate('');
        setEditableDueDateText('');
    };

    const handleReminder = () => {
        setEditableDateTimeDateReminder('')
        setEditableDateTimeTimeReminder('')
    }
    const saveNoteToFirestore = async () => {
        if (docId && noteContent.trim() !== '') {
            try {
                const taskRef = userCollection.doc(docId);
                await taskRef.update({ note: noteContent });
                console.log('Note updated successfully.');
            } catch (error) {
                console.error('Error updating note:', error);
            }
        }
    };
    return (
        <>
            {/* <Animated.View entering={FadeInUp.duration(500).easing(Easing.ease)} exiting={FadeInDown}>
        <Modal visible={props.editableModal}> */}
            <View style={styles.container}>
                <View style={styles.taskContainer}>
                    <View style={styles.editablecontainer}>
                        {/* <Pressable onPress={() => navigation.goBack()}>
                        <LeftChevron name="left" size={22} color="grey" style={{ color: 'black' }}/>
                        </Pressable>
                    */}
                        <Icon name="circle-thin" size={27} color="grey" />
                        <TextInputSingleLine
                            onChangeText={(text) => setEditedText(text)}
                            value={editedText}
                            placeholder={'Add task'}
                            maxLength={30}
                            color={'grey'}
                            ref={props.inputRef}
                            style={{ paddingLeft: 15 }}
                            textDecorationLine={taskCompleted ? "line-through" : ''}
                        />
                    </View>
                    <Pressable style={{ backgroundColor: props.color, paddingHorizontal: 7, paddingVertical: 5, borderRadius: 5 }} onPress={() => { handleSave(docId); }}>
                        <HeadingText
                            textString={'save'}
                            fontSize={12}
                            fontFamily="SuisseIntl"
                            textDecorationLine="none"
                            color='white'
                        />
                    </Pressable>
                </View>
                <View style={styles.secondContainer}>
                    <View style={styles.addtomyday}>
                        <Pressable style={{ flexDirection: 'row', justifyContent: 'flex-start', width: 120, flex: 1 }} onPress={() => setMyDayState((prev) => !prev)}>
                            <Iconfont name="day-sunny" size={20} color={'grey' } />
                            <HeadingText
                                textString={myDayState ? 'Added to My Day' : 'Add to My Day'}
                                fontSize={16}
                                textDecorationLine="none"
                                color={myDayState ? '#71A6D2' : 'grey'}
                                marginLeft={25}
                            />
                        </Pressable >
                        {myDayState && <Cross name="cross" size={22} color="grey" />}
                    </View>

                    <View style={styles.addtoduedate}>
                        <Pressable style={{ flexDirection: 'row', justifyContent: 'flex-start', width: 120, flex: 1 }} onPress={openModal}>
                            <DateIcon name="date" size={20} color={'grey'} />
                            {renderDateConditional()}
                        </Pressable>
                        {editableDueDate && <Cross name="cross" size={22} color="grey" onPress={handleCrossMarkPress} />}
                    </View>
                    <View style={styles.addtoduedate} >
                        <Pressable style={{ flexDirection: 'row', justifyContent: 'flex-start', width: 120, flex: 1, alignItems: 'center' }} onPress={() => setDateTimeModalVisible(true)}>
                            <Remind name="retweet" size={20} color="grey" />

                            {renderRemindMeText()}
                            {editableDateTimeDateReminder && <Cross name="cross" size={22} color="grey" onPress={handleReminder} />}
                        </Pressable>
                    </View>
                </View>
                <View style={styles.addNote}>
                    <TextInputSingleLine
                        onChangeText={setNoteContent}
                        value={noteContent}
                        placeholder={'Add Note'}
                        color={'grey'}
                    />
                </View>
            </View>
            <View>
            

                <CustomModal  allTasks={allTasks} selectedDueDate={selectedDueDate} onDueDateSelected={handleDueDateSelected} modalVisible={modalVisible} setModalVisible={setModalVisible} />
                <CustomReminderModal
                    dateTimeModalVisible={dateTimeModalVisible}
                    setDateTimeModalVisible={setDateTimeModalVisible}
                    handleReminderDuedateTime={handleReminderDuedateTime}
                />
            </View>
            {/* </Modal>
            </Animated.View> */}
        </>
    );
};


const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
    dueTodayTag: {
        // Adjust appearance as desired, e.g.,
        color: '#71A6D2',
        fontSize: 16,
        fontWeight: '400',
        marginLeft: 25
    },
    editablecontainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flex: 1,
    },
    overdueTag: {
        color: '#C02136',
        fontSize: 16,
        fontWeight: '400',
        marginLeft: 25
    },
    taskContainer: {
        elevation: 4,
        paddingHorizontal: 10,
        flexDirection: 'row',
        marginBottom: 6,

        backgroundColor: 'white',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.6,
        height: 70,
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    dueTomorrowTag: {
        color: 'grey',
        fontSize: 14,
        fontWeight: '400',
        marginLeft: 25
    },
    image: {
        width: 20,
        height: 20,
    },
    addtomyday: {
        elevation: 2,
        marginVertical: 6,
        backgroundColor: 'white',
        paddingVertical: 6,
        height: 50,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        borderBottomWidth: 0.2,
        borderBottomColor: 'grey',
        borderRadius: 2
    },
    addtoduedate: {
        elevation: 2,
        marginVertical: 6,
        backgroundColor: 'white',
        paddingVertical: 6,
        height: 50,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        borderBottomWidth: 0.2,
        borderBottomColor: 'grey',
        borderRadius: 2
    },
    secondContainer: {
        paddingHorizontal: 10,
    },
    addNote: {
        elevation: 2,
        backgroundColor: 'white',
        height: 200,
        width: '100%',
        borderBottomWidth: 0.2,
        borderBottomColor: 'grey',
        borderRadius: 2,
        flex: 1
    }
})
export default Editable;
