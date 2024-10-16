'use client';
import { Box, Flex, Text, IconButton, Switch, Button, Checkbox } from '@chakra-ui/react';
import { DeleteIcon, AddIcon} from '@chakra-ui/icons'

const ItemList = ({ title, items, onAdd, onRemove, isEnabled, onToggle, setSelectedTruck, setSelectedDriver }) => {

  return (
    <Box bg="white" p={4} borderRadius="lg" boxShadow="md" w="300px" mr={10}>
      <Flex align="center" justify="space-between" mb={4}>
        <Text fontWeight="bold" fontSize="lg">{title}</Text>
        <Switch isChecked={isEnabled} onChange={onToggle} />
      </Flex>

      {/* Mostrar lista de camiones solo si el switch está habilitado */}
      {isEnabled && (
        <>
          {/* Lista de camiones */}
          {items.map((item, index) => (
            <Box key={index}>
              <Flex
                justify="space-between"
                align="center"
                mb={2}
                onClick={() => {title === 'Camiones' ? setSelectedTruck(item.name) : setSelectedDriver}}
                cursor="pointer"
              >
                <Text>{ title === 'Camiones' ? `${item.name} - ${item.serie}` : `${item.name} ${item.lastname}`}</Text>
                <Button
                  leftIcon={<DeleteIcon />}
                  aria-label="Eliminar"
                  onClick={() => onRemove(index)}
                  size="sm"
                />
              </Flex>
            </Box>
          ))}

          {/* Botón para agregar un nuevo camión */}
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
