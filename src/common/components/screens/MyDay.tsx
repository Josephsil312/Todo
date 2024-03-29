import { Text, StyleSheet, View, TouchableOpacity, SectionList, KeyboardAvoidingView, Easing, Pressable, ScrollView, LayoutAnimation, ActivityIndicator } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { useTasks } from '../../TasksContextProvider';
import Icon from 'react-native-vector-icons/FontAwesome';
import Iconn from 'react-native-vector-icons/EvilIcons'
import Iconfromentypo from 'react-native-vector-icons/Entypo'
import Iconchev from 'react-native-vector-icons/Entypo'
import Plusicon from 'react-native-vector-icons/AntDesign';
import { HeadingText } from '../../Texts';
import RBSheet from 'react-native-raw-bottom-sheet';
import AddingTasks from './AddingTasks';
import Calendarr from 'react-native-vector-icons/EvilIcons';
import Check from 'react-native-vector-icons/AntDesign';
import { isAfter, isYesterday, subDays, isSameDay, isTomorrow, parse, isBefore, format, startOfToday, isToday } from 'date-fns';
import { RectButton, GestureHandlerRootView, PanGestureHandler, Gesture, GestureDetector } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withSpring, LightSpeedOutRight, LightSpeedInLeft } from 'react-native-reanimated'
import firestore, { firebase } from '@react-native-firebase/firestore';
import Editable from '../Editable';
import Bell from 'react-native-vector-icons/EvilIcons';
import notifee, { EventType, TimestampTrigger, TriggerType } from '@notifee/react-native';
import Iconfont from 'react-native-vector-icons/Fontisto';
import SwipeableRow from './SwipableRow';
import auth, { FirebaseAuthError } from '@react-native-firebase/auth';
interface Props {
  navigation: NavigationProp<ParamListBase>;
}
const MyDay = ({ navigation }: Props) => {

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
    setTaskCompleted
  } = useTasks();
  const refRBSheet = useRef<RBSheet>(null);
  const [isRBSheetOpen, setIsRBSheetOpen] = useState(false);
  const [task, setTask] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const refEditableTask = useRef<RBSheet>(null);
  const userId = auth().currentUser.uid;
  const userCollection = firestore().collection('users').doc(userId).collection('tasks');

  const handleAddTask = async () => {
    if (task.trim() !== '') {
      try {
        const newTask = {
          name: task,
          isCompleted: false,
          isImportant: false,
          dateSet: dueDate,
          myDay: true,
          timeReminder: dueDateTimeReminderTime,
          dateReminder: dueDateTimeReminderDate,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }
        setTask('');
        await userCollection.add({ ...newTask });

      } catch (e) {
        console.log('error loading items ot firebase', e)
      }
    }
    
    await onDisplayNotification(dueDateTimeReminderDate, dueDateTimeReminderTime, task);
   
  }
  async function onDisplayNotification(dueDateTimeReminderDatee, dueDateTimeReminderTimee, taskName) {
    // Request permissions (required for iOS)
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
        alarmManager:true,
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
  async function onBackgroundEvent(event) {
    if (event.type === EventType.DISMISSED) {
      console.log('User dismissed notification', event.notification);
    } else if (event.type === EventType.PRESS) {
      console.log('User pressed notification', event.notification);
      // Additional handling for press event
    }
    // Handle other event types as needed
  }
  notifee.onBackgroundEvent(onBackgroundEvent);
  //tasks have to be retrieved, assigned to settasks and persisted
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

  // const todayTasks = allTasks.filter((task) => {
  //   const taskDate = parse(task.dateSet, "dd/MM/yyyy", new Date());
  //   return isToday(taskDate);
  // });

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

    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Calendarr name="calendar" size={15} color={iconColor} style={{ marginRight: 3 }} />
        {isBefore(parsedDate, currentDate) ? (
          <Text style={styles.overdueTag}>
            {isYesterday(parsedDate) ? (
              `Yesterday`
            ) : (
              `${format(parsedDate, 'EEE, MMM d')}`
            )}
          </Text>
        ) : isSameDay(parsedDate, currentDate) ? (
          <Text style={styles.dueTodayTag}>Today </Text>
        ) : isTomorrow(parsedDate) ? (
          <Text style={styles.dueTomorrowTag}>Tomorrow</Text>
        ) : (
          !isCurrentYear ?
            <Text style={styles.futuretag}>{format(parsedDate, "EEE, MMM d, yyyy")}</Text> // Year included for non-current years (past and future)
            :
            <Text style={styles.futuretag}>{format(parsedDate, "EEE, MMM d")}</Text>
        )}
      </View>
    );
  };



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
  };

  const deleteTask = async (id) => {
    try {
      // Delete the task document from Firestore
      await userCollection.doc(id).delete();
      await notifee.cancelNotification(id); Promise<void>
      setTask('');
    } catch (error) {
      console.error('Error deleting task from Firestore:', error);
    }
  };

  const toggleCompletedDropdown = () => {

    setShowCompletedDropdown(!showCompletedDropdown);
  };
  const openRBSheet = (item: any) => {
    if (refEditableTask?.current) {
      refEditableTask.current.open();
      setIsRBSheetOpen(true)
      setSelectedItem(item)
    }
  };

  const toggleTask = async (firestoreDocId) => {
    try {
      const taskRef = userCollection.doc(firestoreDocId);

      await taskRef.set({ isCompleted: false }, { merge: true });

      console.log('Task toggled successfully.');
    } catch (error) {
      console.error('Error updating toggled task:', error);
    }
  };

  const handleCompleteTask = async (firestoreDocId) => {
    try {
      const taskRef = userCollection.doc(firestoreDocId);
      await taskRef.set({ isCompleted: true }, { merge: true });
      await notifee.cancelNotification(firestoreDocId); Promise<void>
      console.log('Task completed successfully.');
    } catch (error) {
      console.error('Error updating completed task:', error);
    }
  };

  const sections = [
    {
      data: allTasks.filter(
        (task) => ((!task.isCompleted && task.myDay))
      ),
    },
    { title: 'Completed Tasks', data: allTasks.filter((task) => (task.isCompleted === true && task.myDay)) },
  ];

  console.log('alltasks from myday', allTasks)
  return (

    <>
      {isLoading && ( // Conditionally render the activity indicator
        <View style = {{backgroundColor:'#79015B'}}>
          <ActivityIndicator size="large" color="#FE9AE5" />
        </View>


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
                    <Animated.View entering={LightSpeedInLeft} exiting={LightSpeedOutRight}>
                      <Pressable
                        style={styles.incompletetasks}
                        onPress={() => { openRBSheet(item.name); setTaskCompleted(item.isCompleted); setDocId(item.firestoreDocId); setMyDayState(item.myDay); setDueDateAdded(item.dateSet); setCaptureDateTimeReminderDate(item.dateReminder); setCaptureDateTimeReminderTime(item.timeReminder) }}
                      >
                        <View style={styles.icontextcontainer}>
                          {item.isCompleted ? (
                            <TouchableOpacity onPress={() => {
                              toggleTask(item.firestoreDocId);
                            }}>
                              <Check name="checkcircle" size={23} color={'#79015B'} />
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity onPress={() => handleCompleteTask(item.firestoreDocId)}>
                              <Icon name="circle-thin" size={27} color="grey" />
                            </TouchableOpacity>
                          )}
                          <View style = {{height:40,width:2,backgroundColor:'#79015B',marginHorizontal:'4%'}}></View>
                          <View style={{ flexDirection: 'column', marginLeft: '2%', alignItems: 'flex-start', paddingLeft: 10 }}>
                            <HeadingText
                              textString={item.name.trim()}
                              fontSize={17}
                              fontFamily="SuisseIntl"
                              textDecorationLine={item.isCompleted ? "line-through" : ''}
                            />

                            <View style={{ flexDirection: 'row', alignItems: 'center', width: 100, justifyContent: 'space-between' }}>
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
                        <Pressable key={item.firestoreDocId} onPress={() => starChange(item.firestoreDocId)}>
                          {item.isImportant ? <Iconfromentypo name="star" size={24} color="grey" style={{ color: '#79015B' }} />
                            : <Iconn name="star" size={27} color="grey" />
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

                      <Iconchev name="chevron-small-right" size={20} color="white" />

                      <HeadingText
                        textString={`Completed ${allTasks.filter((task) => task.isCompleted === true && task.myDay === true).length}`}
                        fontSize={16}
                        fontFamily="SuisseIntl"
                        color='white'
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
          color={'#79015B'}
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
            backgroundColor: '#000',
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
          color={'#5A69AF'}
        />
      </RBSheet>
      <View style={styles.addicon}>
        <Plusicon
          name="pluscircle"
          size={58}
          color="#FE9AE5"
          style={{
            shadowColor: '#444167',
            elevation: 6,
            shadowOpacity: 0.6,
            shadowRadius: 20,
          }}
          onPress={() => {
            if (refRBSheet?.current) {
              refRBSheet.current.open();
              setIsRBSheetOpen(true);
              console.log('opened RBsheet onpress')
            }
          }}
        />
      </View>

    </>
  );
};

export default MyDay;

const styles = StyleSheet.create({

  completedlistlength: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10
  },
  icontextcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start',
    maxHeight: 'auto',
    padding: 2
  },
  taskContainer: {
    flexGrow: 1,
    backgroundColor: '#79015B',
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

  overdueTag: {
    color: '#C02136',
    fontSize: 13,
    fontWeight: '400',
    marginRight: 15
  },
  dueTodayTag: {
    // Adjust appearance as desired, e.g.,
    color: 'grey',
    borderRadius: 5,
    fontSize: 13,
    fontWeight: '400',
    width: 'auto',
    marginRight: 16
  },
  futuretag:{
    color: 'grey',
    borderRadius: 5,
    fontSize: 13,
    fontWeight: '400',
    width: 'auto',
    marginRight:8
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
    shadowColor: '#005F8D',
    backgroundColor: 'white',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    paddingHorizontal: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    justifyContent: 'space-between',
    elevation: 4,
    borderWidth: 0.8,
    borderColor: '#004364',
    paddingTop: 9,
    paddingBottom: 9,

  },
  addicon: {
    position: 'absolute',
    bottom: 7,
    right: 7,
  },
});
