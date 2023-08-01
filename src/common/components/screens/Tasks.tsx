import {
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Keyboard,
  Text,
  Image,
  ImageBackground,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RBSheet from 'react-native-raw-bottom-sheet';
import {HeadingText} from '../../Texts';
import Modal from 'react-native-modal';
import AddingTasks from './AddingTasks';
import {RowContainer} from '../../../styled';
// import Icon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Feather';
import {NavigationProp, ParamListBase} from '@react-navigation/native';

interface Props {
  navigation: NavigationProp<ParamListBase>;
}

const Tasks = ({navigation}: Props) => {
  const [showModal, setShowModal] = useState(false);
  const refRBSheet = useRef<RBSheet>(null);
  const [task, setTask] = useState('');
  const inputRef = useRef<RBSheet>(null);
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

  if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  const handleAddTask = async () => {
    if (task.trim() !== '') {
      Keyboard.dismiss();
      const taskId = Date.now().toString();
      const newTask = {id: taskId, name: task};
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      setTask('');
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      try {
        await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      } catch (error) {
        console.log('Error saving tasks to AsyncStorage:', error);
      }
    }
  };

  const handleModalOpen = () => {
    setShowModal(true);
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

  return (
    <View style={styles.taskContainer}>
      <RowContainer>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleModalOpen}>
          <Icon name="more-vertical" size={25} color="white" />
        </TouchableOpacity>
      </RowContainer>
      <HeadingText
        textString={'Tasks'}
        fontSize={25}
        fontWeight="700"
        fontFamily="SuisseIntl"
        color="white"
      />

      <FlatList
        style={{marginTop: 10}}
        data={tasks.filter(task => !completedTasks.some(c => c.id === task.id))}
        keyExtractor={item => item.key}
        renderItem={({item}) => (
          <TouchableOpacity
            style={{
              backgroundColor: '#f2f2f2',
              paddingVertical: 20,
              paddingHorizontal: 10,
              borderRadius: 5,
              marginBottom: 3,
              flexDirection: 'row',
              alignItems: 'center',
            }}
            onPress={() => handleCompleteTask(item.id)}>
            <Image
              source={require('../../../../../todo/assets/images/emptyCircle.png')}
              style={styles.image}
            />
            <HeadingText
              textString={item.name}
              fontSize={16}
              fontWeight="500"
              fontFamily="SuisseIntl"
            />
          </TouchableOpacity>
        )}
      />
      <View
        style={{
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
        }}>
        <TouchableOpacity onPress={toggleCompletedDropdown}>
          <Text style={{marginVertical: 10, color: 'white'}}>
            {completedTasks.length > 0 && `Completed ${completedTasks.length}`}
          </Text>
        </TouchableOpacity>
      </View>

      {showCompletedDropdown && (
        <FlatList
          data={completedTasks}
          renderItem={({item}) => (
            <TouchableOpacity
              key={item.key}
              style={{
                backgroundColor: '#f2f2f2',
                paddingVertical: 20,
                paddingHorizontal: 10,
                borderRadius: 5,
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 3,
              }}
              onPress={() => {
                completeTask(item.id);
              }}>
              <ImageBackground
                source={require('../../../../../todo/assets/images/radio-on-2x.png')}
                style={styles.image}>
                <Image
                  source={require('../../../../../todo/assets/images/checkmark-white.png')}
                  style={{
                    height: 10,
                    width: 14,
                    resizeMode: 'contain',
                    alignSelf: 'center',
                    marginVertical: 6,
                    marginHorizontal: 2,
                  }}
                />
              </ImageBackground>
              <HeadingText
                textString={item.name}
                fontSize={16}
                fontWeight="500"
                fontFamily="SuisseIntl"
                textDecorationLine="line-through"
              />
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id.toString()}
        />
      )}

      <View
        style={{
          justifyContent: 'flex-end',
          flexDirection: 'row',
        }}>
        <TouchableOpacity
          onPress={() => {
            if (refRBSheet?.current) {
              refRBSheet.current.open();
              setTimeout(() => {
                Keyboard.dismiss();
                if (inputRef.current) {
                  inputRef.current.focus();
                }
              }, 100);
            }
          }}>
          <Image
            source={require('../../../../../todo/assets/images/ic_add_enable.png')}
            style={{
              width: 30,
              height: 30,
            }}
          />
        </TouchableOpacity>
      </View>

      {/* Button to open modal */}

      {/* Modal */}
      <Modal
        style={{justifyContent: 'flex-start', margin: 0}}
        isVisible={showModal}
        animationIn="fadeIn"
        animationOut="fadeOut"
        animationOutTiming={1000}
        animationInTiming={400}
        onBackdropPress={() => setShowModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.imageTextContainer}>
              <Icon name="Sort Ascending" size={20} style={{marginRight: 20}} />
              <HeadingText
                textString={'My Day'}
                fontSize={16}
                fontWeight="500"
                fontFamily="SuisseIntl"
              />
            </TouchableOpacity>
            <HeadingText
              textString={'Add shortcut to homescreen'}
              fontSize={16}
              fontWeight="500"
              fontFamily="SuisseIntl"
              marginBottom={10}
            />
            <HeadingText
              textString={'Change'}
              fontSize={16}
              fontWeight="500"
              fontFamily="SuisseIntl"
              marginBottom={10}
            />
            <HeadingText
              textString={'Send a copy'}
              fontSize={16}
              fontWeight="500"
              fontFamily="SuisseIntl"
              marginBottom={10}
            />
            <HeadingText
              textString={'Duplicate list'}
              fontSize={16}
              fontWeight="500"
              fontFamily="SuisseIntl"
            />
            {/* Button to close modal */}
          </View>
        </View>
      </Modal>

      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={false}
        closeOnPressMask={true}
        animationType="fade"
        height={70}
        customStyles={{
          wrapper: {
            backgroundColor: 'transparent',
          },
          draggableIcon: {
            backgroundColor: '#000',
          },
        }}>
        <AddingTasks
          handleAddTask={handleAddTask}
          task={task}
          setTask={setTask}
          inputRef={inputRef}
        />
      </RBSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 22,
    height: 22,
    marginRight: 15,
  },
  taskContainer: {
    flex: 1,
    backgroundColor: '#6eb1ff',
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
