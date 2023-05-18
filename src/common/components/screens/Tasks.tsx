import {
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Keyboard,
  Text,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import RBSheet from 'react-native-raw-bottom-sheet';
import {HeadingText} from '../../Texts';
import Modal from 'react-native-modal';
import AddingTasks from './AddingTasks';
import {RowContainer} from '../../../styled';
import {SafeAreaView} from 'react-native-safe-area-context';
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
  const [tasks, setTasks] = useState<
    {
      completed: any;
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

  const handleAddTask = async () => {
    if (task.trim() !== '') {
      Keyboard.dismiss();
      const taskId = Date.now().toString();
      const newTask = {id: taskId, name: task};
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      setTask('');
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
          setTasks(JSON.parse(savedTasks));
        }
      } catch (error) {
        console.log('Error loading tasks from AsyncStorage:', error);
      }
    };

    loadTasks();
  }, []);

  const handleDeleteTask = async (taskId: string) => {
    try {
      const completedTask = tasks.find(task => task.id === taskId);

      if (completedTask) {
        const updatedTasks = tasks.filter(task => task.id !== taskId);
        const updatedCompletedTasks = [...completedTasks, completedTask];

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

      <SafeAreaView>
        <FlatList
          style={{marginTop: 10}}
          data={tasks.filter(
            task => !completedTasks.some(c => c.id === task.id),
          )}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <TouchableOpacity
              style={{
                backgroundColor: '#f2f2f2',
                paddingVertical: 20,
                paddingHorizontal: 10,
                borderRadius: 5,
                marginBottom: 1,
                flexDirection: 'row',
                alignItems: 'center',
              }}
              onPress={() => handleDeleteTask(item.id)}>
              <Icon
                name="circle"
                size={20}
                color="grey"
                style={{marginRight: 10}}
              />
              <Text
                style={{
                  fontWeight: '700',
                  fontFamily: 'SuisseIntl',
                  fontSize: 16,
                }}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />

        {showCompletedDropdown && (
          <View style={{backgroundColor: '#f2f2f2', padding: 10}}>
            {completedTasks.map(task => (
              <TouchableOpacity
                key={task.id}
                style={{flexDirection: 'row', alignItems: 'center'}}
                onPress={() => handleDeleteTask(task.id)}>
                <Icon
                  name="check-circle"
                  size={20}
                  color="green"
                  style={{marginRight: 10}}
                />
                <Text
                  style={{
                    fontWeight: 'normal',
                    fontFamily: 'SuisseIntl',
                    fontSize: 16,
                    textDecorationLine: 'line-through',
                  }}>
                  {task.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </SafeAreaView>
      <TouchableOpacity onPress={toggleCompletedDropdown}>
        <Text style={{marginVertical: 10}}>
          {showCompletedDropdown ? 'Hide Completed' : 'Show Completed'}
        </Text>
      </TouchableOpacity>

      <View
        style={{justifyContent: 'flex-end', flex: 8, alignItems: 'flex-end'}}>
        <TouchableOpacity onPress={() => refRBSheet?.current?.open()}>
          <Icon name="plus-circle" size={40} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        {/* Button to open modal */}

        {/* Modal */}
        <Modal
          style={{justifyContent: 'flex-start', margin: 0}}
          isVisible={showModal}
          animationIn="fadeIn"
          animationOut="fadeOut"
          animationOutTiming={500}
          onBackdropPress={() => setShowModal(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* Content of the modal */}

              <TouchableOpacity style={styles.imageTextContainer}>
                <Icon
                  name="Sort Ascending"
                  size={20}
                  style={{marginRight: 20}}
                />
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
      </View>

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
          // tasks={tasks}
          setTask={setTask}
        />
      </RBSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 30,
    height: 30,
  },
  taskContainer: {
    flex: 1,
    backgroundColor: '#6eb1ff',
    padding: 10,
  },
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
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
