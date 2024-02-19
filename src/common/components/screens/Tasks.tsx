import {
  View,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Text,
  LayoutAnimation,
  SectionList,
  SafeAreaView,
  KeyboardAvoidingView,
  Alert
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withDelay, FadeIn, FadeOut, Easing, FlipInEasyX, FlipOutEasyX, StretchInX, StretchOutY, LightSpeedInRight, LightSpeedOutLeft, PinwheelIn, PinwheelOut, BounceIn, BounceOut, SlideInUp, SlideOutDown, SlideInDown, ZoomIn, ZoomOut, ZoomInDown, ZoomOutDown, ZoomInEasyUp, ZoomOutEasyUp, LightSpeedInLeft, LightSpeedOutRight } from 'react-native-reanimated'
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
import LottieView from 'lottie-react-native';

interface Props {
  navigation: NavigationProp<ParamListBase>;
}

const Tasks = ({ navigation }: Props) => {
  const refRBSheet = useRef<RBSheet>(null);
  const refEditableTask = useRef<RBSheet>(null);

  const [completedTaskId, setCompletedTaskId] = useState(null);
  const [task, setTask] = useState('');
  const [isRBSheetOpen, setIsRBSheetOpen] = useState(false);
  
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
          timeReminder:dueDateTimeReminderTime,
          dateReminder:dueDateTimeReminderDate,
        };
        setTask('');
         await userCollection.add({
          ...newTask
        })
       
      } catch (error) {
        console.error('Error adding task:', error);
        
      }
    }
  
  };
 
  useEffect(() => {
    const unsubscribe = userCollection // Replace 'tasks' with your collection name
      .onSnapshot(snapshot => {
        const newTasks = snapshot.docs.map(doc => ({
          firestoreDocId: doc.id,
          ...doc.data(),
        }));
        setAllTasks(newTasks);
      });

    return () => unsubscribe();
  }, []);

  const deleteTask =async (id) => {
    try {
      // Delete the task document from Firestore
      await userCollection.doc(id).delete();
      setTask('');
    } catch (error) {
      console.error('Error deleting task from Firestore:', error);
    }
  }


  const handleCompleteTask = async (firestoreDocId) => {
    try {
      const taskRef = userCollection.doc(firestoreDocId)
      await taskRef.set({ isCompleted: true }, { merge: true });
      setCompletedTaskId(firestoreDocId);
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
        ? "#5A69AF" // Your original color for today
        : "grey";
    return (<>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
            <Text style={styles.dueTomorrowTag}>{format(parsedDate, "EEE, MMM d, yyyy")}</Text> // Year included for non-current years (past and future)
            :
            <Text style={styles.dueTomorrowTag}>{format(parsedDate, "EEE, MMM d")}</Text>
        )}
      </View>
    </>
    )
  }

  


  const sections = [
    { data: allTasks.filter((task) => !task.isCompleted) },
    { title: 'Completed Tasks', data: allTasks.filter((task) => task.isCompleted) },
  ];

  console.log('alltasks',allTasks)



  return (
    <>{isRBSheetOpen &&
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
          <SectionList
            sections={sections}
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
                          <TouchableOpacity onPress={() => {
                            toggleTask(item.firestoreDocId);
                          }}>
                            <LottieView style={{ width: 45, height: 45, marginLeft: -10 }} 
                            source={require('../../../../assets/animations/checktwo.json')} autoPlay loop={false} />
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity onPress={() => handleCompleteTask(item.firestoreDocId)}>
                            {/* <Icon name="circle-thin" size={27} color="grey" style={{backgroundColor:'black'}}/>  */}
                            <LottieView style={{ width: 45, height: 45, marginLeft: -10 }} source={require('../../../../assets/animations/circle.json')} autoPlay loop={false} />
                          </TouchableOpacity>
                        )}
                        <View style={{ flexDirection: 'column', marginLeft: '2%', alignItems: 'flex-start' }}>
                          <HeadingText
                            textString={item.name}
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
                        {item.isImportant ? <Iconfromentypo name="star" size={24} color="grey" style={{ color: '#5A69AF' }} />
                          : <Iconn name="star" size={27} color="grey" />
                        }
                      </Pressable>

                    </Pressable>
                  </Animated.View>
                </Swipeable>
              </>
            )}
            renderSectionHeader={({ section: { title } }) => {
              if (title) {
                return (
                    <Pressable onPress={toggleCompletedDropdown} style={styles.completedlistlength}>
                      {/* <Animated.View style={[animatedStyle]}> */}
                      <Iconchev name="chevron-small-right" size={20} color="white" />
                      {/* </Animated.View> */}
                      <HeadingText
                        textString={`Completed ${allTasks.filter((task) => task.isCompleted).length}`}
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
            height: '20%',
          }
        }}>
        <AddingTasks
          handleAddTask={handleAddTask}
          task={task}
          setTask={setTask}
          color={'#5A69AF'}
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


      <View
        style={styles.addicon}>
        <Pressable
          onPress={() => {
            if (refRBSheet?.current) {
              refRBSheet.current.open();
              setIsRBSheetOpen(true);
            }
          }}>
          <Plusicon name="pluscircle" size={55} color="#cec9fc" style={{
            shadowColor: '#444167', elevation: 6, shadowOpacity: 0.6,
            shadowRadius: 20,
          }} />
        </Pressable>
      </View>

    </>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 20,
    height: 20,
    marginRight: 13,
  },
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
    height: 25,
    // flexWrap:'nowrap'
    // backgroundColor:'red'
  },
  overdueTag: {
    color: '#C02136',
    fontSize: 13,
    fontWeight: '400',
  },
  taskContainer: {
    flexGrow: 1,
    backgroundColor: '#5A69AF',
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
    // Adjust appearance as desired, e.g.,
    color: '#5A69AF',
    borderRadius: 5,
    fontSize: 13,
    fontWeight: '400',
    width: 'auto'
  },
  mydayTag: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 100,
    justifyContent: 'space-between'
  },
  dueTomorrowTag: {
    color: 'grey',
    borderRadius: 5,
    fontSize: 13,
    fontWeight: '400',
    width: 'auto'
  },
  rightAction: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dd2c00',
    flex: 1,
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
  },
  incompletetasks: {
    // Remove elevation and shadow properties
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 2,
    justifyContent: 'space-between',
    flexDirection: 'row',
    flexWrap:'wrap',
    // Background color for neumorphic effect
    backgroundColor: 'white', // Adjust as needed

    // Simulate soft lighting and depth
    boxShadow: [
      {
        offset: {
          width: 0,
          height: 2,
        },
        color: '#fff', // Lighter shadow on top
        blurRadius: 10,
        spreadRadius: -5, // Expand inward for pressed effect
      },
      {
        offset: {
          width: 0,
          height: -2,
        },
        color: '#ccc', // Darker shadow below
        blurRadius: 10,
        spreadRadius: 2, // Expand outward for raised effect
      },
    ],

    flex: 1
  },
  addicon: {
    position: 'absolute',
    bottom: 7,
    right: 7,
  },
  completedtasks: {
    shadowColor: '#005F8D',
    backgroundColor: 'white',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    justifyContent: 'space-between',
    elevation: 6,
    width: '100%'
  }
});
export default Tasks;

