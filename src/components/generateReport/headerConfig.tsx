import { Flex, Text, Input, Box } from '@chakra-ui/react';

const HeaderConfig = ({ setFromDate, setToDate }) => {
  return (
    <Flex align="center" justify="space-between" mt={4} mb={4} p={4} boxShadow="sm" borderRadius="md">
      <Text fontSize="2xl" fontWeight="bold" mb={0}>Configuración Reporte</Text>

      <Flex align="center" gap={4}>
        <Flex align="center">
          <Text fontSize="md" fontWeight="medium" mr={2}>Desde</Text>
          <Input type="date" size="md" onChange={(e) => setFromDate(new Date(e.target.value).getTime().toString())} />
        </Flex>

        <Flex align="center">
          <Text fontSize="md" fontWeight="medium" mr={2}>Hasta</Text>
          <Input type="date" size="md" onChange={(e) => setToDate((new Date(e.target.value).getTime() + 86340000).toString())} />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default HeaderConfig;
