import {
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Pressable,
  Text,
  Image,
  LayoutAnimation,
  Platform,
  UIManager,
  ScrollView,
  Animated,
  Easing
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RBSheet from 'react-native-raw-bottom-sheet';
import { HeadingText } from '../../Texts';
import AddingTasks from './AddingTasks';
import { RowContainer } from '../../../styled';
import { NavigationProp, ParamListBase, useFocusEffect } from '@react-navigation/native';

interface Props {
  navigation: NavigationProp<ParamListBase>;
}

const Tasks = ({ navigation }: Props) => {
  const textInputRef = useRef(null);
  const scrollViewRef = useRef(null);
  const refRBSheet = useRef<RBSheet>(null);
  const [task, setTask] = useState('');
  const [star, setStar] = useState<Record<string, boolean>>({});
  const [isRBSheetOpen, setIsRBSheetOpen] = useState(false);
  const [rotationAnimation] = useState(new Animated.Value(0));
  const scrollY = useRef(new Animated.Value(0)).current;
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

  if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const handleAddTask = async () => {
    if (task.trim() !== '') {
      const taskId = Date.now().toString();
      const newTask = { id: taskId, name: task };
      const updatedTasks = [...tasks, newTask];

      // Set state and AsyncStorage first
      try {
        await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
        setTasks(updatedTasks);
        setTask('');
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

  const handleCompleteTask = async (taskId: string) => {
    try {
      const completedTask = tasks.find(task => task.id === taskId);

      if (completedTask) {
        const updatedTasks = tasks.filter(task => task.id !== taskId);
        const updatedCompletedTasks = [...completedTasks, completedTask];
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

  // const headerHeight = scrollY.interpolate({
  //   inputRange: [20, 100], // adjust the range based on when you want the animation to happen
  //   outputRange: [35, 15], // adjust the height values
  //   extrapolate: 'clamp',
  // });

  // const headerTranslateY = scrollY.interpolate({
  //   inputRange: [0, 100], // adjust the range based on when you want the animation to happen
  //   outputRange: [0, -15], // adjust the translateY values
  //   extrapolate: 'clamp',
  // });

  return (
    <>
      <ScrollView style={styles.taskContainer} keyboardShouldPersistTaps='always' onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: false } // make sure to set this to false when using contentOffset
      )}
      scrollEventThrottle={16} ref={scrollViewRef}>
        <RowContainer>
          <TouchableOpacity onPress={() => navigation.goBack()}>

            <Image source={require('../../../../assets/images/chevron_left.png')} style={{ width: 30, height: 30 }} />

          </TouchableOpacity>

        </RowContainer>
        {/* <Animated.Text
        style={[
          {
            fontSize: headerHeight,
            transform: [{ translateY: headerTranslateY }],
          },
        ]}
      > */}
        <HeadingText
          textString={'Tasks'}
          // fontSize={25}
          fontWeight="700"
          fontFamily="SuisseIntl"
          color="white"
        />
{/* </Animated.Text> */}
        <FlatList
          style={{ marginTop: 10 }}
          data={tasks.filter(task => !completedTasks.some(c => c.id === task.id))}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <TouchableOpacity
                  activeOpacity={1}
                  style={styles.incompletetasks}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                    <TouchableOpacity onPress={() => handleCompleteTask(item.id)}>
                      <Image
                        source={require('../../../../assets/images/empty_circlee.png')}
                        style={styles.image}
                      />
                    </TouchableOpacity>
                    <HeadingText
                      textString={item.name}
                      fontSize={16}
                      fontWeight="500"
                      fontFamily="SuisseIntl"
                    />
                  </View>
                  <Pressable key={item.id} onPress={() => starChange(item.id)}>
                    <Image source={star[item.id] ? require('../../../../assets/images/starfilled.png') : require('../../../../assets/images/star.png')} />
                  </Pressable>

                </TouchableOpacity>
              </View>
            </>
          )}
        />

        {completedTasks.length > 0 &&
          <Pressable onPress={toggleCompletedDropdown} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 7 }}>
            <Animated.View style={[animatedStyle]}>
              <Image source={require('../../../../assets/images/completed.png')}
              />
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
          <FlatList
            style={{ marginBottom: 10 }}
            data={completedTasks}
            renderItem={({ item }) => (
              <>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <TouchableOpacity
                    activeOpacity={1}
                    key={item.id}
                    style={styles.completedtasks}
                  >
                    <View style={{ flexDirection: 'row' }}>
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
                        marginLeft={10}

                      />
                    </View>
                    <Image source={require('../../../../assets/images/star.png')} />
                  </TouchableOpacity>
                </View>
              </>)}

            keyExtractor={item => item.id.toString()}
          />
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
      </ScrollView>

      <View
        style={{
          position: 'absolute',
          bottom: 7,
          right: 7,
        }}>
        <Pressable
          onPress={() => {
            if (refRBSheet?.current) {
              refRBSheet.current.open();
              setIsRBSheetOpen(true)
            }
          }}>
          <Image
            source={require('../../../../assets/images/addd.png')}
            style={{
              width: 70,
              height: 70,
            }}

          />
          {/* <TextInput placeholder='text'/> */}
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
  taskContainer: {
    flexGrow: 1,
    backgroundColor: '#8B80F9',
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
  imageTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    height: 75,
    width: 150,
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

