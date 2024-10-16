import React from 'react';
import { Flex, Text, Button } from '@chakra-ui/react';

const PredictionGenerator = ({ selectedComponents, onGeneratePrediction }) => {
  const handleGeneratePrediction = () => {
    onGeneratePrediction();
  };

  return (
    <Flex direction="column" w="100%">
      <Flex direction="column" w="100%">
        {selectedComponents.map((component) => (
          <Flex
            key={component.componentID}
            justify="space-between"
            align="center"
            mb="2"
          >
            <Text>{component.name}</Text>
          </Flex>
        ))}
      </Flex>
      <Button
        mt="4"
        py="8"
        colorScheme="blue"
        size="lg"
        onClick={handleGeneratePrediction}
      >
        Generar Predicción
      </Button>
    </Flex>
  );
};

export default PredictionGenerator;
