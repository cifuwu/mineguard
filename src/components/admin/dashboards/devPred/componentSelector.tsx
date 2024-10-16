import React from 'react';
import {
  VStack,
  Text,
  Checkbox,
  Box,
  useColorModeValue,
} from '@chakra-ui/react';
import Card from 'components/card/Card';

const ComponentSelector = ({ components, onSelectComponent }) => {
  const handleComponentSelect = (componentId) => {
    onSelectComponent(componentId);
  };

  return (
    <VStack
      align="flex-start"
      spacing="3"
      w="100%"
      maxH="600px"
      overflowY="auto"
    >
      <Text fontSize="md" fontWeight="bold" mb="4">
        Selección Componente
      </Text>
      <Box w="100%">
        {components.map((component) => (
          <Box
            key={component.componentID}
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
              onChange={() => handleComponentSelect(component.componentID)}
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
    <Card alignItems="center" flexDirection="column" w="100%">
      <ComponentSelector
        components={components}
        onSelectComponent={onSelectComponent}
      />
    </Card>
  );
};

export default ComponentSelectorContainer;
