import React, { useState } from "react";
import { Button, View, Text, StyleSheet } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const Example = () => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // Show and Hide Date Picker
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  // Show and Hide Time Picker
  const showTimePicker = () => setTimePickerVisibility(true);
  const hideTimePicker = () => setTimePickerVisibility(false);

  // Handle Date Selection
  const handleConfirmDate = (date) => {
    if (date) {
      const formattedDate = date.toDateString();
      setSelectedDate(formattedDate);
      console.log("Selected Date:", formattedDate);
    }
    hideDatePicker();
  };

  // Handle Time Selection
  const handleConfirmTime = (time) => {
    if (time) {
      const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setSelectedTime(formattedTime);
      console.log("Selected Time:", formattedTime);
    }
    hideTimePicker();
  };

  return (
    <View style={styles.container}>
      {/* Date Picker Button */}
      <Button title="Select Date" onPress={showDatePicker} color="#007bff" />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={hideDatePicker}
      />

      {/* Time Picker Button */}
      <Button title="Select Time" onPress={showTimePicker} color="#28a745" style={styles.button} />
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleConfirmTime}
        onCancel={hideTimePicker}
      />    

      {/* Display Selected Date & Time */}
      <Text style={styles.dateText}>Date: {selectedDate || "No date selected"}</Text>
      <Text style={styles.dateText}>Time: {selectedTime || "No time selected"}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  dateText: {
    marginTop: 20,
    fontSize: 18,
    color: "#333",
  },
  button: {
    marginTop: 10,
  },
});

export default Example;
