'use client';
import { Box, Flex, Text, IconButton, Switch, Button } from '@chakra-ui/react';
import { DeleteIcon, AddIcon} from '@chakra-ui/icons'



const ItemList = ({ title, items, onAdd, onRemove, type, isEnabled, onToggle }) => {
  return (
    <Box bg="white" p={4} borderRadius="lg" boxShadow="md" w="300px" mr={10}>
      <Flex align="center" justify="space-between" mb={4}>
        <Text fontWeight="bold" fontSize="lg">{title}</Text>
        <Switch isChecked={isEnabled} onChange={onToggle} />
      </Flex>

      {/* Mostrar lista solo si el switch está habilitado */}
      {isEnabled && (
        <>
          {/* Lista de ítems con botón de eliminar */}
          {items.map((item, index) => (
            <Flex key={index} justify="space-between" align="center" mb={2}>
              {type === "truck" ? (
                <Text>{item.name} - {item.series}</Text> // Camión tiene nombre y serie
              ) : (
                <Text>{item.firstName} {item.lastName}</Text> // Conductor tiene nombre y apellido
              )}
              <Button
                leftIcon={<DeleteIcon />}
                aria-label="Eliminar"
                onClick={() => onRemove(index)}
                size="sm"
              />
            </Flex>
          ))}

          {/* Botón para agregar un nuevo ítem */}
          <Box display="flex" justifyContent="center" alignItems="center">
            <Button
              leftIcon={<AddIcon />}
              borderColor="#7551FF"
              color="#7551FF"
              variant="outline"
              onClick={onAdd}
              _hover={{ bg: "#F3F2FF" }} 
            >
              Añadir
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};
export default ItemList;
