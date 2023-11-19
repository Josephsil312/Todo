import { StyleSheet, Text, View, Modal, Alert, Pressable, TouchableWithoutFeedback, Image, TouchableOpacity } from 'react-native'
import React, { useState,useEffect } from 'react'
import { HeadingText } from '../../Texts';
import DatTimePicker from '../../DatTimePicker';
import { BlurView } from "@react-native-community/blur";
import AsyncStorage from '@react-native-async-storage/async-storage';
const CustomModal = (props: {
    setModalVisible: (arg0: any) => any;
    modalVisible: any;
    openModal: (() => void) | undefined;
    closeModal: (() => void) | undefined;
    isDueToday: boolean;
    setIsDueToday: (value: boolean) => void;
}) => {
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [selectedText, setSelectedText] = useState('Set due date');
    
    const showDatePicker = () => {
        setShowPicker(true);
    };

    const hideDatePicker = () => {
        setShowPicker(false);
    };

    const handleDateChange = (event: { type: string; }, selectedDate: any) => {
        if (event.type === 'set') {
            setDate(selectedDate || date);
            hideDatePicker();
            if (isToday(selectedDate)) {
                setSelectedText('Due today');
                props.setIsDueToday(true); // Call the callback function
            } else if (isTomorrow(selectedDate)){
                setSelectedText('Due tomorrow');
                props.setIsDueToday(false); // Call the callback function
            } else{
                setSelectedText('Set due date');
                props.setIsDueToday(false);
            }
        } else {
            hideDatePicker();
        }
    };

    const formatDateToDayOfWeek = (selectedDate: any) => {
        const options = { weekday: 'long' };
        const dayOfWeek = selectedDate?.toLocaleDateString('en-US', options);
        return dayOfWeek?.split(',')[0];

    };

    const today = date;

    const tomorrow = new Date(today);

    tomorrow.setDate(today.getDate() + 1);

    const isToday = (selectedDate: Date) => {
        const todaydate = selectedDate.getDate();
        console.log('clicked today',todaydate)
        props.setIsDueToday(true);
        props.setModalVisible(false);
        toggleFeature()
        return (
            selectedDate.getDate() === today.getDate() &&
            selectedDate.getMonth() === today.getMonth() &&
            selectedDate.getFullYear() === today.getFullYear()
        );
    };

    const isTomorrow = (selectedDate: Date) => {
        selectedDate = tomorrow
        console.log('clickec tomorrow',selectedDate)
        return (
            selectedDate.getDate() === tomorrow.getDate() &&
            selectedDate.getMonth() === tomorrow.getMonth() &&
            selectedDate.getFullYear() === tomorrow.getFullYear()
        );
    };

    useEffect(() => {
        loadIsDueTodayStatus();
      }, [])
    
      const loadIsDueTodayStatus = async () => {
        try {
          const storedValue = await AsyncStorage.getItem('isDueToday');
          if (storedValue !== null) {
            props.setIsDueToday(JSON.parse(storedValue))
          }
        } catch (error) {
          console.error('Error loading isduetoday', error)
        }
      }
      
      const saveIsDueTodayStatus = async (value: any) => {
        try {
          await AsyncStorage.setItem('isDueToday', JSON.stringify(value))
        } catch (error) {
          console.error('Error saving isduetoday', error)
        }
      }

      const toggleFeature = () => {
        const newValue = !(props.isDueToday);
        props.setIsDueToday(newValue)
        saveIsDueTodayStatus(newValue)
      }

    return (
        <View>
            <Modal
                animationType="fade"
                transparent={true}
                visible={props.modalVisible}
                onRequestClose={() => {
                    props.setModalVisible(false);
                }}>
                <TouchableWithoutFeedback onPress={props.closeModal}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <TouchableOpacity onPress={() => isToday(date)}>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <Image source={require('../../../../assets/images/today.png')} style={{ marginVertical: 10 }} />
                                    <HeadingText
                                        textString={`Today (${formatDateToDayOfWeek(today)})`}
                                        fontSize={16}
                                        fontWeight="500"
                                        fontFamily="SuisseIntl"
                                        marginLeft={10}
                                        marginVertical={10}
                                    />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => isTomorrow(date)}>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <Image source={require('../../../../assets/images/tomorrow.png')} style={{ marginVertical: 10 }} />
                                    <HeadingText
                                        textString={`Tomorrow (${formatDateToDayOfWeek(tomorrow)})`}
                                        fontSize={16}
                                        fontWeight="500"
                                        fontFamily="SuisseIntl"
                                        marginLeft={10}
                                        marginVertical={10}
                                    />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={showDatePicker}>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <Image source={require('../../../../assets/images/pickdate.png')} style={{ marginVertical: 10 }} />
                                    <HeadingText
                                        textString={`Pick a date`}
                                        fontSize={16}
                                        fontWeight="500"
                                        fontFamily="SuisseIntl"
                                        marginLeft={10}
                                        marginVertical={10}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                {showPicker &&
                    <BlurView
                        style={styles.absolute}
                        blurType="dark"
                        blurAmount={2}
                        reducedTransparencyFallbackColor="white"
                    />
                }
            </Modal>
            <DatTimePicker formatDateToDayOfWeek={formatDateToDayOfWeek} handleDateChange={handleDateChange} hideDatePicker={hideDatePicker} date={date} setDate={setDate} showPicker={showPicker} setShowPicker={setShowPicker} showDatePicker={showDatePicker} isToday={isToday}/>
        </View>
    )
}

export default CustomModal

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-start',

    },
    modalView: {
        margin: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        alignItems: 'flex-start',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: 200,
        height: 'auto',
        flexDirection: 'column',

    },
    dueTodayContainer: {
        backgroundColor: 'purple',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    dueTodayText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    absolute: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
});