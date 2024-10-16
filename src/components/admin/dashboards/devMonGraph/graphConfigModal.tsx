import React, { useState, useEffect } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter,
  Button,
  FormLabel,
  Flex,
  SimpleGrid,
  Select,
  useColorModeValue,
  Input,
} from '@chakra-ui/react';
import { set } from 'date-fns';

const ENDPOINT = process.env.NEXT_PUBLIC_ENDPOINT;

const GraphConfigModal = ({ isOpen, onClose, }) => {
  const [refreshRate, setRefreshRate] = useState('');
  const [timeWindow, setTimeWindow] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {

    const requestBody = {
      query: `
        query GetGraphConfig {
          getGraphConfig {
            refreshRate
            timeWindow
          }
        }
      `,
    };
    
    // fetch getGraphConfig
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
        if (data && data.data && data.data.getGraphConfig) {
          console.log(data.data.getGraphConfig);
          setRefreshRate(data.data.getGraphConfig.refreshRate);
          setTimeWindow(data.data.getGraphConfig.timeWindow);
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });

  }, []);
  
  const handleAplicar = () => {

    const requestBody = {
      query: `
        mutation UpdateGraphConfig($graphConfig: GraphConfigInput) {
          updateGraphConfig(graphConfig: $graphConfig) {
            refreshRate
            timeWindow
          }
        }
      `,
      variables: {
        "graphConfig": {
          "refreshRate": parseInt(refreshRate),
          "timeWindow": parseInt(timeWindow)
        }
      }
    };
    
    // fetch UpdateGraphConfig
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
        if (data && data.data && data.data.updateGraphConfig) {
          console.log(data.data.updateGraphConfig);
          onClose();
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });


  }

  //const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  const brandColor = useColorModeValue('brand.500', 'white');

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">Configuración de gráficos</ModalHeader>
        <ModalCloseButton />
        <ModalBody> 
          <Flex width="75%" align="center" mx="auto" mb="32px">
            <FormLabel mb={0} mr={4}>Tiempo de refresco [hz]</FormLabel>
            <Input
              type="number"
              width="100%"
              onChange={(e) => setRefreshRate(e.target.value)}
              value={refreshRate}
            />
          </Flex>
          <Flex width="75%" align="center" mx="auto">
            <FormLabel mb={0} mr={4}>Ventana de tiempo [s]</FormLabel>
            <Input
              type="number"
              width="100%"
              onChange={(e) => setTimeWindow(e.target.value)}
              value={timeWindow}
            />
          </Flex>
        </ModalBody>

        <ModalFooter justifyContent="center">
          <Button variant='outline' colorScheme="red" py='25px' mr={3} onClick={onClose}>Cancelar</Button>
          <Button colorScheme={brandColor} variant='brand' py='25px' px='25px'  onClick={handleAplicar}>Aplicar</Button>
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

export default GraphConfigModal;
