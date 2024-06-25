import React from 'react';
import { Flex, Text, Button } from '@chakra-ui/react';

const PredictionGenerator = ({ selectedComponents, onGeneratePrediction }) => {
  const handleGeneratePrediction = () => {
    onGeneratePrediction();
  };

  return (
    <Flex direction="column" w="100%">
      <Text fontSize="xl" fontWeight="bold" mb="4">
        Componentes seleccionados:
      </Text>
      <Flex direction="column" w="100%">
        {selectedComponents.map((component) => (
          <Flex
            key={component.id}
            justify="space-between"
            align="center"
            mb="2"
          >
            <Text>{component.name}</Text>
            <Text>{component.date}</Text>
            <Text>{component.time}</Text>
          </Flex>
        ))}
      </Flex>
      <Button
        mt="4"
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
