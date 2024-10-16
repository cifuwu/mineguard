'use client';

import { Box, Checkbox, Flex, Text } from '@chakra-ui/react';

const AlertsSettings = ({ settings, onToggle }) => {
  return (
    <Box bg="white" p={4} borderRadius="lg" boxShadow="md" w="300px">
      <Flex justify="space-between" align="center" mb={2}>
        <Text fontWeight="bold">Alertas</Text>
        <Checkbox
          isChecked={settings.alerts}
          onChange={() => onToggle('alerts')}
        />
      </Flex>

      {settings.options.map((option, index) => (
        <Flex key={index} justify="space-between" align="center" mb={2}>
          <Text>{option.label}</Text>
          <Checkbox
            isChecked={option.checked}
            onChange={() => onToggle('options', index)}
          />
        </Flex>
      ))}
    </Box>
  );
};

export default AlertsSettings;

