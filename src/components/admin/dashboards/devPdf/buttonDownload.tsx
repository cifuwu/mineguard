import { Box, Flex, Switch, Button, Text } from '@chakra-ui/react';

const DownloadSection = ({ isZip, onToggleZip, onGenerate }) => {
  return (
    <Flex justify="space-between" align="center" mt={4}>
      <Flex align="center">
        <Text mr={2}>Descargar datos en formato csv</Text> 
        <Switch isChecked={isZip} onChange={onToggleZip} />
      </Flex>
      <Button bg={"#7551FF"} textColor={"#FFF"} _hover={{ bg: "#752FFF" }} onClick={onGenerate}>Generar</Button>
    </Flex>
  );
};

export default DownloadSection;
