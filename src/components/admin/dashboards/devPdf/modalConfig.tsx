import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, Button, Input,
  } from '@chakra-ui/react';
  import { useState } from 'react';
  
  const AddItemModal = ({ isOpen, onClose, onAdd }) => {
    const [itemName, setItemName] = useState('');
  
    const handleAdd = () => {
      onAdd(itemName);
      setItemName('');
      onClose();
    };
  
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Agregar Item</ModalHeader>
          <ModalBody>
            <Input
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Nombre del item"
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAdd}>Agregar</Button>
            <Button onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };
  
  export default AddItemModal;
  