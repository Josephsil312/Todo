import { Text, StyleSheet, View, TouchableOpacity, FlatList, KeyboardAvoidingView, SectionList, Pressable, ScrollView, LayoutAnimation } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { useTasks } from '../../TasksContextProvider';
import Icon from 'react-native-vector-icons/FontAwesome';
import Iconn from 'react-native-vector-icons/EvilIcons'
import Iconfromentypo from 'react-native-vector-icons/Entypo'
import Iconchev from 'react-native-vector-icons/Entypo'
import Plusicon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HeadingText } from '../../Texts';
import RBSheet from 'react-native-raw-bottom-sheet';
import AddingTasks from './AddingTasks';
import Calendarr from 'react-native-vector-icons/EvilIcons';
import Check from 'react-native-vector-icons/AntDesign';
import { isAfter, isYesterday, subDays, isSameDay, isTomorrow, parse, isBefore, format, startOfToday } from 'date-fns';
interface Props {
  navigation: NavigationProp<ParamListBase>;
}
const Important = ({ navigation }: Props) => {

  const { allTasks, setAllTasks, dueDate } = useTasks();
  const refRBSheet = useRef<RBSheet>(null);
  const [isRBSheetOpen, setIsRBSheetOpen] = useState(false);
  const [task, setTask] = useState('');

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
      const newTask = {
        id: taskId,
        name: task,
        isCompleted: false,
        isImportant: false,
        dateSet: dueDate,
        planned: true
      };
      const updatedTasks = [newTask, ...allTasks];
      try {
        await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
        Animate()
        setAllTasks(updatedTasks)
        setTask('');
        if (!newTask.dateSet) {
          backToTask(newTask.id);
        }
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
          const parsedTasks = JSON.parse(savedTasks).map((task) => ({
            ...task,
            key: task.id,
            isCompleted: !!task.isCompleted, // Parse completion state
            isImportant: task.isImportant || false,
          }));
          setAllTasks(parsedTasks);
        }
      } catch (error) {
        console.log('Error loading tasks from AsyncStorage:', error);
      }
    };
    loadTasks();
  }, []);

  const filteredImportantTasks = allTasks.filter(task => task.dateSet && task.isCompleted === false);

  const backToTask = async (id) => {
    const pushBackToTask = allTasks.filter((task) => task.id === id);
    if (pushBackToTask.length > 0) {
      const newTask = { ...pushBackToTask[0], isImportant: false }; // Update isImportant to false
      const updatedTasks = [...allTasks.filter((task) => task.id !== id), newTask];

      try {
        await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
        setAllTasks(updatedTasks);
        Animate();
      } catch (error) {
        console.error('Error saving tasks to AsyncStorage:', error);
      }
    }
  };

  const backToCompleted = async (id) => {
    const pushBackToTask = allTasks.filter((task) => task.id === id);
    if (pushBackToTask.length > 0) {
      const updatedTask = { ...pushBackToTask[0], isCompleted: true, isImportant: true };
      const updatedTasks = allTasks.map((task) =>
        task.id === id ? updatedTask : task
      );
      try {
        await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
        setAllTasks(updatedTasks);
      } catch (error) {
        console.error('Error saving tasks to AsyncStorage:', error);
      }
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

  console.log('allTasks from imp', allTasks)
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
  const sections = [
    {  data: allTasks.filter(task => task.dateSet && task.isCompleted === false)},
    {  data: allTasks.filter((task) => task.isCompleted && task.dateSet)},
  ];
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
        <SectionList sections={sections}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <>
              <View style={styles.flatlistitem}>
                <Pressable
                  style={styles.incompletetasks}
                >
                  <View style={styles.icontextcontainer}>
                    {item.isCompleted ? (
                      <Pressable onPress={() => {
                        toggleTask(item.id);
                      }}>
                        <Check name="checkcircle" size={23} color={'#004700'} />
                      </Pressable>
                    ) : (
                      <Pressable onPress={() => handleCompleteTask(item.id)}>
                        <Icon name="circle-thin" size={27} color="grey" />
                      </Pressable>
                    )}
                    <View style={{ flexDirection: 'column', marginLeft: 15 }}>
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
                    {item.isImportant ? <Iconfromentypo name="star" size={22} color="grey" style={{ color: '#004700' }} />
                      : <Iconn name="star" size={25} color="grey" />
                    }
                  </Pressable>

                </Pressable>
              </View>
            </>
          )} />

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
      <View style={styles.addicon}>
        <Plusicon
          name="pluscircle"
          size={55}
          color="#004700"
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

export default Important;

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
    alignItems: 'center'
  },
  taskContainer: {
    flexGrow: 1,
    backgroundColor: '#B1F2D6',
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
    justifyContent: 'center',
    height: 70
  },
  overdueTag: {
    color: 'red',
    fontSize: 13,
    fontWeight: '400',
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
    width: '100%'
  },
  addicon: {
    position: 'absolute',
    bottom: 7,
    right: 7,
  },
});
