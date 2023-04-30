import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import React, {useState, useRef} from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';

const Tasks = ({navigation}) => {
  const [showModal, setShowModal] = useState(false);
  const refRBSheet = useRef<RBSheet>(null);

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
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
      <Text style={{color: 'white', fontSize: 30}}>Tasks</Text>
      <TouchableOpacity onPress={() => refRBSheet?.current?.open()}>
        <Text>Click</Text>
      </TouchableOpacity>
      <View style={styles.container}>
        {/* Button to open modal */}

        {/* Modal */}
        <Modal
          visible={showModal}
          onRequestClose={handleModalClose}
          transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* Content of the modal */}

              <Text style={styles.modalText}>Sort by</Text>

              <Text style={styles.modalText}>Add shortcut to homescreen</Text>
              <Text style={styles.modalText}>Change theme</Text>
              <Text style={styles.modalText}>Send a copy</Text>
              <Text style={styles.modalText}>Duplicate list</Text>
              {/* Button to close modal */}
              <TouchableOpacity
                onPress={handleModalClose}
                style={styles.modalCloseButton}>
                <Text style={styles.modalCloseButtonText}>Close</Text>
              </TouchableOpacity>
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
    backgroundColor: '#3555d4',
    padding: 7,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
  },
  modalContent: {
    backgroundColor: 'white',

    padding: 16,
    width: '80%', // Set the width of the modal
    maxWidth: 300, // Set the maximum width of the modal
  },
  modalText: {
    fontSize: 16,
    marginBottom: 16,
  },
  modalCloseButton: {
    alignSelf: 'flex-end',
  },
  modalCloseButtonText: {
    color: 'blue',
    fontSize: 16,
  },
});
export default Tasks;
