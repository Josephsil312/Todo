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
  LayoutAnimation
} from 'react-native';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RBSheet from 'react-native-raw-bottom-sheet';
import { HeadingText } from '../../Texts';
import AddingTasks from './AddingTasks';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import Editable from '../Editable';
import Icon from 'react-native-vector-icons/FontAwesome';
import Iconn from 'react-native-vector-icons/EvilIcons'
import Iconfromentypo from 'react-native-vector-icons/Entypo'
import Iconchev from 'react-native-vector-icons/Entypo'
import Plusicon from 'react-native-vector-icons/AntDesign';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';

interface Props {
  navigation: NavigationProp<ParamListBase>;
}

const Tasks = ({ navigation }: Props) => {
  const textInputRef = useRef(null);
  const scrollViewRef = useRef(null);
  const refRBSheet = useRef<RBSheet>(null);
  const refEditableTask = useRef<RBSheet>(null);
  const [task, setTask] = useState('');
  const [star, setStar] = useState<Record<string, boolean>>({});
  const [isRBSheetOpen, setIsRBSheetOpen] = useState(false);
  const [rotationAnimation] = useState(new Animated.Value(0));
  const [starId, setStarId] = useState('');
  const [selectedItem, setSelectedItem] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [tasks, setTasks] = useState<
    {
      id: string;
      name: string;
    }[]
  >([]);
  const [completedTasks, setCompletedTasks] = useState<
    {
      id: string;
      name: string;
    }[]
  >([]);
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


  const handleAddTask = async () => {
    if (task.trim() !== '') {
      const taskId = Date.now().toString();
      const newTask = { id: taskId, name: task };
      const updatedTasks = [...tasks, newTask];
      try {
        await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
        setTasks(updatedTasks);
        setTask('');

      } catch (error) {
        console.error('Error saving tasks to AsyncStorage:', error);
      }
    }
  };

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const savedTasks = await AsyncStorage.getItem('tasks');
        if (savedTasks) {
          const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
            ...task,
            key: task.id, // Assign the id as the key
          }));
          setTasks(parsedTasks);
        }
      } catch (error) {
        console.log('Error loading tasks from AsyncStorage:', error);
      }
    };
    loadTasks();
  }, []);

  const deleteTask = async (id: String) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      Animate()
      setTasks(updatedTasks);
      setTask('');
    } catch (error) {
      console.error('Error saving tasks to AsyncStorage:', error);
    }
  }

  const handleCompleteTask = async (taskId: string) => {
    try {
      const completedTask = tasks.find(task => task.id === taskId);

      if (completedTask) {
        const updatedTasks = tasks.filter(task => task.id !== taskId);
        const updatedCompletedTasks = [...completedTasks, completedTask];
        Animate()//animation
        setTasks(updatedTasks);
        setCompletedTasks(updatedCompletedTasks);
        await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
        await AsyncStorage.setItem(
          'completedTasks',
          JSON.stringify(updatedCompletedTasks),
        );
      }
    } catch (error) {
      console.log('Error updating task:', error);
    }
  };

  const deleteCompleted = async (id: any) => {
    const updatedCompletedTasks = completedTasks.filter((task) => task.id !== id)
    setCompletedTasks(updatedCompletedTasks)
    Animate()
    try {
      await AsyncStorage.setItem(
        'completedTasks',
        JSON.stringify(updatedCompletedTasks),
      );
    } catch (error) {
      console.log('Error deleting completed task:', error);
    }
  }

  useEffect(() => {
    const loadCompletedTasks = async () => {
      try {
        const savedCompletedTasks = await AsyncStorage.getItem(
          'completedTasks',
        );
        if (savedCompletedTasks) {
          setCompletedTasks(JSON.parse(savedCompletedTasks));
        }
      } catch (error) {
        console.log('Error loading completed tasks from AsyncStorage:', error);
      }
    };
    loadCompletedTasks();
  }, []);

  useEffect(() => {
    const saveCompletedTasks = async () => {
      try {
        await AsyncStorage.setItem(
          'completedTasks',
          JSON.stringify(completedTasks),
        );
      } catch (error) {
        console.log('Error saving completed tasks to AsyncStorage:', error);
      }
    };
    saveCompletedTasks();
  }, [completedTasks]);

  const toggleCompletedDropdown = () => {
    Animate()
    setShowCompletedDropdown(!showCompletedDropdown);
  };

  const completeTask = async (taskId: string) => {
    const completedTaskIndex = completedTasks.findIndex(
      task => task.id === taskId,
    );
    if (completedTaskIndex !== -1) {
      const completedTask = completedTasks[completedTaskIndex];
      const updatedCompletedTasks = [...completedTasks];
      updatedCompletedTasks.splice(completedTaskIndex, 1);
      Animate()
      setCompletedTasks(updatedCompletedTasks);
      setTasks(prevTasks => [...prevTasks, completedTask]);
      try {
        await AsyncStorage.setItem(
          'completedTasks',
          JSON.stringify(updatedCompletedTasks),
        );
        await AsyncStorage.setItem(
          'tasks',
          JSON.stringify([...tasks, completedTask]),
        );
      } catch (error) {
        console.log('Error updating AsyncStorage:', error);
      }
    }
  };

  const starChange = (id: string) => {
    setStar((prevStars) => {
      const updatedStars = { ...prevStars, [id]: !prevStars[id] };
      return updatedStars;
    });
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
        <TouchableOpacity onPress = {() =>deleteTask(id)}>
          <Text>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  }
  const rightSwipee = (id: String) => {
    
    return (
      <View>
        <TouchableOpacity onPress = {() => deleteCompleted(id)}>
          <Text>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  }


  return (
    <>
      <ScrollView style={styles.taskContainer} keyboardShouldPersistTaps='always' ref={scrollViewRef}>
        <GestureHandlerRootView>
          <FlatList
            data={tasks.filter(task => !completedTasks.some(c => c.id === task.id))}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <>
                <Swipeable renderRightActions={() => rightSwipe(item.id)}>
                  <View style={styles.flatlistitem}>
                    <Pressable
                      style={styles.incompletetasks}
                      onPress={() => { openRBSheet(item.name); setStarId(item.id) }}
                    >
                      <View style={styles.icontextcontainer}>
                        <TouchableOpacity onPress={() => handleCompleteTask(item.id)}>
                          <Icon name="circle-thin" size={22} color="grey" />
                        </TouchableOpacity>
                        <HeadingText
                          textString={item.name}
                          fontSize={16}
                          fontWeight="500"
                          fontFamily="SuisseIntl"
                          marginLeft={10}
                        />
                      </View>
                      <Pressable key={item.id} onPress={() => starChange(item.id)}>
                        {star[item.id] ? <Iconfromentypo name="star" size={22} color="grey" style={{ color: '#f5eb05' }} />
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

        {<Text>{completedTasks.length}</Text> &&
          <Pressable onPress={toggleCompletedDropdown} style={styles.completedlistlength}>
            <Animated.View style={[animatedStyle]}>
              <Iconchev name="chevron-small-right" size={20} color="white" />
            </Animated.View>
            <HeadingText
              textString={`Completed ${completedTasks.length}`}
              fontSize={16}
              fontWeight="500"
              fontFamily="SuisseIntl"
              color='white'
            ></HeadingText>
          </Pressable>
        }

        {showCompletedDropdown && (
          <GestureHandlerRootView>
            <FlatList
              style={{ marginBottom: 10 }}
              data={completedTasks}
              renderItem={({ item }) => (
                <>
                  <Swipeable renderRightActions={() => rightSwipee(item.id)}>
                    <View style={styles.flatlistitem}>
                      <Pressable
                        key={item.id}
                        style={styles.completedtasks}
                        onPress={() => { openRBSheet(item.name); setStarId(item.id) }}
                      >
                        <View style={{ flexDirection: 'row', marginLeft: -2.5 }}>
                          <TouchableOpacity onPress={() => {
                            completeTask(item.id);
                          }}>
                            <Image
                              source={require('../../../../assets/images/checkedCircle.png')}
                              style={{ height: 25, width: 25 }}
                            />
                          </TouchableOpacity>
                          <HeadingText
                            textString={item.name}
                            fontSize={16}
                            fontWeight="500"
                            fontFamily="SuisseIntl"
                            textDecorationLine="line-through"
                            marginLeft={7}
                          />
                        </View>
                        <Iconn name="star" size={25} color="grey" />
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
          <Editable starId={starId} tasks={tasks} setTasks={setTasks} navigation={navigation} star={star} selectedItem={selectedItem} />

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
          <Plusicon name="pluscircle" size={45} color="#cec9fc" style={{
            shadowColor: '#444167', elevation: 6, shadowOpacity: 0.6,
            shadowRadius: 20
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
    marginBottom: 7
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
  icons: {

  },
  incompletetasks: {
    elevation: 6,
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 6,
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
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    justifyContent: 'space-between',
    elevation: 6,
    width: '100%'
  }
});
export default Tasks;

