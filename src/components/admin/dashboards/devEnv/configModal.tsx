import React, { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter,
  Button,
  FormLabel,
  Flex,
  SimpleGrid,
  Select,
  useColorModeValue,
} from '@chakra-ui/react';
import InputField from 'components/fields/InputField';

const ModalConfiguracion = ({ isOpen, onClose, }) => {
  const [frecuencia, setFrecuencia] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [horaInicio, setHoraInicio] = useState('');

  const handleAplicar = () => {
    console.log('Frecuencia:', frecuencia);
    console.log('Fecha de inicio:', fechaInicio);
    console.log('Hora de inicio:', horaInicio);

    onClose();
  };
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  const brandColor = useColorModeValue('brand.500', 'white');
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Configuración de predicciones automáticas</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
            <Flex>
                <SimpleGrid columns={{ base: 2 }} spacing={{ base: '20px', xl: '20px' }}>
                    <InputField id='frequencyNumber' label='Frecuencia de predicciones' placeholder='Número' type='text'
                    onKeyPress={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}/>
                    <Flex direction='column'>
                        <FormLabel ms='10px' htmlFor='frequency' fontSize='sm' color={textColorPrimary} fontWeight='bold' _hover={{ cursor: 'pointer' }}>
                            &nbsp;
                        </FormLabel>
                        <Select fontSize='sm' id='frequency' h='44px' maxH='44px' me='20px' defaultValue='Horas'>
                            <option value='usd'>Horas</option>
                            <option value='eur'>Días</option>
                        </Select>
                    </Flex>
                    <InputField id='startDate' label='Fecha de inicio' placeholder='dd/mm/yyyy' type='date'/>
                    <InputField id='startTime' label='Hora de inicio' placeholder='hh:mm' type='time'/>
                </SimpleGrid>
            </Flex>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme={brandColor} variant='brand' py='25px' px='25px' mr={3} onClick={handleAplicar}>Aplicar</Button>
          <Button variant='outline' colorScheme="red" py='25px' onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalConfiguracion;
