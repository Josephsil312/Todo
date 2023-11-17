import {
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Keyboard,
  Text,
  Image,
  LayoutAnimation,
  Platform,
  UIManager,
  ScrollView
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RBSheet from 'react-native-raw-bottom-sheet';
import { HeadingText } from '../../Texts';
import AddingTasks from './AddingTasks';
import { RowContainer } from '../../../styled';
import { NavigationProp, ParamListBase,useFocusEffect } from '@react-navigation/native';



interface Props {
  navigation: NavigationProp<ParamListBase>;
}

const Tasks = ({ navigation }: Props) => {

  const refRBSheet = useRef<RBSheet>(null);
  const [task, setTask] = useState('');
  const [star, setStar] = useState(true)
  const inputRef = useRef<RBSheet>(null);
  const [isRBSheetOpen, setIsRBSheetOpen] = useState(false);

  const [tasks, setTasks] = useState<
    {
      id: string;
      name: string;
      position: number;
      key: string;
    }[]
  >([]);
  const [completedTasks, setCompletedTasks] = useState<
    {
      id: string;
      name: string;
      position: number;
      key: string;
    }[]
  >([]);

  const [showCompletedDropdown, setShowCompletedDropdown] = useState(false);
  const [toggleCheckBox, setToggleCheckBox] = useState(false)

  if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  useFocusEffect(
    React.useCallback(() => {
      if (isRBSheetOpen && refRBSheet?.current) {
        refRBSheet.current.close();
      }
    }, [isRBSheetOpen])
  );
  const handleAddTask = async () => {
    if (task.trim() !== '') {
      Keyboard.dismiss();
      const taskId = Date.now().toString();
      const newTask = { id: taskId, name: task };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      setTask('');
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      try {
        await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
        if (refRBSheet?.current) {
          refRBSheet.current.close();
          setIsRBSheetOpen(false); // Close the RBSheet after adding a task
        }
      } catch (error) {
        console.log('Error saving tasks to AsyncStorage:', error);
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
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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
    setShowCompletedDropdown(!showCompletedDropdown);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  const completeTask = async (taskId: string) => {
    const completedTaskIndex = completedTasks.findIndex(
      task => task.id === taskId,
    );
    if (completedTaskIndex !== -1) {
      const completedTask = completedTasks[completedTaskIndex];
      const updatedCompletedTasks = [...completedTasks];
      updatedCompletedTasks.splice(completedTaskIndex, 1);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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


  const rightSwipe = () => {
    return (
      <View
        style={{
          backgroundColor: 'red',
          width: '80%',
          borderRadius: 5,
          height: 62,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity />
        <Text>Delete</Text>
      </View>
    );
  };
  const starChange = () => {
    setStar((prev) => !prev)
  }
  return (
    <>
    <ScrollView style={styles.taskContainer}>
        <RowContainer>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={require('../../../../assets/images/chevron_left.png')} style={{ width: 30, height: 30 }} />
          </TouchableOpacity>
         
        </RowContainer>
        <HeadingText
          textString={'Tasks'}
          fontSize={25}
          fontWeight="700"
          fontFamily="SuisseIntl"
          color="black"
        />

        <FlatList
          style={{ marginTop: 10 }}
          data={tasks.filter(task => !completedTasks.some(c => c.id === task.id))}
          keyExtractor={item => item.key}
          renderItem={({ item }) => (
            <>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <TouchableOpacity
                  activeOpacity={1}
                  style={{
                    elevation: 4,
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
                    shadowRadius: 10,
                    borderWidth: 1,
                    borderColor: '#004364',
                    width: '100%'
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                    <TouchableOpacity onPress={() => handleCompleteTask(item.id)}>
                      <Image
                        source={require('../../../../assets/images/emptyCircle.png')}
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
                  <TouchableOpacity activeOpacity={1} onPress={starChange}>
                    <Image source={star ? require('../../../../assets/images/star.png') : require('../../../../assets/images/starfilled.png')} />
                  </TouchableOpacity>

                </TouchableOpacity>
              </View>
            </>
          )}
        />

          <View
            style={{
              alignItems: 'flex-start',
            }}>
            <TouchableOpacity activeOpacity={1} onPress={toggleCompletedDropdown}>
              <Text style={{ marginVertical: 10, color: 'black' }}>
                {completedTasks.length > 0 && `Completed ${completedTasks.length}`}
              </Text>
            </TouchableOpacity>
          </View>
       


        {showCompletedDropdown && (
          <FlatList
           style = {{marginBottom:10}}
            data={completedTasks}
            renderItem={({ item }) => (
              <>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <TouchableOpacity
                    activeOpacity={1}
                    key={item.key}
                    style={{
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
                      elevation: 4,
                      borderWidth: 1,
                      borderColor: '#004364',
                      width: '100%'
                    }}
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
          // isOpen={isRBSheetOpen}
          customStyles={{
            wrapper: {
              backgroundColor: 'transparent',
              
            },
            draggableIcon: {
              backgroundColor: '#000',
              
            },
            container:{
              height:90
            }
          }}>
          <AddingTasks
            handleAddTask={handleAddTask}
            task={task}
            setTask={setTask}
            inputRef={inputRef}
          />
        </RBSheet>
    </ScrollView>
    <View
    style={{
      position: 'absolute',
      bottom: 7, 
      right: 7, 
    }}>
    <TouchableOpacity
  onPress={() => {
    if (refRBSheet?.current) {
      refRBSheet.current.open();
      // setIsRBSheetOpen(true)
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  }}>
      <Image
        source={require('../../../../assets/images/add.png')}
        style={{
          width: 70,
          height: 70,  
        }}
      />
    </TouchableOpacity>
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
    flex: 1,
    backgroundColor: '#F0F8FF',
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
});
export default Tasks;

