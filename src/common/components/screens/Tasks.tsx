import {View, TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import React, {useState, useRef} from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import {HeadingText} from '../../Texts';
import Modal from 'react-native-modal';
import AddingTasks from './AddingTasks';
import {RowContainer} from '../../../styled';
import {SafeAreaView} from 'react-native-safe-area-context';
// import Icon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Feather';
import {useDispatch, useSelector} from 'react-redux';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {addTask, deleteTask, completeTask} from '../../../../src/tasksSlice';

interface Props {
  navigation: NavigationProp<ParamListBase>;
}

const Tasks = ({navigation}: Props) => {
  const [showModal, setShowModal] = useState(false);
  const refRBSheet = useRef<RBSheet>(null);
  const [task, setTask] = useState('');
  const tasks = useSelector(
    (state: {tasks: {tasks: any}}) => state.tasks.tasks,
  );

  const dispatch = useDispatch();

  const handleAddTask = () => {
    if (task.trim() !== '') {
      dispatch(addTask(task));
      setTask('');
    }
  };
  const handleDeleteTask = (taskId: any) => {
    dispatch(deleteTask(taskId));
  };

  const handleCompleteTask = (taskId: any) => {
    dispatch(completeTask(taskId));
  };
  const handleModalOpen = () => {
    setShowModal(true);
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
          data={tasks}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <TouchableOpacity
              style={{
                backgroundColor: '#f2f2f2',
                paddingVertical: 20,
                paddingHorizontal: 10,
                borderRadius: 5,
                marginBottom: 1,
              }}
              onPress={() => handleCompleteTask(item.id)}
              onLongPress={() => handleDeleteTask(item.id)}>
              <HeadingText
                textString={item}
                fontSize={16}
                fontWeight="600"
                fontFamily="SuisseIntl"
              />
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
      <View
        style={{justifyContent: 'flex-end', flex: 8, alignItems: 'flex-end'}}>
        <TouchableOpacity onPress={() => refRBSheet?.current?.open()}>
          <Icon
            name="plus-circle"
            size={40}
            color="white"
            // eslint-disable-next-line react-native/no-inline-styles
          />
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
        height={100}
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
    flex: 1,
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
