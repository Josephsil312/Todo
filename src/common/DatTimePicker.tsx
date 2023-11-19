import React  from 'react';
import { View} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DatTimePicker =(props: {
  setDate: (arg0: any) => any;
  date:any;
  showPicker: any;
  setShowPicker:(arg0: any) => any;
  showDatePicker: (() => void) | undefined;
  hideDatePicker: (() => void) | undefined;
  handleDateChange: ((event: any, selectedDate: any) => void);
  isToday:((selectedDate: any) => void);
  formatDateToDayOfWeek: ((selectedDate: any) => void);
}) => { 
  return (
    <View>
    {props.showPicker && (
      <DateTimePicker
        value={props.date}
        mode="datetime" // Set the mode to 'date', 'time', or 'datetime'
        display="default"
        onChange={props.handleDateChange}
      />
    )}
    {/* <Text>Selected Day: {formatDateToDayOfWeek(date)}</Text> */}
    </View>
  )
}

export default DatTimePicker

