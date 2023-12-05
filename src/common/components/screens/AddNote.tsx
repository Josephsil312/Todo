import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const AddNote = ({route}:any) => {

  return (
    <View>
      <Text>{route.params.selectedItem}</Text>
    </View>
  )
}

export default AddNote

const styles = StyleSheet.create({})