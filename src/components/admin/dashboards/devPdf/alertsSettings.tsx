'use client';

import { Box, Checkbox, Flex, Text, Switch } from '@chakra-ui/react';

const AlertsSettings = ({ variables, selectedVariables, selectedAlerts, selectedIncludeAlerts, selectedIncludeVarHistory, onToggle, truckName, onSwitchToggle }) => {
  const labels = {
    Resuelto: 'Resuelto',
    Leido: 'Leído',
    NoLeido: 'No Leído'
  }
  return (
    <Box bg="white" p={4} borderRadius="lg" boxShadow="md" w="300px">
      <Flex justify="space-between" align="center" mb={2}>
        <Text fontWeight="bold">Alertas</Text>
        <Switch
          isChecked={selectedIncludeAlerts}
          onChange={() => onSwitchToggle(truckName, 'includeAlerts')}
        />
      </Flex>
      {Object.keys(labels).map((key, index) => (
        <Flex key={index} justify="space-between" align="center" mb={2}>
          <Text>{labels[key]}</Text>
          <Checkbox
            isChecked={selectedAlerts.includes(key)}
            onChange={() => onToggle(truckName, key)}
          />
        </Flex>
      ))}


      <Flex justify="space-between" align="center" mb={2}>
        <Text fontWeight="bold">Variables</Text>
        <Switch
          isChecked={selectedIncludeVarHistory}
          onChange={() => onSwitchToggle(truckName, 'includeVarHistory')}
        />
      </Flex>
      {variables.map((variable, index) => (
        <Flex key={index} justify="space-between" align="center" mb={2}>
          <Text>{variable}</Text>
          <Checkbox
            isChecked={selectedVariables.includes(variable)}
            onChange={() => onToggle(truckName, variable)}
          />
        </Flex>
      ))}
    </Box>
  );
};

export default AlertsSettings;

