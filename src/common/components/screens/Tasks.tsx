import {
  View,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Text,
  SectionList,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import Animated, { Easing, LightSpeedInLeft, LightSpeedOutRight } from 'react-native-reanimated'
import firestore, { firebase } from '@react-native-firebase/firestore';
import React, { useState, useRef, useEffect } from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import { HeadingText } from '../../Texts';
import AddingTasks from './AddingTasks';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import Editable from '../Editable';
import Icon from 'react-native-vector-icons/FontAwesome';
import Iconn from 'react-native-vector-icons/EvilIcons';
import Calendarr from 'react-native-vector-icons/EvilIcons';
import Iconfromentypo from 'react-native-vector-icons/Entypo';
import Iconchev from 'react-native-vector-icons/Entypo';
import Plusicon from 'react-native-vector-icons/AntDesign';
import Check from 'react-native-vector-icons/AntDesign';
import { RectButton, GestureHandlerRootView, PanGestureHandler, Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useTasks } from '../../TasksContextProvider';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { isAfter, isYesterday, subDays, isSameDay, isTomorrow, parse, isBefore, format, startOfToday } from 'date-fns';
import { getFirestore, collection, addDoc } from '@react-native-firebase/firestore';
import auth, { FirebaseAuthError } from '@react-native-firebase/auth';
import Bell from 'react-native-vector-icons/EvilIcons';
import notifee, { EventType, TimestampTrigger, TriggerType } from '@notifee/react-native';
import Iconfont from 'react-native-vector-icons/Fontisto';
import SwipeableRow from './SwipableRow';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
interface Props {
  navigation: NavigationProp<ParamListBase>;
}

const Tasks = ({ navigation }: Props) => {
  const refRBSheet = useRef<RBSheet>(null);
  const refEditableTask = useRef<RBSheet>(null);

  const [completedTaskId, setCompletedTaskId] = useState(null);
  const [task, setTask] = useState('');
  const [isRBSheetOpen, setIsRBSheetOpen] = useState(false);
  const [editableModal, setEditableModal] = useState(false)
  const [expoPushToken, setExpoPushToken] = useState<string>();
  const {
    setDueDateAdded,
    showCompletedDropdown,
    myDayState,
    setMyDayState,
    setShowCompletedDropdown,
    dueDate,
    allTasks,
    setAllTasks,
    selectedItem,
    setSelectedItem,
    setDocId,
    dueDateTimeReminderTime,
    dueDateTimeReminderDate,
    setCaptureDateTimeReminderDate,
    setCaptureDateTimeReminderTime,
    setTaskCompleted,
    noteContent,
    setNoteContent
  } = useTasks();

  const [isLoading, setIsLoading] = useState(true);
  const userId = auth().currentUser.uid;
  const userCollection = firestore().collection('users').doc(userId).collection('tasks');
  // console.log('userCollectionn',userCollectionn)
  // const userCollection = firestore().collection('users')

  const handleAddTask = async () => {
    if (task.trim() !== '') {
      try {
        const newTask = {
          name: task,
          isCompleted: false,
          isImportant: false,
          dateSet: dueDate,
          myDay: isSameDay(parse(dueDate, "dd/MM/yyyy", new Date()), startOfToday()),
          timeReminder: dueDateTimeReminderTime,
          dateReminder: dueDateTimeReminderDate,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        setTask('');
        await userCollection.add({
          ...newTask
        })

      } catch (error) {
        console.error('Error adding task:', error);

      }

    }

    // if (dueDateTimeReminderDate.trim() !== '' && dueDateTimeReminderTime.trim() !== '') {
    //   onDisplayNotification(dueDateTimeReminderDate, dueDateTimeReminderTime, task);
    // }

  };

  // async function onDisplayNotification(dueDateTimeReminderDatee, dueDateTimeReminderTimee, taskName) {
  //   // Request permissions (required for iOS)
  //   try {
  //     await notifee.requestPermission()
  //     const dateParts = dueDateTimeReminderDatee.split('/');
  //     const timeParts = dueDateTimeReminderTimee.split(':');
  //     const year = parseInt(dateParts[2], 10);
  //     const month = parseInt(dateParts[1], 10) - 1; // Adjust for 0-index
  //     const day = parseInt(dateParts[0], 10);
  //     const hours = parseInt(timeParts[0], 10);
  //     const minutes = parseInt(timeParts[1], 10);

  //     const notificationDateTime = new Date(year, month, day, hours, minutes);


  //     const trigger: TimestampTrigger = {
  //       type: TriggerType.TIMESTAMP,
  //       timestamp: notificationDateTime.getTime(), // Scheduled time
  //     };

  //     const channelId = await notifee.createChannel({
  //       id: 'default',
  //       name: 'Default Channel',
  //     });

  //     // Display a notification

  //     await notifee.createTriggerNotification(
  //       {
  //         title: 'Reminder',
  //         body: `${taskName}\nscheduled at ${dueDateTimeReminderTimee}`,
  //         android: {
  //           channelId,
  //         },
  //         id: channelId

  //       },
  //       trigger,
  //     );

  //   } catch (error) {
  //     console.log('error in notification', error)
  //   }

  // }
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  // useEffect(() => {
  //   registerForPushNotificationsAsync().then((token) => setExpoPushToken(token))
  // },[])

  console.log('token from expo:',expoPushToken)
  // async function registerForPushNotificationsAsync() {
  //   let token;
  
  //   if (Platform.OS === 'android') {
  //     await Notifications.setNotificationChannelAsync('default', {
  //       name: 'default',
  //       importance: Notifications.AndroidImportance.MAX,
  //       vibrationPattern: [0, 250, 250, 250],
  //       lightColor: '#FF231F7C',
  //     });
  //   }
  
  //   if (Device.isDevice) {
  //     const { status: existingStatus } = await Notifications.getPermissionsAsync();
  //     let finalStatus = existingStatus;
  //     if (existingStatus !== 'granted') {
  //       const { status } = await Notifications.requestPermissionsAsync();
  //       finalStatus = status;
  //     }
  //     if (finalStatus !== 'granted') {
  //       Alert.alert('Failed to get push token for push notification!');
  //       return;
  //     }
     
  //     token = (await Notifications.getExpoPushTokenAsync({ projectId: 'your-project-id' })).data;
  //     console.log(token);
  //   } else {
  //     Alert.alert('Must use physical device for Push Notifications');
  //   }
  
  //   return token;
  // }
  // async function onBackgroundEvent(event) {
  //   if (event.type === EventType.DISMISSED) {
  //     console.log('User dismissed notification', event.notification);
  //   } else if (event.type === EventType.PRESS) {
  //     console.log('User pressed notification', event.notification);
  //     // Additional handling for press event
  //   }
  //   // Handle other event types as needed
  // }
  // notifee.onBackgroundEvent(onBackgroundEvent);

  useEffect(() => {
    const unsubscribe = userCollection
      .orderBy('createdAt', 'desc') // Assuming 'createdAt' is your timestamp field
      .onSnapshot(snapshot => {
        const newTasks = snapshot.docs.map(doc => ({
          firestoreDocId: doc.id,
          ...doc.data(),
        }));
        setAllTasks(newTasks);
        setIsLoading(false);
      });
    return () => unsubscribe();
  }, []);

  const deleteTask = async (id) => {
    try {
      await userCollection.doc(id).delete();
      await notifee.cancelNotification(id)
      setTask('');
    } catch (error) {
      console.error('Error deleting task from Firestore:', error);
    }
  }

  const handleCompleteTask = async (firestoreDocId) => {
    try {
      const taskRef = userCollection.doc(firestoreDocId)
      console.log('taskRef', taskRef)
      await taskRef.set({ isCompleted: true }, { merge: true });
      setCompletedTaskId(firestoreDocId);
      await notifee.cancelNotification(firestoreDocId)
      console.log('Task completed successfully.');
    } catch (error) {
      console.error('Error updating completed task:', error);
    }
  }

  const toggleCompletedDropdown = () => {
    setShowCompletedDropdown(!showCompletedDropdown);
  };

  const toggleTask = async (firestoreDocId) => {
    try {

      const taskRef = userCollection.doc(firestoreDocId);
      // show()
      await taskRef.set({ isCompleted: false }, { merge: true });
      console.log('Task toggled successfully.');
    } catch (error) {
      console.error('Error updating toggled task:', error);
    }
  }

  const starChange = async (firestoreDocId) => {
    try {
      // Get the reference to the task document in Firestore
      const taskRef = userCollection.doc(firestoreDocId);
      // Get the current value of isImportant from Firestore
      const taskSnapshot = await taskRef.get();
      const currentIsImportant = taskSnapshot.data()?.isImportant;
      // Update the isImportant property in Firestore by toggling its value
      await taskRef.update({ isImportant: !currentIsImportant });
      console.log('Star state updated successfully.');
    } catch (error) {
      console.error('Error updating star state:', error);
    }
  }

  const openRBSheet = (item: any) => {
    if (refEditableTask?.current) {
      refEditableTask.current.open();
      setIsRBSheetOpen(true)
      setSelectedItem(item)
      setMyDayState(item.myDay)
    }
  };

  const renderDateConditional = (item) => {
    const currentDate = startOfToday();
    const parsedDate = parse(item.dateSet, "dd/MM/yyyy", new Date());
    const currentYear = new Date().getFullYear();
    const isCurrentYear = parsedDate.getFullYear() === currentYear;
    const iconColor = isBefore(parsedDate, currentDate) || isYesterday(parsedDate)
      ? "#C02136"
      : isSameDay(parsedDate, currentDate)
        ? "grey" // Your original color for today
        : "grey";

    return (<>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 5 }}>

        <Calendarr name="calendar" size={15} color={iconColor} style={{ marginRight: 3 }} />

        {isBefore(parse(item.dateSet, 'dd/MM/yyyy', new Date()), startOfToday()) ? (
          <Text style={styles.overdueTag}>
            {isYesterday(parse(item.dateSet, 'dd/MM/yyyy', new Date())) ? (
              `Yesterday`
            ) : (
              `${format(parse(item.dateSet, 'dd/MM/yyyy', new Date()), 'EEE, MMM d')}`
            )}
          </Text>
        ) : isSameDay(parse(item.dateSet, 'dd/MM/yyyy', new Date()), startOfToday()) ? (
          <Text style={styles.dueTodayTag}>Today </Text>
        ) : isTomorrow(parse(item.dateSet, 'dd/MM/yyyy', new Date())) ? (
          <Text style={styles.dueTomorrowTag}>Tomorrow</Text>
        ) : (
          !isCurrentYear ?
            <Text style={styles.futuretag}>{format(parsedDate, "EEE, MMM d, yyyy")}</Text> // Year included for non-current years (past and future)
            :
            <Text style={styles.futuretag}>{format(parsedDate, "EEE, MMM d")}</Text>
        )}
        {/* {hasReminder && <Text>Reminder</Text>} */}
      </View>
    </>
    )
  }




  const sections = [
    { data: allTasks.filter((task) => !task.isCompleted) },
    { title: 'Completed Tasks', data: allTasks.filter((task) => task.isCompleted) },
  ];

  console.log('alltasks', allTasks)

  return (
    <>
      {isLoading && ( // Conditionally render the activity indicator

        <ActivityIndicator size="large" color="#001d76" />

      )}



      {isRBSheetOpen &&
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the alpha value for the darkness level
            zIndex: 1,
          }}
        />
      }


      <KeyboardAvoidingView style={styles.taskContainer} keyboardShouldPersistTaps='always'>
        {!isLoading && (
          <GestureHandlerRootView>
            <SectionList
              sections={sections}
              keyExtractor={item => item.firestoreDocId}
              renderItem={({ item }) => (
                <>

                  <SwipeableRow onDelete={() => deleteTask(item.firestoreDocId)}
                  >
                    <Animated.View entering={LightSpeedInLeft.duration(200).easing(Easing.ease)} exiting={LightSpeedOutRight.duration(200).easing(Easing.ease)}>
                      <Pressable
                        style={styles.incompletetasks}
                        onPress={() => { setNoteContent(item.Note); openRBSheet(item.name); setEditableModal(true); setTaskCompleted(item.isCompleted); setDocId(item.firestoreDocId); setMyDayState(item.myDay); setDueDateAdded(item.dateSet); setCaptureDateTimeReminderDate(item.dateReminder); setCaptureDateTimeReminderTime(item.timeReminder) }}
                      >

                        <View style={styles.icontextcontainer}>
                          {item.isCompleted ? (
                            <TouchableOpacity onPress={() => {
                              toggleTask(item.firestoreDocId);
                            }}>
                              <Check name="checkcircle" size={24} color={'#001d76'} />
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity onPress={() => handleCompleteTask(item.firestoreDocId)}>
                              {/* <Icon name="circle-thin" size={27} color="grey" style={{backgroundColor:'black'}}/>  */}
                              <Icon name="circle-thin" size={27} color="grey" />
                            </TouchableOpacity>
                          )}
                          <View style={{ height: 40, width: 2, backgroundColor: '#001d76', marginHorizontal: '4%' }}></View>
                          <View style={{ flexDirection: 'column', marginLeft: '2%', alignItems: 'flex-start', paddingLeft: 10 }}>

                            <HeadingText
                              textString={item.name}
                              fontSize={17}
                              fontFamily="SuisseIntl"
                              textDecorationLine={item.isCompleted ? "line-through" : ''}
                              color='#001d76'

                            />
                            <View style={{ flexDirection: 'row', alignItems: 'center', width: 100 }}>
                              {item.dateSet && (
                                <>
                                  {renderDateConditional(item)}
                                </>

                              )}
                              {item.myDay && <Iconfont name="day-sunny" size={15} color={'grey'} style={{ marginRight: 5 }} />}
                              {item.myDay && <HeadingText
                                textString={'My Day'}
                                fontSize={13}
                                fontFamily="SuisseIntl"
                                color='grey'
                                fontWeight={400}
                                marginRight={15}
                              />
                              }
                              {(item.timeReminder || item.dateReminder) && <Bell name="bell" size={15} color={'grey'} style={{ marginRight: 5 }} />}
                            </View>

                          </View>

                        </View>
                        <Pressable key={item.firestoreDocId} onPress={() => starChange(item.firestoreDocId)} style={{ paddingLeft: 20 }}>
                          {item.isImportant ? <Iconfromentypo name="star" size={24} color="grey" style={{ color: '#001d76' }} />
                            : <Iconn name="star" size={27} color="#001d76" />
                          }
                        </Pressable>

                      </Pressable>
                    </Animated.View>
                  </SwipeableRow>

                </>
              )}
              renderSectionHeader={({ section: { title } }) => {
                if (title) {
                  return (
                    <Pressable onPress={toggleCompletedDropdown} style={styles.completedlistlength}>
                      {/* <Animated.View style={[animatedStyle]}> */}
                      <Iconchev name="chevron-small-right" size={20} color="#001d76" />
                      {/* </Animated.View> */}
                      <HeadingText
                        textString={`Completed ${allTasks.filter((task) => task.isCompleted).length}`}
                        fontSize={16}
                        fontFamily="SuisseIntl"
                        color='#001d76'
                      />
                    </Pressable>

                  );
                } else {
                  return null;
                }
              }}
            />
          </GestureHandlerRootView>

        )}

      </KeyboardAvoidingView>

      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={false}
        closeOnPressMask={true}
        animationType="fade"
        height={70}
        isOpen={isRBSheetOpen}
        onClose={() => setIsRBSheetOpen(false)}
        customStyles={{
          wrapper: {
            backgroundColor: 'transparent',
          },
          draggableIcon: {
            backgroundColor: '#000',

          },
          container: {
            height: '26%',
          }
        }}>
        <AddingTasks
          handleAddTask={handleAddTask}
          task={task}
          setTask={setTask}
          color={'#001d76'}
        />
      </RBSheet>


      <RBSheet
        ref={refEditableTask}
        closeOnDragDown={false}
        closeOnPressMask={true}
        animationType="slide"
        height={70}
        isOpen={isRBSheetOpen}
        onClose={() => setIsRBSheetOpen(false)}
        customStyles={{
          wrapper: {
            backgroundColor: 'transparent',

          },
          draggableIcon: {
            backgroundColor: 'red',

          },
          container: {
            height: '80%',
            borderTopRightRadius: 30,

          }
        }}>
        <Editable
          selectedItem={selectedItem}
          myDayState={myDayState}
          setIsRBSheetOpen={setIsRBSheetOpen}
          color={'#001d76'}

        />
      </RBSheet>


      <View
        style={styles.addicon}>
        <Pressable
          onPress={() => {
            if (refRBSheet?.current) {
              refRBSheet.current.open();
              setIsRBSheetOpen(true);
            }
          }}>
          <Plusicon name="pluscircle" size={58} color="#001d76" style={{
            shadowColor: '#444167', elevation: 6, shadowOpacity: 0.6,
            shadowRadius: 20,
          }} />
        </Pressable>
      </View>

    </>
  );
};

