import { StyleSheet, Text, View, Modal, Alert, Pressable, TouchableWithoutFeedback, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { HeadingText } from '../../Texts';
import DatTimePicker from '../../DatTimePicker';

const CustomModal = (props: {
    setModalVisible: (arg0: any) => any;
    modalVisible: any;
    openModal: (() => void) | undefined;
    closeModal: (() => void) | undefined;
}) => {
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
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
        } else {
            hideDatePicker();
        }
    };
    const formatDateToDayOfWeek = (selectedDate: any) => {
        const options = { weekday: 'long' };
        return selectedDate?.toLocaleDateString('en-US', options);
        
    };
    const today = date;

    const isToday = (selectedDate: Date) => {
        const todaydate =  selectedDate.getDate()
        console.log('todaydate',todaydate)
        // return (
        //   selectedDate.getDate() === today.getDate() &&
        //   selectedDate.getMonth() === today.getMonth() &&
        //   selectedDate.getFullYear() === today.getFullYear()
        // );
      };
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
                                   {/* <Text style={styles.modalText}>Hello World!</Text> */}
                            <TouchableOpacity onPress={() => isToday}>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <Image source={require('../../../../assets/images/today.png')} style={{ marginVertical: 10 }} />
                                    <HeadingText
                                       textString={ 'Today'}
                                        // textString='Today'
                                        fontSize={16}
                                        fontWeight="500"
                                        fontFamily="SuisseIntl"
                                        marginLeft={10}
                                        marginVertical={10}
                                    />
                                </View>
                            </TouchableOpacity>

                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Image source={require('../../../../assets/images/tomorrow.png')} style={{ marginVertical: 10 }} />
                                <HeadingText
                                    textString={`Tomorrow`}
                                    fontSize={16}
                                    fontWeight="500"
                                    fontFamily="SuisseIntl"
                                    marginLeft={10}
                                    marginVertical={10}
                                />
                            </View>
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
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
            <DatTimePicker formatDateToDayOfWeek = {formatDateToDayOfWeek} handleDateChange = {handleDateChange} hideDatePicker = {hideDatePicker} date={date} setDate={setDate} showPicker={showPicker} setShowPicker={setShowPicker} showDatePicker={showDatePicker} />
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
});