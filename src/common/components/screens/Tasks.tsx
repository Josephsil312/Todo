import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useState, useRef} from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import {HeadingText} from '../../Texts';
import Modal from 'react-native-modal';
const Tasks = ({navigation}) => {
  const [showModal, setShowModal] = useState(false);
  const refRBSheet = useRef<RBSheet>(null);

  const handleModalOpen = () => {
    setShowModal(true);
  };

  return (
    <View style={styles.taskContainer}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('./../../../../assets/images/back-arrow.png')}
            style={styles.image}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleModalOpen}>
          <Image
            source={require('./../../../../assets/images/menu.png')}
            style={{width: 22, height: 22}}
          />
        </TouchableOpacity>
      </View>
      <HeadingText
        textString={'Tasks'}
        fontSize={30}
        fontWeight="500"
        fontFamily="SuisseIntl"
        color="white"
      />
      <View
        style={{justifyContent: 'flex-end', flex: 8, alignItems: 'flex-end'}}>
        <TouchableOpacity onPress={() => refRBSheet?.current?.open()}>
          <Text>Click</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        {/* Button to open modal */}

        {/* Modal */}
        <Modal
          style={{justifyContent: 'flex-start', margin: 0}}
          isVisible={showModal}
          animationIn="fadeIn"
          animationOut="fadeOut"
          animationOutTiming={500}
          onBackdropPress={() => setShowModal(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* Content of the modal */}

              <HeadingText
                textString={'Sort by'}
                fontSize={16}
                fontWeight="500"
                fontFamily="SuisseIntl"
                marginBottom={10}
              />

              <HeadingText
                textString={'Add shortcut to homescreen'}
                fontSize={16}
                fontWeight="500"
                fontFamily="SuisseIntl"
                marginBottom={10}
              />
              <HeadingText
                textString={'Change'}
                fontSize={16}
                fontWeight="500"
                fontFamily="SuisseIntl"
                marginBottom={10}
              />
              <HeadingText
                textString={'Send a copy'}
                fontSize={16}
                fontWeight="500"
                fontFamily="SuisseIntl"
                marginBottom={10}
              />
              <HeadingText
                textString={'Duplicate list'}
                fontSize={16}
                fontWeight="500"
                fontFamily="SuisseIntl"
              />
              {/* Button to close modal */}
            </View>
          </View>
        </Modal>
      </View>
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        animationType="fade"
        customStyles={{
          wrapper: {
            backgroundColor: 'transparent',
          },
          draggableIcon: {
            backgroundColor: '#000',
          },
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  image: {
    width: 40,
    height: 40,
  },
  taskContainer: {
    flex: 1,
    backgroundColor: '#1e6ce3',
    padding: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
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
});
export default Tasks;
