import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Pressable, Alert, Text, Modal } from 'react-native';
import { HeadingText } from '../../common/Texts';
import { TextInputSingleLine } from '../../styled';
import Icon from 'react-native-vector-icons/FontAwesome';
import Iconfont from 'react-native-vector-icons/Fontisto';
import DateIcon from 'react-native-vector-icons/Fontisto';
import { useTasks } from '../TasksContextProvider';
import Remind from 'react-native-vector-icons/AntDesign';
import { parse, format, startOfToday, isBefore, isYesterday, isSameDay, isTomorrow } from 'date-fns';
import Cross from 'react-native-vector-icons/Entypo';
import { initializeApp, getFirestore, doc, updateDoc } from '@react-native-firebase/firestore';
import CustomModal from '../components/screens/CustomModal';
import firestore, { firebase } from '@react-native-firebase/firestore';
import Snackbar from 'react-native-snackbar';
import CustomReminderModal from './screens/CustomReminderModal';
import { useNavigation } from '@react-navigation/native';
import Animated, { Easing, FadeInUp, FadeInDown, FadeOut, FadeIn, SlideInUp, SlideInDown, SlideOutUp } from 'react-native-reanimated'
import notifee, { EventType, TimestampTrigger, TriggerType } from '@notifee/react-native';
import auth, { FirebaseAuthError } from '@react-native-firebase/auth';
const Editable = (props: any) => {

    const [editedText, setEditedText] = useState(props.selectedItem);
    const { allTasks, taskCompleted, setDueDateTimeReminderText, captureDateTimeReminderTime, 
        noteContent, setNoteContent, dueDateAdded, setAllTasks, setMyDayState, docId, captureDateTimeReminderDate, 
        myDayState, myDay, setMyDay, dueDateTimeReminderDate, selectedDueDate, dueDateTimeReminderTime, 
        setSelectedDueDate, setDueDate, dueDateTimeReminderText,notesScreen } = useTasks()
    const [modalVisible, setModalVisible] = useState(false);
    const [dateTimeModalVisible, setDateTimeModalVisible] = useState(false)
    const userId = auth().currentUser.uid;
    const userCollection = firestore().collection('users').doc(userId).collection('tasks');
    const [editableDueDate, setEditableDueDate] = useState(dueDateAdded)
    const [editableDueDateText, setEditableDueDateText] = useState('')
    const [editableDateTimeDateReminder, setEditableDateTimeDateReminder] = useState(captureDateTimeReminderDate)
    const [editableDateTimeTimeReminder, setEditableDateTimeTimeReminder] = useState(captureDateTimeReminderTime)
    const navigation = useNavigation();
    const [editableNote, setEditableNote] = useState(noteContent)
    async function onBackgroundEvent(event) {
        if (event.type === EventType.DISMISSED) {
            console.log('User dismissed notification', event.notification);
        } else if (event.type === EventType.PRESS) {
            console.log('User pressed notification', event.notification);
        }
    }
    notifee.onBackgroundEvent(onBackgroundEvent);

   
    const handleSave = async (docId) => {
        // Handle notification if reminder fields are filled

        onDisplayNotification(editableDateTimeDateReminder, editableDateTimeTimeReminder, editedText);


        const updatedData = {
            name: editedText || '', // Set empty string for empty name
            myDay: myDayState,
            dateSet: editableDueDate ? format(parse(editableDueDate, 'dd/MM/yyyy', new Date()), 'dd/MM/yyyy') : '', // Handle empty or invalid due date
            timeReminder: editableDateTimeTimeReminder || '', // Set empty string for empty time reminder
            dateReminder: editableDateTimeDateReminder || '', // Set empty string for empty date reminder
            Note: editableNote || '', // Set empty string for empty note
        };

        try {
            const taskRef = userCollection.doc(docId);
            await taskRef.set(updatedData, { merge: true });
            Snackbar.show({
                text: 'Task updated successfully!',
            });
            console.log('Task updated successfully.');

            // Update local state if using Context API (assuming setAllTasks exists)
            setAllTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.firestoreDocId === docId ? { ...task, ...updatedData } : task
                )
            );
        } catch (error) {
            console.error('Error updating task:', error);
            // You can optionally show a user-friendly error message here
        }
    };
    async function onDisplayNotification(dueDateTimeReminderDatee, dueDateTimeReminderTimee, taskName) {
        // Request permissions (required for iOS)
        console.log('dueDateTimeReminderDatee & dueDateTimeReminderTimee', dueDateTimeReminderDatee, dueDateTimeReminderTimee)
        console.log('dueDateTimeReminderDatee', dueDateTimeReminderDatee)
        try {
            await notifee.requestPermission()

            if (!dueDateTimeReminderDatee || !dueDateTimeReminderTimee) {
                console.error('Reminder date or time is not provided');
                return;
            }
            const dateParts = dueDateTimeReminderDatee.split('/');
            const timeParts = dueDateTimeReminderTimee.split(':');

            if (dateParts.length !== 3 || timeParts.length !== 2) {
                console.error('Invalid date or time format');
                return;
            }
            const year = parseInt(dateParts[2], 10);
            const month = parseInt(dateParts[1], 10) - 1; // Adjust for 0-index
            const day = parseInt(dateParts[0], 10);
            const hours = parseInt(timeParts[0], 10);
            const minutes = parseInt(timeParts[1], 10);

            const notificationDateTime = new Date(year, month, day, hours, minutes);

            if (isNaN(notificationDateTime.getTime())) {
                console.error('Invalid reminder date or time');
                return;
            }

            const trigger: TimestampTrigger = {
                type: TriggerType.TIMESTAMP,
                timestamp: notificationDateTime.getTime(), // Scheduled time
            };

            const channelId = await notifee.createChannel({
                id: 'default',
                name: 'Default Channel',
            });

            // Display a notification

            await notifee.createTriggerNotification(
                {
                    title: 'Reminder',
                    body: `${taskName}\nscheduled at ${dueDateTimeReminderTimee}`,
                    android: {
                        channelId,
                    },
                    id: channelId

                },
                trigger,
            );

        } catch (error) {
            console.log('error in notification', error)
        }

    }
    useEffect(() => {
        const unsubscribe = userCollection.onSnapshot(snapshot => {
            const tasks = snapshot.docs.map(doc => ({
                firestoreDocId: doc.id,

                ...doc.data(),
            }));
            setAllTasks(tasks);
            console.log('alltasks friom editable', allTasks)
        });

        return () => unsubscribe();
    }, []);

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

    const taskRef = userCollection.doc(docId);

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
                            <Text style={{
                                color: '#001d76',
                                fontSize: 16,
                                fontWeight: '400',
                                marginLeft: 25
                            }}>Due Today</Text>
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
                        <Text style={{ color: '#001d76', fontSize: 16, marginLeft: 25 }}>{`Remind me at ${formattedTime}`}</Text>
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

    const handleReminder = async () => {
        setEditableDateTimeDateReminder('')
        setEditableDateTimeTimeReminder('')
    }


    console.log('allTasks from editable', allTasks)
    return (
        <>

            <Animated.View style={styles.container} entering={SlideInDown.duration(200).easing(Easing.ease)} exiting={SlideInUp.duration(200).easing(Easing.ease)}>
                <View style={styles.taskContainer}>
                    <View style={styles.editablecontainer}>

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
                    <Pressable style={{ backgroundColor: '#001d76', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 5 }} onPress={() => { handleSave(docId); }}>
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
                            <Iconfont name="day-sunny" size={20} color={'grey'} />
                            <HeadingText
                                textString={myDayState ? 'Added to My Day' : 'Add to My Day'}
                                fontSize={16}
                                textDecorationLine="none"
                                color={myDayState ? '#001d76' : 'grey'}
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
                    <TextInput
                        onChangeText={(text) => setEditableNote(text)}
                        value={editableNote}
                        placeholder={'Add Note'}
                        returnKeyType="done"
                        blurOnSubmit={false}
                        multiline
                        style = {{fontSize:15}}
                        textAlignVertical="top"
                        
                    />
                </View>
               
            </Animated.View>
            <View>


                <CustomModal allTasks={allTasks} selectedDueDate={selectedDueDate} onDueDateSelected={handleDueDateSelected} modalVisible={modalVisible} setModalVisible={setModalVisible} />
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
        fontSize: 16,
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
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
       

    }
})
export default Editable;

