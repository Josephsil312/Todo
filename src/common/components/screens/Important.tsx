import { Text, StyleSheet, View, TouchableOpacity, FlatList, Pressable, SectionList, ScrollView, KeyboardAvoidingView, LayoutAnimation, ActivityIndicator } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { useTasks } from '../../TasksContextProvider';
import Icon from 'react-native-vector-icons/FontAwesome';
import Iconn from 'react-native-vector-icons/EvilIcons'
import Iconfromentypo from 'react-native-vector-icons/Entypo'
import Iconchev from 'react-native-vector-icons/Entypo'
import Plusicon from 'react-native-vector-icons/AntDesign';
import Editable from '../Editable';
import { HeadingText } from '../../Texts';
import RBSheet from 'react-native-raw-bottom-sheet';
import AddingTasks from './AddingTasks';
import Calendarr from 'react-native-vector-icons/EvilIcons';
import firestore, { firebase } from '@react-native-firebase/firestore';
import { isAfter, isYesterday, subDays, isSameDay, isTomorrow, parse, isBefore, format, startOfToday } from 'date-fns';
import { RectButton, GestureHandlerRootView, PanGestureHandler, Gesture, GestureDetector } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withSpring, LightSpeedInLeft, LightSpeedOutRight, Easing } from 'react-native-reanimated'
import LottieView from 'lottie-react-native';
import Check from 'react-native-vector-icons/AntDesign';
import Iconfont from 'react-native-vector-icons/Fontisto';
import Bell from 'react-native-vector-icons/EvilIcons';
import SwipeableRow from './SwipableRow';
import notifee, { EventType, TimestampTrigger, TriggerType } from '@notifee/react-native';
import Snackbar from 'react-native-snackbar';
import auth, { FirebaseAuthError } from '@react-native-firebase/auth';
interface Props {
  navigation: NavigationProp<ParamListBase>;
}
const Important = ({ navigation }: Props) => {

  const { allTasks, setAllTasks, dueDate, dueDateTimeReminderDate,dueDateTimeReminderTime,selectedItem, setCaptureDateTimeReminderDate,setDocId,myDayState,setSelectedItem,setMyDayState,setDueDateAdded,setCaptureDateTimeReminderTime } = useTasks();
  const refRBSheet = useRef<RBSheet>(null);
  const [isRBSheetOpen, setIsRBSheetOpen] = useState(false);
  const [task, setTask] = useState('');
  const refEditableTask = useRef<RBSheet>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const userId = auth().currentUser.uid;
  const userCollection = firestore().collection('users').doc(userId).collection('tasks');

  const handleAddTask = async () => {
    if (task.trim() !== '') {
      try {
        const newTask = {
          name: task,
          isCompleted: false,
          isImportant: true,
          dateSet: dueDate,
          myDay: isSameDay(parse(dueDate, "dd/MM/yyyy", new Date()), startOfToday()),
          timeReminder:dueDateTimeReminderTime,
          dateReminder:dueDateTimeReminderDate,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }
        setTask('');
        await userCollection.add({
          ...newTask
        })
      } catch (e) {
        console.log('error loading items ot firebase', e)
      }
    }
    if (dueDateTimeReminderDate.trim() !== '' && dueDateTimeReminderTime.trim() !== '') {
      onDisplayNotification(dueDateTimeReminderDate, dueDateTimeReminderTime, task);
    }
  }
  async function onDisplayNotification(dueDateTimeReminderDatee, dueDateTimeReminderTimee, taskName) {
    // Request permissions (required for iOS)
    try {
      await notifee.requestPermission()
      const dateParts = dueDateTimeReminderDatee.split('/');
      const timeParts = dueDateTimeReminderTimee.split(':');
      const year = parseInt(dateParts[2], 10);
      const month = parseInt(dateParts[1], 10) - 1; // Adjust for 0-index
      const day = parseInt(dateParts[0], 10);
      const hours = parseInt(timeParts[0], 10);
      const minutes = parseInt(timeParts[1], 10);

      const notificationDateTime = new Date(year, month, day, hours, minutes);
     
     
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
          
        },
        trigger, 
      );
      // setNotificationId(id);
      // console.log('notificationid',notificationId)
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

  const filteredImportantTasks = allTasks.filter(task => task.isImportant && task.isCompleted === false);
  const deleteTask = async (id) => {
    try {
      // Delete the task document from Firestore
      await userCollection.doc(id).delete();
      await notifee.cancelNotification(id); Promise<void>
      // Update the local state with the updated tasks (optional)

      // Clear any animations or other state as needed
   
      setTask('');
    } catch (error) {
      console.error('Error deleting task from Firestore:', error);
    }
  };
 
  const backToTask = async (firestoreDocId) => {
    try {
      const taskRef = userCollection.doc(firestoreDocId);
      await taskRef.set({ isImportant: false }, { merge: true });
      
      console.log('Task completed successfully.');
    } catch (error) {
      console.error('Error updating completed task:', error);
    }
  };

  const backToCompleted = async (firestoreDocId) => {
    try {
      const taskRef = userCollection.doc(firestoreDocId);
      await notifee.cancelNotification(firestoreDocId); Promise<void>
      await taskRef.set({ isCompleted: true }, { merge: true });
      Snackbar.show({
        text: `Task moved to completed 'Tasks' section`,
      });
      console.log('Task completed successfully.');
    } catch (error) {
      console.error('Error updating completed task:', error);
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
  const openRBSheet = (item: any) => {
    if (refEditableTask?.current) {
      refEditableTask.current.open();
      setIsRBSheetOpen(true)
      setSelectedItem(item)
      setMyDayState(item.myDay)
    }
  };

  console.log('allTasks from imp', allTasks)

  const snackBarDisplay = () => {
    Snackbar.show({
      text: 'Hello world',
    });
  }

  return (
    <>
    {isLoading && ( // Conditionally render the activity indicator
        <View style = {{backgroundColor:'#ffcbd8'}}>
          <ActivityIndicator size="large" color="#971c3d" />
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

          <SectionList sections={[
            { data: filteredImportantTasks }, // Assuming this array contains the important tasks
          ]} keyExtractor={item => item.firestoreDocId}
            renderItem={({ item }) => (
              <>
                <SwipeableRow onDelete={() => deleteTask(item.firestoreDocId)}            
                >
                  <Animated.View  entering={LightSpeedInLeft.duration(300).easing(Easing.ease)} exiting={LightSpeedOutRight.duration(200).easing(Easing.ease)}>
                    <Pressable
                      style={styles.incompletetasks}
                      onPress={() => { openRBSheet(item.name); setDocId(item.firestoreDocId); setMyDayState(item.myDay); setDueDateAdded(item.dateSet);setCaptureDateTimeReminderDate(item.dateReminder);setCaptureDateTimeReminderTime(item.timeReminder) }}
                    >
                      <View style={styles.icontextcontainer}>
                        <TouchableOpacity onPress={() => { backToCompleted(item.firestoreDocId) }}>
                        <Icon name="circle-thin" size={27} color="grey" />
                        </TouchableOpacity>
                        <View style = {{height:40,width:2,backgroundColor:'#971c3d',marginHorizontal:'4%'}}></View>
                        <View style={{ flexDirection: 'column', marginLeft: 15 }}>
                          <HeadingText
                            textString={item.name.trim()}
                            fontSize={17}
                            fontFamily="SuisseIntl"
                          />
                          <View style={{ flexDirection: 'row',alignItems:'center' }}>
                          {item.dateSet && (
                            <>
                              {renderDateConditional(item)}
                            </>
                          )}
                          {item.myDay &&  <Iconfont name="day-sunny" size={15} color = {'grey'} style={{marginRight:5}}/>}
                            {item.myDay && <HeadingText
                              textString={'My Day'}
                              fontSize={13}
                              fontFamily="SuisseIntl"
                              color='grey'
                              fontWeight={400}
                              marginRight={15}
                            />
                            }
                            {(item.timeReminder || item.dateReminder) && <Bell name="bell" size={15} color = {'grey'} style={{marginRight:5}} />}
                            </View>
                        </View>
                      </View>
                      <Iconfromentypo name="star" size={24} color="grey" style={{ color: '#971c3d',paddingLeft:20 }} onPress={() => backToTask(item.firestoreDocId)} />
                    </Pressable>
                  </Animated.View>
                </SwipeableRow>
              </>
            )} />

        </GestureHandlerRootView>
       )}
      </KeyboardAvoidingView >

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
          color={'#971c3d'}
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
          color="#971c3d"
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

export default Important;

const styles = StyleSheet.create({


  icontextcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start',
    maxHeight: 'auto',
    padding:2
  },
  futuretag:{
    color: 'grey',
    borderRadius: 5,
    fontSize: 13,
    fontWeight: '400',
    width: 'auto',
    marginRight:8
  },
  taskContainer: {
    flexGrow: 1,
    backgroundColor: '#ffcbd8',
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
    marginRight:15
  },
  dueTodayTag: {
    // Adjust appearance as desired, e.g.,
    color: 'grey',
    borderRadius: 5,
    fontSize: 13,
    fontWeight: '400',
    width: 'auto',
    marginRight:15
  },
  dueTomorrowTag: {
    color: 'grey',
    borderRadius: 5,
    fontSize: 13,
    fontWeight: '400',
    width: 'auto',
    marginRight:15
  },
  incompletetasks: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    justifyContent: 'space-between',
    elevation: 3 ,
    paddingTop:9,
    paddingBottom:9,
  },
  addicon: {
    position: 'absolute',
    bottom: 7,
    right: 7,
  },
});
