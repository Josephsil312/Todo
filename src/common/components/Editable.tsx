import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Pressable } from 'react-native';
import { HeadingText } from '../../common/Texts';
import { TextInputSingleLine } from '../../styled';
import Icon from 'react-native-vector-icons/FontAwesome';
import Iconfont from 'react-native-vector-icons/Fontisto';
import DateIcon from 'react-native-vector-icons/Fontisto';
import { useTasks } from '../TasksContextProvider';
import Iconfromentypo from 'react-native-vector-icons/Entypo';
import Remind from 'react-native-vector-icons/AntDesign';
import { parse, format } from 'date-fns';
import Cross from 'react-native-vector-icons/Entypo';
import Iconn from 'react-native-vector-icons/EvilIcons';

const Editable = (props: any) => {
    const [editedText, setEditedText] = useState(props.selectedItem);
    const { allTasks,dueDateAdded } = useTasks()
    const task = allTasks.find((task) => task.id === props.selectedItem);
    const dueDateAddedfrom = task?.dueDateAdded;
    const handleTextChange = (text: string) => {
        setEditedText(text);
    };
    const { myDayState } = props;
      
   
    
    // const formattedDueDate = dueDateAddedfrom
    //     ? `Due ${format(parse(dueDateAddedfrom, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy')}`
    //     : 'Add due date';

    console.log('dueDateAddedfrom from editable',dueDateAddedfrom)
    return (
        <>
            <View style={styles.container}>
                <View style={styles.taskContainer}>
                    <View style={styles.editablecontainer}>
                        <Icon name="circle-thin" size={27} color="grey" />
                        <TextInputSingleLine
                            onChangeText={handleTextChange}
                            value={editedText}
                            placeholder={'Add task'}
                            maxLength={256}
                            color={'grey'}
                            ref={props.inputRef}
                            style={{ width: 300 }}
                            returnKeyType={'done'}
                        />
                    </View>
                    {/* {starId && (
                        <Iconfromentypo
                            name="star"
                            size={22}
                            style={{ color: allTasks.find((task) => task.id === starId)?.isImportant ? '#f5eb05' : '' }}
                        />
                    )} */}

                </View>
                <View style={styles.secondContainer}>
                    <View style={styles.addtomyday}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 150 }}>
                            <Iconfont name="day-sunny" size={20} color="grey" />
                            <HeadingText
                                textString={myDayState ? 'Added to My Day' : 'Add to My Day'}
                                fontSize={16}
                                fontWeight="500"
                                fontFamily="SuisseIntl"
                                textDecorationLine="none"
                                color='#a8afb3'
                                marginLeft={10}
                            />
                        </View>
                        {myDayState && <Cross name="cross" size={22} color="grey" />}
                    </View>

                    <View style={styles.addtoduedate}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', width: 140 }}>
                            <DateIcon name="date" size={18} color="grey" />
                            <HeadingText
                                textString={props.formattedDueDate} // Format due date if present
                                fontSize={16}
                                fontWeight="500"
                                fontFamily="SuisseIntl"
                                textDecorationLine="none"
                                color='#a8afb3'
                                marginLeft={10}
                            />
                        </View>
                    </View>
                    <View style={styles.addtoduedate} >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 125, alignItems: 'center' }}>
                            <Remind name="retweet" size={20} color="grey" />
                            <HeadingText
                                textString={'Remind me'}
                                fontSize={16}
                                fontWeight="500"
                                fontFamily="SuisseIntl"
                                textDecorationLine="none"
                                color='#a8afb3'
                                marginLeft={10}
                            />
                        </View>
                    </View>
                </View>
                <TextInput placeholder='Add Note' multiline returnKeyType="done" />
            </View>
        </>
    );
};


const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
    editablecontainer: {
        flexDirection: 'row',
        width: 110,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    taskContainer: {
        elevation: 8,
        paddingHorizontal: 21,
        flexDirection: 'row',
        marginBottom: 6,
        shadowColor: '#005F8D',
        backgroundColor: 'white',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.6,
        height: 80,
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    image: {
        width: 20,
        height: 20,
    },
    addtomyday: {
        elevation: 2,
        marginVertical: 6,
        backgroundColor: 'white',
        paddingVertical: 6,
        height: 50,
        width: '100%',
        borderBottomWidth: 0.2,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    addtoduedate: {
        elevation: 2,
        marginVertical: 6,
        backgroundColor: 'white',
        paddingVertical: 6,
        height: 50,
        width: '100%',
        borderBottomWidth: 0.2,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    secondContainer: {
        paddingHorizontal: 10
    },
})
export default Editable;