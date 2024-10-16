'use client';
import React, { useState } from 'react';
import { Flex, Checkbox, Select, Box, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, FormControl, FormLabel, Input } from '@chakra-ui/react';


interface ThresholdModalProps {
  isOpen: boolean;
  onClose: () => void;
  thresholdType: 'max' | 'min';
  setThresholdType: React.Dispatch<React.SetStateAction<'max' | 'min'>>;
  thresholdValue: string;
  setThresholdValue: React.Dispatch<React.SetStateAction<string>>;
  applyThreshold: () => void;
}

const ThresholdModal: React.FC<ThresholdModalProps> = ({
  isOpen,
  onClose,
  thresholdType,
  setThresholdType,
  thresholdValue,
  setThresholdValue,
  applyThreshold
}) => {
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
      <ModalHeader textAlign="center">Configuración de gráfico</ModalHeader>
        <ModalBody>
          <FormControl>
            <Flex justify="center">
              <Box
                p={2}
                bg="gray.200"
                borderRadius="xl"
                boxShadow="md"
                mr={4}
              >
                <Text fontWeight="bold">Umbral</Text>
              </Box>
              <Select
                value={thresholdType}
                onChange={(e) => setThresholdType(e.target.value as 'max' | 'min')}
                bg="gray.200"
                borderRadius="xl"
                boxShadow="md"
                width="30%"
                variant="filled"
                borderColor="transparent"
              >
                <option value="max">Máximo</option>
                <option value="min">Mínimo</option>
              </Select>
            </Flex>
          </FormControl>         

          <FormControl mt={4} width="50%" mx="auto">
            <Flex align="center">
              <FormLabel mb={0} mr={4}>Valor</FormLabel>
              <Input
                type="number"
                value={thresholdValue}
                onChange={(e) => setThresholdValue(e.target.value)}
                textAlign="center"
                width="100%"
              />
            </Flex>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Flex justify="center"  w="100%">
            <Button 
              variant="outline"  // Cambia el fondo a blanco con borde
              borderColor="#E31A1A"  // Color del borde
              color="#E31A1A"  // Color del texto
              _hover={{ 
                bg: "#E31A1A",  // Cambia el fondo a rojo al pasar el ratón
                color: "white",  // Cambia el color del texto a blanco
                borderColor: "#E31A1A"  // Mantiene el color del borde rojo
              }}
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              variant="outline"  // Cambia el fondo a blanco con borde
              backgroundColor="#11047A"  // Color del borde
              color="#FFFFFF"  // Color del texto
              _hover={{ 
                bg: "#0e037b",  // Cambia el color de fondo al pasar el ratón
                borderColor: "#11047A"  // Mantiene el color del borde rojo
              }}
              onClick={applyThreshold} ml={3}
            >
              Aplicar
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ThresholdModal;
