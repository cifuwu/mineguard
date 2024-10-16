import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, Button, Input, Flex, Checkbox, Text
  } from '@chakra-ui/react';
  import { useState } from 'react';
  
  const AddItemModal = ({ type, items, isOpen, onClose, onAdd }) => {
    const [selectedTrucks, setSelectedTrucks] = useState([]);
    const [selectedDrivers, setSelectedDrivers] = useState([]);
  
    const toggleTruckSelection = (truckSerie) => {
      setSelectedTrucks((prev) =>
        prev.includes(truckSerie)
          ? prev.filter((serie) => serie !== truckSerie)
          : [...prev, truckSerie]
      );
    };

    const toggleDriverSelection = (driverName) => {
      setSelectedDrivers((prev) =>
        prev.includes(driverName)
          ? prev.filter((name) => name !== driverName)
          : [...prev, driverName]
      );
    };
  
    const handleAdd = () => {
      if (type === 'truck') {
        onAdd(selectedTrucks);  // Pasamos los camiones seleccionados al agregar
        setSelectedTrucks([]);  // Limpiamos la selección
      } else {
        onAdd(selectedDrivers);
        setSelectedDrivers([]);
      }
      onClose();
    };
  
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Selecciona los camiones</ModalHeader>
          <ModalBody>
            {type === 'truck' ? 
            (items.map((item, index) => (
              <Flex key={index} justify="space-between" align="center" mb={2}>
                <Text>{item.name} - {item.serie}</Text>
                <Checkbox
                  isChecked={selectedTrucks.includes(item.serie)}
                  onChange={() => toggleTruckSelection(item.serie)}
                />
              </Flex>
            ))) : (
              items.map((item, index) => (
                <Flex key={index} justify="space-between" align="center" mb={2}>
                  <Text>{item.name} {item.lastname}</Text>
                  <Checkbox
                    isChecked={selectedDrivers.includes(item.name.concat(" ", item.lastname))}
                    onChange={() => toggleDriverSelection(item.name.concat(" ", item.lastname))}
                  />
                </Flex>
              ))
            )
          }
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleAdd}>
              Agregar
            </Button>
            <Button onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };
  
  
  export default AddItemModal;
  