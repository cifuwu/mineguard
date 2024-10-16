import React from 'react';
import { VStack, Box, Text, useColorModeValue } from '@chakra-ui/react';
import Card from 'components/card/Card';

const TruckSelector = ({ trucks, selectedTruck, onSelectTruck }) => {
  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const selectedBgColor = useColorModeValue('brand.100', 'brand.600');
  const textColor = useColorModeValue('gray.800', 'white');
  
  const handleTruckSelect = (truckId) => {
    onSelectTruck(truckId);
  };

  return (
    <VStack
      align="flex-start"
      spacing="3"
      w="100%"
      pr={3}
      maxH="600px"
      overflowY="auto"
    >
      <Text fontSize="md" fontWeight="bold" mb="4">
        Selección Camión
      </Text>

      {trucks.map((truck) => (
        <Box
          key={truck.truckID}
          w="100%"
          p="3"
          cursor="pointer"
          onClick={() => handleTruckSelect(truck.truckID)}
          bg={selectedTruck === truck.truckID ? selectedBgColor : bgColor}
          boxShadow="sm"
          borderRadius="xl"
          borderWidth="1px"
          borderColor="gray.200"
          _hover={{ bg: selectedTruck !== truck.id && selectedBgColor }}
          transition="background-color 0.2s"
          display="flex"
          alignItems="center"
        >
          <Text flex="1" color={textColor}>
            {truck.name}
          </Text>
        </Box>
      ))}
    </VStack>
  );
};

const TruckSelectorContainer = ({ trucks, selectedTruck, onSelectTruck }) => {
  const containerBgColor = useColorModeValue('gray.50', 'gray.800');

  return (
    <Card alignItems="center" flexDirection="column" w="100%">
      <TruckSelector
        trucks={trucks}
        selectedTruck={selectedTruck}
        onSelectTruck={onSelectTruck}
      />
    </Card>
  );
};

export default TruckSelectorContainer;