const styles = StyleSheet.create({
  completedlistlength: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10
  },
  futuretag:{
    color: 'grey',
    borderRadius: 5,
    fontSize: 13,
    fontWeight: '400',
    width: 'auto',
    marginRight:8
  },
  icontextcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start',
    maxHeight: 'auto',
    padding: 2
  },
  overdueTag: {
    color: '#C02136',
    fontSize: 13,
    fontWeight: '400',
    marginRight: 15
  },
  taskContainer: {
    flexGrow: 1,
    backgroundColor: '#f1f3f4',
    padding: 10,
  },
  modalContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    padding: 10,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    width: '70%', // Set the width of the modal
    maxWidth: 300, // Set the maximum width of the modal
  },
  dueTodayTag: {
    color: 'grey',
    borderRadius: 5,
    fontSize: 13,
    fontWeight: '400',
    width: 'auto',
    marginRight: 15
  },
  dueTomorrowTag: {
    color: 'grey',
    borderRadius: 5,
    fontSize: 13,
    fontWeight: '400',
    width: 'auto',
    marginRight: 15
  },

  incompletetasks: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    justifyContent: 'space-between',
    elevation: 3,
    paddingTop: 9,
    paddingBottom: 9,

  },
  addicon: {
    position: 'absolute',
    bottom: 7,
    right: 7,
  },

});
export default Tasks;

