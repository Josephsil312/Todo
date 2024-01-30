import { Text, StyleSheet, View, TouchableOpacity, FlatList, Pressable, SectionList,ScrollView,KeyboardAvoidingView, LayoutAnimation } from 'react-native';
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
import { isAfter, isYesterday, subDays, isSameDay, isTomorrow, parse, isBefore, format, startOfToday } from 'date-fns';
interface Props {
  navigation: NavigationProp<ParamListBase>;
}
const Important = ({ navigation }: Props) => {

  const { allTasks, setAllTasks,dueDate } = useTasks();
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
        isImportant: true,
        dateSet: dueDate,
        myDay:false,
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

  const filteredImportantTasks = allTasks.filter(task => task.isImportant && task.isCompleted === false);

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
  
  console.log('allTasks from imp', allTasks)
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
      
      <KeyboardAvoidingView  style={styles.taskContainer} keyboardShouldPersistTaps='always'>
        <SectionList sections={[
          { data: filteredImportantTasks }, // Assuming this array contains the important tasks
        ]}  keyExtractor={item => item.id} renderItem={({ item }) => (
          <>
            <View style={styles.flatlistitem}>
              <Pressable
                style={styles.incompletetasks}
              >
                <View style={styles.icontextcontainer}>
                  <TouchableOpacity onPress={() => { backToCompleted(item.id) }}>
                    <Icon name="circle-thin" size={27} color="grey" />
                  </TouchableOpacity>
                  <View style={{ flexDirection: 'column', marginLeft: 15 }}>
                    <HeadingText
                      textString={item.name.trim()}
                      fontSize={17}
                      fontWeight="500"
                      fontFamily="SuisseIntl"
                      
                    />
                    {item.dateSet && (
                      <>
                        {renderDateConditional(item)}
                      </>
                    )}
                  </View>
                </View>
                <Iconfromentypo name="star" size={22} color="grey" style={{ color: '#971c3d' }} onPress={() => backToTask(item.id)} />

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
          color={'#7568f8'}
        />
      </RBSheet>
      <View style={styles.addicon}>
        <Plusicon
          name="pluscircle"
          size={55}
          color="#971c3d"
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
    backgroundColor: '#ffcbd8',
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
