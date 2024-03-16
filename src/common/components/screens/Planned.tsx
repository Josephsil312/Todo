import { Text, StyleSheet, View, TouchableOpacity, FlatList, KeyboardAvoidingView, SectionList, Pressable, ScrollView, LayoutAnimation, ActivityIndicator } from 'react-native';
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
import { isAfter, isYesterday, subDays, isSameDay, isTomorrow, parse, isBefore, format, startOfToday } from 'date-fns';
import firestore, { firebase } from '@react-native-firebase/firestore';
import { RectButton, GestureHandlerRootView } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Animated, { useAnimatedStyle, useSharedValue, withTiming,  LightSpeedInLeft, LightSpeedOutRight, Easing } from 'react-native-reanimated'
import LottieView from 'lottie-react-native';
import Check from 'react-native-vector-icons/AntDesign';
import Iconfont from 'react-native-vector-icons/Fontisto';
import Bell from 'react-native-vector-icons/EvilIcons';
import SwipeableRow from './SwipableRow';
import notifee, { EventType, TimestampTrigger, TriggerType } from '@notifee/react-native';
import Editable from '../Editable';
import auth, { FirebaseAuthError } from '@react-native-firebase/auth';
interface Props {
  navigation: NavigationProp<ParamListBase>;
}
const Planned = ({ navigation }: Props) => {

  const { allTasks, setAllTasks, dueDate,setSelectedItem,dueDateTimeReminderDate,myDayState,selectedItem,dueDateTimeReminderTime,setMyDayState,setTaskCompleted,setDocId,setDueDateAdded,setCaptureDateTimeReminderDate,setCaptureDateTimeReminderTime } = useTasks();
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
          isImportant: false,
          dateSet: dueDate,
          myDay: isSameDay(parse(dueDate, "dd/MM/yyyy", new Date()), startOfToday()),
          planned: true,
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

  const deleteTask = async (id) => {
    try {
      await userCollection.doc(id).delete();
      await notifee.cancelNotification(id); Promise<void>
    } catch (error) {
      console.error('Error deleting task from Firestore:', error);
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
      <View style={{ flexDirection: 'row', alignItems: 'center',marginRight:5 }}>
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

  const toggleTask = async (firestoreDocId) => {
   
    try {
     
      const taskRef = userCollection.doc(firestoreDocId);
     
      await taskRef.set({ isCompleted: false }, { merge: true });
      console.log('Task toggled successfully.');
    } catch (error) {
      console.error('Error updating toggled task:', error);
    }
  };

  const sections = [
    { data: allTasks.filter(task => task.dateSet && task.isCompleted === false) },
    { data: allTasks.filter((task) => task.isCompleted && task.dateSet) },
  ];
  
  const openRBSheet = (item: any) => {
    if (refEditableTask?.current) {
      refEditableTask.current.open();
      setIsRBSheetOpen(true)
      setSelectedItem(item)
      setMyDayState(item.myDay)
    }
  };
  return (
    <>
    {isLoading && ( // Conditionally render the activity indicator
        <View style = {{backgroundColor:'#037754'}}>
          <ActivityIndicator size="large" color="#9CFCDF" />
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
         
            <SectionList sections={sections}
              keyExtractor={item => item.firestoreDocId}
              renderItem={({ item }) => (
                <>
                   <SwipeableRow onDelete={() => deleteTask(item.firestoreDocId)}            
                >
                     <Animated.View entering={LightSpeedInLeft.duration(200).easing(Easing.ease)} exiting={LightSpeedOutRight.duration(200).easing(Easing.ease)}>
                      <Pressable
                        style={styles.incompletetasks}
                        onPress={() => { openRBSheet(item.name); setTaskCompleted(item.isCompleted);setDocId(item.firestoreDocId); setMyDayState(item.myDay); setDueDateAdded(item.dateSet);setCaptureDateTimeReminderDate(item.dateReminder);setCaptureDateTimeReminderTime(item.timeReminder) }}
                      >
                        <View style={styles.icontextcontainer}>
                          {item.isCompleted ? (
                            <Pressable onPress={() => {
                              toggleTask(item.firestoreDocId);
                            }}>
                              <Check name="checkcircle" size={24} color={'#037754'} />
                            </Pressable>
                          ) : (
                            <Pressable onPress={() => handleCompleteTask(item.firestoreDocId)}>
                            <Icon name="circle-thin" size={27} color="grey" />
                            </Pressable>
                          )}
                          <View style = {{height:40,width:2,backgroundColor:'#037754',marginHorizontal:'4%'}}></View>
                          <View style={{ flexDirection: 'column', marginLeft: '2%', alignItems: 'flex-start',paddingLeft:10  }}>
                            <HeadingText
                              textString={item.name.trim()}
                              fontSize={17}
                              
                              fontFamily="SuisseIntl"
                              textDecorationLine={item.isCompleted ? "line-through" : ''}
                            />
                             <View style={{ flexDirection: 'row', alignItems: 'center', width: 100 }}>
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
                        <Pressable key={item.firestoreDocId} onPress={() => starChange(item.firestoreDocId)}>
                          {item.isImportant ? <Iconfromentypo name="star" size={24} color="grey" style={{ color: '#037754' }} />
                            : <Iconn name="star" size={27} color="grey" />
                          }
                        </Pressable>
                      </Pressable>
                    </Animated.View>
                  </SwipeableRow>
                </>
              )} />
          
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
          color={'#004700'}
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
          color="#9CFCDF"
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

export default Planned;

const styles = StyleSheet.create({
  

  icontextcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start',
    maxHeight: 'auto',
    padding:2
  },
  taskContainer: {
    flexGrow: 1,
    backgroundColor: '#037754',
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
  futuretag:{
    color: 'grey',
    borderRadius: 5,
    fontSize: 13,
    fontWeight: '400',
    width: 'auto',
    marginRight:8
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
    paddingTop:9,
    paddingBottom:9,
    
  },
  addicon: {
    position: 'absolute',
    bottom: 7,
    right: 7,
  },
});
