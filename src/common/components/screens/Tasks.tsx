import {
  View,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Text,
  LayoutAnimation,
  SectionList,
  SafeAreaView,
  KeyboardAvoidingView
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withSpring } from 'react-native-reanimated'
import firestore from '@react-native-firebase/firestore';
import React, { useState, useRef, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
interface Props {
  navigation: NavigationProp<ParamListBase>;
}

const Tasks = ({ navigation }: Props) => {

  const refRBSheet = useRef<RBSheet>(null);
  const refEditableTask = useRef<RBSheet>(null);
  const [task, setTask] = useState('');
  const [isRBSheetOpen, setIsRBSheetOpen] = useState(false);
  // const [rotationAnimation] = useState(new Animated.Value(0));
  const { dueDateAdded,
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
    star,
    starId,
    setStarId,
    editedText,
    setEditedText } = useTasks();



  const Animate = () => {
    LayoutAnimation.configureNext({
      duration: 500,
      create:
      {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update:
      {
        type: LayoutAnimation.Types.easeInEaseOut,
      }
    });
  }
  // const datafromfirebase = async () => {
  //   try {
  //     const data = await firestore().collection('users').doc('0cfFPPHSip8zKQjDiD1j').get();
  //     console.log('data from firebase',data._data.name)
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }
  // useEffect(() => {
  //   datafromfirebase()
  // }, [])
  const swipeableRef = useRef(null);
  // const width = useSharedValue('100%');
  const rightSwipe = ({ item, onDelete }) => {

    const renderRightActions = (dragX) => {
      const trans = dragX.interpolate({
        inputRange: [-100, 0],
        outputRange: [0, 1],
        extrapolate: 'clamp'
      });
      return (
        <RectButton style={styles.rightAction} onPress={() => onDelete(item.id)}>
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

  const pressed = useSharedValue(false);

  const tap = Gesture.Tap()
    .onBegin(() => {
      pressed.value = true;
    })
    .onFinalize(() => {
      pressed.value = false;
    });

  const animatedStyles = useAnimatedStyle(() => ({
    backgroundColor: pressed.value ? '#5A69AF' : '',
    transform: [{ scale: withSpring(pressed.value ? 0.8 : 1) }],
  }));

  const handleAddTask = async () => {
    if (task.trim() !== '') {
      const taskId = Date.now().toString();
      const newTask = {
        id: taskId,
        name: task || editedText,
        isCompleted: false,
        isImportant: false,
        dateSet: dueDate,
        myDay: isSameDay(parse(dueDate, "dd/MM/yyyy", new Date()), startOfToday())
      };
      const updatedTasks = [newTask, ...allTasks];

      try {
        await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
        Animate()
        setAllTasks(updatedTasks)
        setTask('');
      } catch (error) {
        console.error('Error saving tasks to AsyncStorage:', error);
      }
    }
  };
  //tasks have to be retrieved, assigned to settasks and persisted
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const savedTasks = await AsyncStorage.getItem('tasks');
        if (savedTasks) {
          const parsedTasks = JSON.parse(savedTasks).map((task) => ({
            ...task,
            key: task.id,
            isCompleted: !!task.isCompleted, // Parse completion state
            isImportant: task.isImportant || false,
            myDay: task.myDay || false
          }));
          setAllTasks(parsedTasks);
        }
      } catch (error) {
        console.log('Error loading tasks from AsyncStorage:', error);
      }
    };
    loadTasks();
  }, []);

  const deleteTask = async (id: String) => {
    const updatedTasks = allTasks.filter((task) => task.id !== id);
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      Animate()
      setAllTasks(updatedTasks)
      setTask('');
    } catch (error) {
      console.error('Error saving tasks to AsyncStorage:', error);
    }
  }

  const handleCompleteTask = async (taskId: string) => {
    try {
      const updatedTasks = allTasks.map((task) =>
        task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
      );
      setAllTasks(updatedTasks);
      Animate();
      // Save updated tasks to AsyncStorage
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
    } catch (error) {
      console.log('Error updating task:', error);
    }
  };

  const toggleCompletedDropdown = () => {
    Animate()
    setShowCompletedDropdown(!showCompletedDropdown);
  };

  const toggleTask = async (taskId: string) => {
    try {
      const updatedTasks = allTasks.map((task) =>
        task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
      );
      setAllTasks(updatedTasks);
      Animate()
      // Save updated tasks to AsyncStorage
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
    } catch (error) {
      console.log('Error updating task:', error);
    }
  };

  const starChange = async (taskId: string) => {
    try {
      // Directly update the isImportant property within the allTasks array
      const updatedTasks = allTasks.map((task) =>
        task.id === taskId ? { ...task, isImportant: !task.isImportant } : task
      );
      setAllTasks(updatedTasks);
      // Save the updated tasks to AsyncStorage
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      console.log('Star state and tasks saved to AsyncStorage');
    } catch (error) {
      console.error('Error saving star state and tasks:', error);
    }
  };

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
      ? "red"
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
  const formattedDueDate = dueDateAdded
    ? `Due on ${format(parse(dueDateAdded, 'dd/MM/yyyy', new Date()), 'EEE, MMM d')}`
    : 'Add due date';

  const sections = [
    { data: allTasks.filter((task) => !task.isCompleted) },
    { title: 'Completed Tasks', data: allTasks.filter((task) => task.isCompleted) },
  ];

  const updateTaskName = (taskId: string, newName: string) => {
    const updatedTasks = allTasks.map((task) =>
      task.id === taskId ? { ...task, name: newName } : task
    );
    setAllTasks(updatedTasks);
    // Update the task name in AsyncStorage if needed
    // ...
  };
  console.log('alltasks from tasks', allTasks)

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
          <PanGestureHandler>
            <SectionList
              sections={sections}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <>
                  <Swipeable renderRightActions={() => rightSwipe(item.id)}
                    onSwipeableOpen={() => deleteTask(item.id)}
                    ref={swipeableRef}

                  >

                    <Animated.View style={styles.flatlistitem}>
                      <Pressable
                        style={styles.incompletetasks}
                        onPress={() => { openRBSheet(item.name); setStarId(item.id); setMyDayState(item.myDay); setDueDateAdded(item.dateSet) }}
                      >
                        <View style={styles.icontextcontainer}>

                          {item.isCompleted ? (
                            <TouchableOpacity onPress={() => {
                              toggleTask(item.id);
                            }}>
                              <GestureDetector gesture={tap}>
                                <Animated.View style={animatedStyles}>
                                  <Check name="checkcircle" size={23} color={'#5A69AF'} />
                                </Animated.View>
                              </GestureDetector>
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity onPress={() => handleCompleteTask(item.id)}>
                              <GestureDetector gesture={tap}>
                                <Animated.View style={animatedStyles}>
                                  <Icon name="circle-thin" size={27} color="grey" />
                                </Animated.View>
                              </GestureDetector>
                            </TouchableOpacity>
                          )}
                          <View style={{ flexDirection: 'column', marginLeft: 15, }}>

                            <HeadingText
                              textString={item.name.trim()}
                              fontSize={17}
                              fontWeight="500"
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
                        <Pressable key={item.id} onPress={() => starChange(item.id)}>
                          {item.isImportant ? <Iconfromentypo name="star" size={22} color="grey" style={{ color: '#5A69AF' }} />
                            : <Iconn name="star" size={25} color="grey" />
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
                        fontWeight="500"
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
          </PanGestureHandler>

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
                height: '70%',
              }
            }}>
            <Editable
              star={star}
              tasks={allTasks}
              navigation={navigation}
              selectedItem={selectedItem}
              starId={starId}
              myDayState={myDayState}
              formattedDueDate={formattedDueDate}
              updateTaskName={updateTaskName} />
          </RBSheet>
        </GestureHandlerRootView>
      </KeyboardAvoidingView>

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
  },
  overdueTag: {
    color: 'red',
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

  flatlistitem: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: 70
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

    // Background color for neumorphic effect
    backgroundColor: '#f5f5f5', // Adjust as needed

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

    width: '100%',
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

