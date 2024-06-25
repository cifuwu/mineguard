import React from 'react';
import { VStack, Checkbox, Box } from '@chakra-ui/react';

const ComponentSelector = ({ components, onSelectComponent }) => {
  const handleComponentSelect = (componentId) => {
    onSelectComponent(componentId);
  };

  return (
    <VStack
      align="flex-start"
      spacing="4"
      w="100%"
      maxH="300px"
      overflowY="auto"
    >
      <Box w="100%">
        {components.map((component) => (
          <Box
            key={component.id}
            w="100%"
            p="2"
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

export default ComponentSelector;
