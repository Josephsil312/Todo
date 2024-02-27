import { Text, StyleSheet, View, TouchableOpacity, FlatList, KeyboardAvoidingView, SectionList, Pressable, ScrollView, LayoutAnimation } from 'react-native';
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
import { isAfter, isYesterday, subDays, isSameDay, isTomorrow, parse, isBefore, format, startOfToday } from 'date-fns';
import firestore, { firebase } from '@react-native-firebase/firestore';
import { RectButton, GestureHandlerRootView } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Animated, { useAnimatedStyle, useSharedValue, withTiming,  LightSpeedInLeft, LightSpeedOutRight, Easing } from 'react-native-reanimated'
import LottieView from 'lottie-react-native';
import Editable from '../Editable';
interface Props {
  navigation: NavigationProp<ParamListBase>;
}
const Planned = ({ navigation }: Props) => {

  const { allTasks, setAllTasks, dueDate,setSelectedItem,dueDateTimeReminderDate,myDayState,selectedItem,dueDateTimeReminderTime,setMyDayState,setTaskCompleted,setDocId,setDueDateAdded,setCaptureDateTimeReminderDate,setCaptureDateTimeReminderTime } = useTasks();
  const refRBSheet = useRef<RBSheet>(null);
  const [isRBSheetOpen, setIsRBSheetOpen] = useState(false);
  const [task, setTask] = useState('');
  const refEditableTask = useRef<RBSheet>(null);
  const opacity = useSharedValue(0); // Initially fully transparent
  const translationY = useSharedValue(0); // Initially no vertical translation
  
  const animateFadeIn = async () => {
    withTiming(
      300, // Adjust duration as needed
      {
        from: { opacity: 0, translateY: 20 }, // Start from opacity 0 and slight translate-up
        to: { opacity: 1, translateY: 0 }, // End at opacity 1 and translate back to normal position
      }
    );
  };
  
  const userCollection = firestore().collection('users');

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
        }
        setTask('');
        const docRef= await userCollection.add({
          ...newTask
        })
      } catch (e) {
        console.log('error loading items ot firebase', e)
      }
    }
  }
  //tasks have to be retrieved, assigned to settasks and persisted
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users') // Replace 'tasks' with your collection name
      .onSnapshot(snapshot => {
        const newTasks = snapshot.docs.map(doc => ({
          firestoreDocId: doc.id,
          ...doc.data(),
        }));
        setAllTasks(newTasks);
      });

    return () => unsubscribe();
  }, []);

  const deleteTask = async (id) => {
    try {
      // Delete the task document from Firestore
      await userCollection.doc(id).delete();
      // Update the local state with the updated tasks (optional)
      // Clear any animations or other state as needed
      
    } catch (error) {
      console.error('Error deleting task from Firestore:', error);
    }
  };

  const rightSwipe = ({ item, onDelete }) => {
    const renderRightActions = (dragX) => {
      const trans = dragX.interpolate({
        inputRange: [-100, 0],
        outputRange: [0, 1],
        extrapolate: 'clamp'
      });
      return (
        <RectButton style={styles.rightAction} onPress={() => onDelete(item.firestoreDocId)}>
          <Animated.Text
            style={[
              styles.actionText,
              {
                transform: [{ translateX: 100 }],
              },
            ]}
          >
            Delete
          </Animated.Text>
        </RectButton>
      );
    };

    return (
      <Swipeable renderRightActions={renderRightActions}>
        <View style={{ flex: 1 }}>
          <Animated.View style={{
            width: 500,
            flex: 1,
          }}>
            {/* <Text>{item.name}</Text> */}
          </Animated.View>
        </View>
      </Swipeable>
    );
  };

  const renderDateConditional = (item) => {
    const currentDate = startOfToday();
    const parsedDate = parse(item.dateSet, "dd/MM/yyyy", new Date());
    const currentYear = new Date().getFullYear();
    const isCurrentYear = parsedDate.getFullYear() === currentYear;

    const iconColor = isBefore(parsedDate, currentDate) || isYesterday(parsedDate)
      ? "#C02136"
      : isSameDay(parsedDate, currentDate)
        ? "#7568f8" // Your original color for today
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
            <Text style={styles.dueTomorrowTag}>{format(parsedDate, "EEE, MMM d, yyyy")}</Text> // Year included for non-current years (past and future)
            :
            <Text style={styles.dueTomorrowTag}>{format(parsedDate, "EEE, MMM d")}</Text>
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

  console.log('allTasks from imp', allTasks)

  const handleCompleteTask = async (firestoreDocId) => {
    animateFadeIn()
    try {
      
      const taskRef = userCollection.doc(firestoreDocId);
      
      await taskRef.set({ isCompleted: true }, { merge: true });
      console.log('Task completed successfully.');
    } catch (error) {
      console.error('Error updating completed task:', error);
    }
  };

  const toggleTask = async (firestoreDocId) => {
    animateFadeIn()
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
        <GestureHandlerRootView>
         
            <SectionList sections={sections}
              keyExtractor={item => item.firestoreDocId}
              renderItem={({ item }) => (
                <>
                  <Swipeable renderRightActions={() => rightSwipe(item.firestoreDocId)}
                    onSwipeableOpen={() => deleteTask(item.firestoreDocId)}
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
                             <LottieView style = {{width:45,height:45,marginLeft:-10}} source={require('../../../../assets/animations/check.json')} autoPlay loop={false} />
                            </Pressable>
                          ) : (
                            <Pressable onPress={() => handleCompleteTask(item.firestoreDocId)}>
                             <LottieView style = {{width:45,height:45,marginLeft:-10}} source={require('../../../../assets/animations/circle.json')} autoPlay loop={false}/>
                            </Pressable>
                          )}
                          <View style={{ flexDirection: 'column', marginLeft: 15 }}>
                            <HeadingText
                              textString={item.name.trim()}
                              fontSize={17}
                              
                              fontFamily="SuisseIntl"
                              textDecorationLine={item.isCompleted ? "line-through" : ''}
                            />
                            {item.dateSet && (
                              <>
                                {renderDateConditional(item)}
                              </>
                            )}
                          </View>
                        </View>
                        <Pressable key={item.firestoreDocId} onPress={() => starChange(item.firestoreDocId)}>
                          {item.isImportant ? <Iconfromentypo name="star" size={22} color="grey" style={{ color: '#037754' }} />
                            : <Iconn name="star" size={25} color="grey" />
                          }
                        </Pressable>
                      </Pressable>
                    </Animated.View>
                  </Swipeable>
                </>
              )} />
          
        </GestureHandlerRootView>
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
            height: '22%',
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
            height: '90%',
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
          size={55}
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
  image: {
    width: 20,
    height: 20,
    marginRight: 13,
  },
  completedlistlength: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7
  },
  icontextcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start',
    height: 25
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
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
  },
  rightAction: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dd2c00',
    flex: 1,
  },
  dueTodayTag: {
    // Adjust appearance as desired, e.g.,
    color: '#7568f8',
    borderRadius: 5,
    fontSize: 13,
    fontWeight: '400',
    width: 'auto'
  },
  dueTomorrowTag: {
    color: 'grey',
    borderRadius: 5,
    fontSize: 13,
    fontWeight: '400',
    width: 'auto'
  },
  incompletetasks: {
    elevation: 6,
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 2,
    justifyContent: 'space-between',
    flexDirection: 'row',
    shadowColor: '#005F8D',
    backgroundColor: 'white',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    flex:1
  },
  addicon: {
    position: 'absolute',
    bottom: 7,
    right: 7,
  },
});
