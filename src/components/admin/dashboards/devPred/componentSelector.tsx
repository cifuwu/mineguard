import React from 'react';
import {
  VStack,
  Text,
  Checkbox,
  Box,
  useColorModeValue,
} from '@chakra-ui/react';

const ComponentSelector = ({ components, onSelectComponent }) => {
  const handleComponentSelect = (componentId) => {
    onSelectComponent(componentId);
  };

  return (
    <VStack
      align="flex-start"
      spacing="3"
      w="100%"
      maxH="300px"
      overflowY="auto"
    >
      <Text fontSize="md" fontWeight="bold" mb="4">
        Selección Componente
      </Text>
      <Box w="100%">
        {components.map((component) => (
          <Box
            key={component.id}
            w="100%"
            p="3"
            display="flex"
            alignItems="center"
          >
            <Box flex="1">
              <span>{component.name}</span>
            </Box>
            <Checkbox
              colorScheme="brand"
              isChecked={component.isSelected}
              onChange={() => handleComponentSelect(component.id)}
              mr="4"
            />
          </Box>
        ))}
      </Box>
    </VStack>
  );
};

const ComponentSelectorContainer = ({ components, onSelectComponent }) => {
  const containerBgColor = useColorModeValue('gray.50', 'gray.800');

  return (
    <Box
      bg={containerBgColor}
      borderRadius="xl"
      p={4}
      boxShadow="md"
      w="100%"
      maxW="sm"
      mx="auto"
      my={4}
    >
      <ComponentSelector
        components={components}
        onSelectComponent={onSelectComponent}
      />
    </Box>
  );
};

export default ComponentSelectorContainer;
