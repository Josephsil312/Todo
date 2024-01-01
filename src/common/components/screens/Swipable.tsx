import { StyleSheet, Text, View,Animated } from 'react-native'
import React from 'react'
import { RectButton, GestureHandlerRootView } from 'react-native-gesture-handler';

const SwipeableRow = ({ item, onDelete }) => {
    const renderRightActions = (progress, dragX) => {
      const trans = dragX.interpolate({
        inputRange: [0, 50, 100, 101],
        outputRange: [-20, 0, 0, 1],
      });
      return (
        <RectButton style={styles.rightAction} onPress={() => onDelete(item.id)}>
          <Animated.Text
            style={[
              styles.actionText,
              {
                transform: [{ translateX: trans }],
              },
            ]}
          >
            Delete
          </Animated.Text>
        </RectButton>
      );
    };
}
export default SwipeableRow;

const styles = StyleSheet.create({
    rightAction: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#dd2c00',
        flex: 1,
      },
      actionText: {
        color: '#fff',
        fontWeight: '600',
      },
})