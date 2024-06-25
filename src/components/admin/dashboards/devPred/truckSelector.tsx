import React from 'react';
import { VStack, Box, Text, useColorModeValue } from '@chakra-ui/react';

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
      spacing="4"
      w="100%"
      maxH="300px"
      overflowY="auto"
    >
      {trucks.map((truck) => (
        <Box
          key={truck.id}
          w="100%"
          p="3"
          cursor="pointer"
          onClick={() => handleTruckSelect(truck.id)}
          bg={selectedTruck === truck.id ? selectedBgColor : bgColor}
          borderRadius="md"
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

export default TruckSelector;
