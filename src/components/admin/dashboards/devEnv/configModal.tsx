import React, { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter,
  Button,
  FormLabel,
  Flex,
  SimpleGrid,
  Select,
  useColorModeValue,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import InputField from 'components/fields/InputField';

const ENDPOINT = process.env.NEXT_PUBLIC_ENDPOINT;

const ModalConfiguracion = ({ isOpen, onClose, }) => {
  const [frecuencia, setFrecuencia] = useState('');
  const [unidadFrecuencia, setUnidadFrecuencia] = useState('horas');
  const [fechaInicio, setFechaInicio] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [error, setError] = useState(false);

  const handleAplicar = async () => {
    // Frecuencia
    let frecuenciaSegundos: number;
    if (unidadFrecuencia === 'horas') {
      frecuenciaSegundos = parseInt(frecuencia)*3600;
    } else if (unidadFrecuencia === 'minutos') {
      frecuenciaSegundos = parseInt(frecuencia)*60;
    } else {
      frecuenciaSegundos = parseInt(frecuencia)*86400;
    }

    // nextInitDate
    const nextInitDate = new Date(`${fechaInicio}T${horaInicio}:00`);
    const formattedNextInitDate = format(nextInitDate, 'yyyy-MM-dd\'T\'HH:mm:ss');
    
    console.log('Frecuencia:', frecuenciaSegundos);
    console.log('nextInitDate:', formattedNextInitDate);

    const requestBody = {
      query: `
        mutation UpdateAutoPredConfig($frequency: Int!, $initDate: String!) {
          updateAutoPredConfig(frequency: $frequency, initDate: $initDate)
        }
      `,
      variables: {
        "frequency": frecuenciaSegundos,
        "initDate": formattedNextInitDate
      }
    };

    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      console.log(result);
      if (result.data.updateAutoPredConfig) {
        //onClose();
        window.location.reload(); // Recargar la página
      } else {
        setError(true);
      }
    } catch (err) {
      console.error('Error updating config:', err);
      setError(true);
    }

    onClose();
  };

  //const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
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
                        }}}
                      onChange={(e) => { setFrecuencia(e.target.value) }}
                    />
                    <Flex direction='column'>
                        <FormLabel ms='10px' htmlFor='frequency' fontSize='sm' _hover={{ cursor: 'pointer' }}>
                            &nbsp;
                        </FormLabel>
                        <Select fontSize='sm' id='frequency' h='44px' maxH='44px' me='20px' defaultValue='horas'
                          onChange={(e) => setUnidadFrecuencia(e.target.value)}>
                            <option value='minutos'>Minutos</option>
                            <option value='horas'>Horas</option>
                            <option value='dias'>Días</option>
                        </Select>
                    </Flex>
                    <InputField id='startDate' label='Fecha de inicio' placeholder='dd/mm/yyyy' type='date'
                      onChange={(e) => setFechaInicio(e.target.value)}/>
                    <InputField id='startTime' label='Hora de inicio' placeholder='hh:mm' type='time'
                      onChange={(e) => setHoraInicio(e.target.value)}/>
                </SimpleGrid>
            </Flex>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme={brandColor} variant='brand' py='25px' px='25px' mr={3} onClick={handleAplicar}>Aplicar</Button>
          <Button variant='outline' colorScheme="red" py='25px' onClick={onClose}>Cancelar</Button>
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

export default ModalConfiguracion;
