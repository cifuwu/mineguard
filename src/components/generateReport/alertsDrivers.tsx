'use client';

import { Box, Checkbox, Flex, Text, Switch } from '@chakra-ui/react';

const AlertsDrivers = ({ selectedAlerts, selectedIncludeAlerts, selectedIncludeActivityHistory, onToggle, driverFullName, onSwitchToggle }) => {
  const labels = {
    Resuelto: 'Resuelto',
    Leido: 'Leído',
    NoLeido: 'No Leído'
  }
  return (
    <Box maxH='300px' overflowY='auto' bg="white" p={4} borderRadius="lg" boxShadow="md" minW="300px">
      <Flex justify="space-between" align="center" mb={2}>
        <Text fontWeight="bold">Alertas</Text>
        <Switch
          isChecked={selectedIncludeAlerts}
          onChange={() => onSwitchToggle(driverFullName, 'includeAlerts')}
        />
      </Flex>
      {Object.keys(labels).map((key, index) => (
        <Flex key={index} justify="space-between" align="center" mb={2}>
          <Text>{labels[key]}</Text>
          <Checkbox
            isChecked={selectedAlerts.includes(key)}
            onChange={() => onToggle(driverFullName, key)}
          />
        </Flex>
      ))}

      <Flex justify="space-between" align="center" mb={2}>
        <Text fontWeight="bold">Historial de Actividad</Text>
        <Switch
          isChecked={selectedIncludeActivityHistory}
          onChange={() => onSwitchToggle(driverFullName, 'includeActivityHistory')}
        />
      </Flex>
      
    </Box>
  );
};

export default AlertsDrivers;

