import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, Pressable } from 'react-native';
import { HeadingText } from '../../common/Texts';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { TextInputSingleLine } from '../../styled';
import Iconn from 'react-native-vector-icons/EvilIcons'
import Icon from 'react-native-vector-icons/FontAwesome';
import Iconfont from 'react-native-vector-icons/Fontisto';
import DateIcon from 'react-native-vector-icons/Fontisto';
const Editable = (props: any) => {

    const id = props.selectedItem.id;
    const [editedText, setEditedText] = useState(props.selectedItem);

    const handleTextChange = (text: string) => {
        setEditedText(text);
    };
    const saveChanges = () => {
        const updatedTask = {
          id: props.selectedItem.id,
          name: editedText,
        };
    
        // Call the onEdit function passed as a prop
        props.onEdit(updatedTask);
    
        // Optionally, you can close the RBSheet or perform other actions
        // ...
      };
    return (
        <>
            <View style={styles.container}>
                {/* Render your Editable screen with the selected item data */}
                {/* <Text style = {styles.task}>{taskItem.name}</Text> */}
                <View style={styles.taskContainer}>
                    <View style={{ flexDirection: 'row', width: 110, justifyContent: 'space-between', alignItems: 'center' }}>
                    <Icon name="circle-thin" size={22} color="grey" />
                        <TextInputSingleLine
                            onChangeText={handleTextChange}
                            value={editedText}
                            placeholder={'Add task'}
                            maxLength={256}
                            color={'grey'}
                            ref={props.inputRef}
                        />
                    </View>
        
                    <Iconn name="star" size={25} color="grey" />
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
                <Pressable onPress={() => props.navigation.navigate('Add Note', {
                    selectedItem: props.selectedItem
                })} style={styles.notes}>
                    <HeadingText
                        textString={'Add note'}
                        fontSize={16}
                        fontWeight="500"
                        fontFamily="SuisseIntl"
                        textDecorationLine="none"
                        color='#a8afb3'
                    />
                </Pressable>
            </View>
        </>
    );
};


const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
    taskContainer: {
        elevation: 8,
        paddingHorizontal: 10,
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
        paddingHorizontal:10
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