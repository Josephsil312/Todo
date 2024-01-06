import {
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  ScrollView,
  Animated,
  Easing,
  Text,
  LayoutAnimation,
  Keyboard
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RBSheet from 'react-native-raw-bottom-sheet';
import { HeadingText } from '../../Texts';
import AddingTasks from './AddingTasks';
import { NavigationProp, ParamListBase, useFocusEffect } from '@react-navigation/native';
import Editable from '../Editable';
import Icon from 'react-native-vector-icons/FontAwesome';
import Iconn from 'react-native-vector-icons/EvilIcons'
import Iconfromentypo from 'react-native-vector-icons/Entypo'
import Iconchev from 'react-native-vector-icons/Entypo'
import Plusicon from 'react-native-vector-icons/AntDesign';
import { RectButton, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useTasks } from '../../TasksContextProvider';
import Swipeable from 'react-native-gesture-handler/Swipeable';

interface Props {
  navigation: NavigationProp<ParamListBase>;
}

const Tasks = ({ navigation }: Props) => {
  const textInputRef = useRef(null);
  const scrollViewRef = useRef(null);
  const refRBSheet = useRef<RBSheet>(null);
  const refEditableTask = useRef<RBSheet>(null);
  const [task, setTask] = useState('');
  const [isRBSheetOpen, setIsRBSheetOpen] = useState(false);
  const [rotationAnimation] = useState(new Animated.Value(0));
  const { allTasks, setAllTasks, selectedItem, setSelectedItem, star, starId, setStarId } = useTasks();
  const [showCompletedDropdown, setShowCompletedDropdown] = useState(false);
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

  const SwipeableRow = ({ item, onDelete }) => {
    const renderRightActions = (progress, dragX) => {
      const trans = dragX.interpolate({
        inputRange: [0, 50, 100, 101],
        outputRange: [-20, 0, 0, 1],
      });
      return (
        <RectButton style={styles.rightAction} onPress={onDelete}>
          <Animated.Text
            style={[
              styles.actionText,
              {
                transform: [{ translateX: trans }],
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
        <View style={styles.row}>
          <Text>{item.text}</Text>
        </View>
      </Swipeable>
    );
  };


  const handleAddTask = async () => {
    if (task.trim() !== '') {
      const taskId = Date.now().toString();
      const newTask = { id: taskId, name: task, isCompleted: false, isImportant: false };
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
            isImportant: task.isImportant || false, // Use isStarred for importance
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
      // setTasks(updatedTasks);
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

  useEffect(() => {
    Animated.timing(rotationAnimation, {
      toValue: showCompletedDropdown ? 1 : 0,
      duration: 300,
      easing: Easing.inOut(Easing.ease), // You can customize the easing function
      useNativeDriver: false, // 'false' because we're animating a style property that's not supported by the native driver
    }).start();
  }, [showCompletedDropdown, rotationAnimation]);

  const animatedStyle = {
    transform: [
      {
        rotate: rotationAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '90deg'],
        }),
      },
    ],
  };

  const openRBSheet = (item: any) => {
    if (refEditableTask?.current) {
      refEditableTask.current.open();
      setIsRBSheetOpen(true)
      setSelectedItem(item)
    }
  };

  const rightSwipe = (id: String) => {
    return (
      <View>
        <TouchableOpacity onPress={() => deleteTask(id)}>
          <Text>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const closeRBSheet = () => {
    if (refEditableTask?.current) {
      refEditableTask.current.close();
      setIsRBSheetOpen(false);
    }
  };



  console.log('allTasks', allTasks)

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
      <ScrollView style={styles.taskContainer} keyboardShouldPersistTaps='always' ref={scrollViewRef}>
        <GestureHandlerRootView>
          <FlatList
            data={allTasks.filter((task) => !task.isCompleted)}

            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <>
                <Swipeable renderRightActions={() => rightSwipe(item.id)} >
                  <View style={styles.flatlistitem}>
                    <Pressable
                      style={styles.incompletetasks}
                      onPress={() => { openRBSheet(item.name); setStarId(item.id) }}
                    >
                      <View style={styles.icontextcontainer}>
                        <TouchableOpacity onPress={() => handleCompleteTask(item.id)}>
                          <Icon name="circle-thin" size={23} color="grey" />
                        </TouchableOpacity>
                        <HeadingText
                          textString={item.name.trim()}
                          fontSize={16}
                          fontWeight="500"
                          fontFamily="SuisseIntl"
                          marginLeft={10}
                        />
                      </View>
                      <Pressable key={item.id} onPress={() => starChange(item.id)}>
                        {item.isImportant ? <Iconfromentypo name="star" size={22} color="grey" style={{ color: '#7568f8' }} />
                          : <Iconn name="star" size={25} color="grey" />
                        }
                      </Pressable>
                    </Pressable>
                  </View>
                </Swipeable>
              </>
            )}
          />
        </GestureHandlerRootView>


        <Pressable onPress={toggleCompletedDropdown} style={styles.completedlistlength}>
          <Animated.View style={[animatedStyle]}>
            <Iconchev name="chevron-small-right" size={20} color="white" />
          </Animated.View>
          <HeadingText
            textString={`Completed ${allTasks.filter((task) => task.isCompleted).length}`}
            fontSize={16}
            fontWeight="500"
            fontFamily="SuisseIntl"
            color='white'
          ></HeadingText>
        </Pressable>


        {showCompletedDropdown && (
          <GestureHandlerRootView>
            <FlatList
              style={{ marginBottom: 10 }}
              data={allTasks.filter((task) => task.isCompleted)}
              renderItem={({ item }) => (
                <>
                  <Swipeable renderRightActions={() => rightSwipe(item.id)}>
                    <View style={styles.flatlistitem}>
                      <Pressable
                        key={item.id}
                        style={styles.completedtasks}
                        onPress={() => { openRBSheet(item.name); setStarId(item.id) }}
                      >
                        <View style={{ flexDirection: 'row', marginLeft: -2.5 }}>
                          <TouchableOpacity onPress={() => {
                            toggleTask(item.id);
                          }}>
                            <Image
                              source={require('../../../../assets/images/checkedCircle.png')}
                              style={{ height: 25, width: 25 }}
                            />
                          </TouchableOpacity>
                          <HeadingText
                            textString={item.name.trim()}
                            fontSize={16}
                            fontWeight="500"
                            fontFamily="SuisseIntl"
                            textDecorationLine="line-through"
                            marginLeft={7}
                          />
                        </View>
                        <Pressable key={item.id} onPress={() => starChange(item.id)}>
                          {item.isImportant ? <Iconfromentypo name="star" size={22} color="grey" style={{ color: '#7568f8' }} />
                            : <Iconn name="star" size={25} color="grey" />
                          }
                        </Pressable>
                      </Pressable>
                    </View>
                  </Swipeable>
                </>)}

              keyExtractor={item => item.id.toString()}
            />
          </GestureHandlerRootView>
        )}

        <RBSheet
          ref={refRBSheet}
          closeOnDragDown={false}
          closeOnPressMask={true}
          animationType="fade"
          height={70}
          isOpen={isRBSheetOpen}
          onClose={closeRBSheet}
          customStyles={{
            wrapper: {
              backgroundColor: 'transparent',
            },
            draggableIcon: {
              backgroundColor: '#000',

            },
            container: {
              height: 80,
            }
          }}>
          <AddingTasks
            handleAddTask={handleAddTask}
            task={task}
            setTask={setTask}
            inputRef={textInputRef}
            color={'#7568f8'}
          />
        </RBSheet>

        <RBSheet
          ref={refEditableTask}
          closeOnDragDown={false}
          closeOnPressMask={true}
          animationType="slide"
          height={70}
          isOpen={isRBSheetOpen}
          customStyles={{
            wrapper: {
              backgroundColor: 'transparent',
            },
            draggableIcon: {
              backgroundColor: '#000',

            },
            container: {
              height: '40%',
            }
          }}>
          <Editable star={star} tasks={allTasks} navigation={navigation} selectedItem={selectedItem} starId={starId} />

        </RBSheet>

      </ScrollView>

      <View
        style={styles.addicon}>

        <Pressable
          onPress={() => {

            if (refRBSheet?.current) {
              refRBSheet.current.open();
              setIsRBSheetOpen(true)
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
  separator: {
    backgroundColor: 'rgb(200, 199, 204)',
    height: StyleSheet.hairlineWidth,
  },
  completedlistlength: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10
  },
  icontextcontainer: {
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  taskContainer: {
    flexGrow: 1,
    backgroundColor: '#7568f8',
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
  flatlistitem: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  row: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
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
    width: '100%'
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
    marginBottom: 6,
    justifyContent: 'space-between',
    elevation: 6,
    width: '100%'
  }
});
export default Tasks;

