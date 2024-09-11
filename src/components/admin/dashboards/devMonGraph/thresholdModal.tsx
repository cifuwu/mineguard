import React, { useState, useEffect } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter,
  Button,
  FormLabel,
  Flex,
  Switch,
  useColorModeValue,
  Input,
} from '@chakra-ui/react';

const ENDPOINT = process.env.NEXT_PUBLIC_ENDPOINT;

const ThresholdModal = ({ isOpen, onClose, label, unit, maxThreshold, minThreshold, isMaxThresholdVisible, isMinThresholdVisible, onSave }) => {
  const [maximumThreshold, setMaximumThreshold] = useState(maxThreshold);
  const [minimumThreshold, setMinimumThreshold] = useState(minThreshold);
  const [isMaximumThresholdVisible, setIsMaximumThresholdVisible] = useState(isMaxThresholdVisible);
  const [isMinimumThresholdVisible, setIsMinimumThresholdVisible] = useState(isMinThresholdVisible);
  const [error, setError] = useState(false);

  //const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  const brandColor = useColorModeValue('brand.500', 'white');

  useEffect(() => {
    if (isOpen) {
      setMaximumThreshold(maxThreshold);
      setMinimumThreshold(minThreshold);
      setIsMaximumThresholdVisible(isMaxThresholdVisible);
      setIsMinimumThresholdVisible(isMinThresholdVisible);
    }
  }, [isOpen, maxThreshold, minThreshold, isMaxThresholdVisible, isMinThresholdVisible]);

  const handleSave = () => {

    const requestBody = {
      query: `
        mutation UpdateVariableConfig($variableBody: UpdateVariableConfig!) {
          updateVariableConfig(variableBody: $variableBody) {
            variable
            unit
            threshold {
              visible
              value
            }
            maximum {
              visible
              value
            }
          }
        }
      `,
      variables: {
        "variableBody": {
          "maximum": {
            "value": parseFloat(maximumThreshold),
            "visible": isMaximumThresholdVisible
          },
          "threshold": {
            "value": parseFloat(minimumThreshold),
            "visible": isMinimumThresholdVisible
          },
          "unit": unit,
          "variable": label
        }
      }
    };
    
    // fetch updateVariableConfig
    fetch(ENDPOINT, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.errors) {
          console.error("Error:", data.errors[0].message);
        }
        if (data && data.data && data.data.updateVariableConfig) {
          console.log(data.data.updateVariableConfig);
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });

    onSave({
      maxThreshold: maximumThreshold,
      minThreshold: minimumThreshold,
      isMaxThresholdVisible: isMaximumThresholdVisible,
      isMinThresholdVisible: isMinimumThresholdVisible
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">Umbral de {label} {unit}</ModalHeader>
        <ModalCloseButton />
        <ModalBody> 
          <Flex width="75%" align="center" mx="auto" mb="32px">
            <FormLabel htmlFor="maximumThreshold" mb={0}>Umbral máximo</FormLabel>
            <Input
              id="maximumThreshold"
              type="number"
              width="50%"
              onChange={(e) => setMaximumThreshold(e.target.value)}
              value={maximumThreshold}
            />
            <FormLabel htmlFor='maximumThresholdVisible' fontSize="sm" m="0" ml="12px">Mostrar</FormLabel>
            <Switch id='maximumThresholdVisible' size="sm" spacing="1rem" pl="4px"
              isChecked={isMaximumThresholdVisible}
              onChange={() => setIsMaximumThresholdVisible(!isMaximumThresholdVisible)}/>
          </Flex>
          <Flex width="75%" align="center" mx="auto">
            <FormLabel htmlFor="minimumThreshold" mb={0}>Umbral mínimo</FormLabel>
            <Input
              id="minimumThreshold"
              type="number"
              width="50%"
              onChange={(e) => setMinimumThreshold(e.target.value)}
              value={minimumThreshold}
            />
            <FormLabel htmlFor='minimumThresholdVisible' fontSize="sm" m="0" ml="12px">Mostrar</FormLabel>
            <Switch id='minimumThresholdVisible' size="sm" spacing="1rem" pl="4px"
              isChecked={isMinimumThresholdVisible}
              onChange={() => setIsMinimumThresholdVisible(!isMinimumThresholdVisible)}/>
          </Flex>
        </ModalBody>

        <ModalFooter justifyContent="center" mt='12px'>
          <Button variant='outline' colorScheme="red" py='24px' mr={3} onClick={onClose}>Cancelar</Button>
          <Button colorScheme={brandColor} variant='brand' py='24px' px='24px' onClick={handleSave}>Aplicar</Button>
        </ModalFooter>
        {error && (
          <Flex justify="center" mt={2} mb={2} color="red.500" fontWeight="bold">
            Error al actualizar la configuración.
          </Flex>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ThresholdModal;
