'use client';

import React, { useState } from 'react';
import { Flex, Text } from '@chakra-ui/react';
import TruckSelector from '../../../../components/admin/dashboards/devPred/truckSelector';
import ComponentSelector from '../../../../components/admin/dashboards/devPred/componentSelector';
import PredictionGenerator from '../../../../components/admin/dashboards/devPred/predictionGenerator';

// Ejemplo de datos simulados
const trucks = [
  { id: 1, name: 'Camión 1' },
  { id: 2, name: 'Camión 2' },
  { id: 3, name: 'Camión 3' },
  { id: 4, name: 'Camión 4' },
  { id: 5, name: 'Camión 5' },
  { id: 6, name: 'Camión 6' },
  { id: 7, name: 'Camión 7' },
  { id: 8, name: 'Camión 8' },
  { id: 9, name: 'Camión 9' },
  { id: 10, name: 'Camión 10' },
];

const componentsByTruck = {
  1: [
    { id: 1, name: 'Componente A', date: '2024-06-25', time: '08:00' },
    { id: 2, name: 'Componente B', date: '2024-06-26', time: '10:00' },
  ],
  2: [
    { id: 3, name: 'Componente C', date: '2024-06-27', time: '12:00' },
    { id: 4, name: 'Componente D', date: '2024-06-28', time: '14:00' },
  ],
  3: [
    { id: 5, name: 'Componente E', date: '2024-06-29', time: '16:00' },
    { id: 6, name: 'Componente F', date: '2024-06-30', time: '18:00' },
  ],
};

const ManualPredictionPage = () => {
  const [selectedTruck, setSelectedTruck] = useState('');
  const [selectedComponents, setSelectedComponents] = useState([]);

  const handleTruckSelect = (truckId) => {
    setSelectedTruck(truckId);
    setSelectedComponents([]);
  };

  const handleComponentSelect = (componentId) => {
    if (selectedComponents.includes(componentId)) {
      setSelectedComponents(
        selectedComponents.filter((id) => id !== componentId),
      );
    } else {
      setSelectedComponents([...selectedComponents, componentId]);
    }
  };

  const handleGeneratePrediction = () => {
    // Lógica para generar la predicción
    console.log('Componentes seleccionados:', selectedComponents);
    // Aquí iría la lógica para generar la predicción
  };

  const components = selectedTruck ? componentsByTruck[selectedTruck] : [];

  return (
    <Flex direction="column" justify="center" h="100vh">
      <Text fontSize="3xl" fontWeight="bold" mb="8">
        Predicción Manual
      </Text>
      <Flex justify="space-between" w="80%">
        <TruckSelector trucks={trucks} onSelectTruck={handleTruckSelect} />
        {selectedTruck && (
          <ComponentSelector
            components={components}
            onSelectComponent={handleComponentSelect}
          />
        )}
        {selectedComponents.length > 0 && (
          <PredictionGenerator
            selectedComponents={selectedComponents}
            onGeneratePrediction={handleGeneratePrediction}
          />
        )}
      </Flex>
    </Flex>
  );
};

export default ManualPredictionPage;
