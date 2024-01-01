import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { HeadingText } from '../../common/Texts';
import { TextInputSingleLine } from '../../styled';
import Iconn from 'react-native-vector-icons/EvilIcons'
import Icon from 'react-native-vector-icons/FontAwesome';
import Iconfont from 'react-native-vector-icons/Fontisto';
import DateIcon from 'react-native-vector-icons/Fontisto';
import { useTasks } from '../TasksContextProvider';
import Iconfromentypo from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';

const Editable = (props: any) => {
    const [editedText, setEditedText] = useState(props.selectedItem);
    const { allTasks, setAllTasks } = useTasks();
    const handleTextChange = (text: string) => {
        setEditedText(text);
    };
    const { starId } = props;
    const navigation = useNavigation();
    return (
        <>
            <View style={styles.container}>
                <View style={styles.taskContainer}>
                    <View style={styles.editablecontainer}>
                        <Icon name="circle-thin" size={22} color="grey" />
                        <TextInputSingleLine
                            onChangeText={handleTextChange}
                            value={editedText}
                            placeholder={'Add task'}
                            maxLength={256}
                            color={'grey'}
                            ref={props.inputRef}
                            style={{ textDecorationLine: props.lineThrough ? 'none' : 'line-through' }}
                        />
                    </View>
                    {starId && (
                        <Iconfromentypo
                            name="star"
                            size={22}
                            style={{color:allTasks.find((task) => task.id === starId)?.isImportant ? '#f5eb05' : 'grey'}}
                        />
                    )}
                </View>
                <View style={styles.secondContainer}>
                    <View style={styles.addtomyday}>
                        <Iconfont name="day-sunny" size={22} color="grey" />
                        <HeadingText
                            textString={'Add to My Day'}
                            fontSize={16}
                            fontWeight="500"
                            fontFamily="SuisseIntl"
                            textDecorationLine="none"
                            color='#a8afb3'
                            marginLeft={10}
                        />
                    </View>
                    <View style={styles.addtomyday}>
                        <DateIcon name="date" size={22} color="grey" />
                        <HeadingText
                            textString={'Add due date'}
                            fontSize={16}
                            fontWeight="500"
                            fontFamily="SuisseIntl"
                            textDecorationLine="none"
                            color='#a8afb3'
                            marginLeft={10}
                        />
                    </View>
                </View>
                <View style={styles.notes}>
                    <Pressable >
                        <HeadingText
                            textString={'Add Note'}
                            fontSize={16}
                            fontWeight="500"
                            fontFamily="SuisseIntl"
                        />
                    </Pressable>

                </View >
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
        alignItems: 'center'
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
        elevation: 6,
        marginBottom: 6,
        shadowColor: '#005F8D',
        backgroundColor: 'white',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.6,
        height: 60,
        width: '100%',
        borderBottomColor: '#a8afb3',
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10
    },
    notes: {
        elevation: 6,
        marginBottom: 6,
        shadowColor: '#005F8D',
        backgroundColor: 'white',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.6,
        height: 60,
        width: '100%',
        borderBottomColor: '#a8afb3',
        borderBottomWidth: 1,
        flexDirection: 'row',
        paddingHorizontal: 10
    },
    secondContainer: {
        paddingHorizontal: 10
    },
})
export default Editable;