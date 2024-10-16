'use client';

import { useState } from 'react';
import HeaderConfig from 'components/admin/dashboards/devPdf/headerConfig';
import ItemList from 'components/admin/dashboards/devPdf/itemList';
import AlertsSettings from 'components/admin/dashboards/devPdf/alertsSettings';
import AddItemModal from 'components/admin/dashboards/devPdf/modalConfig';
import { Box, Flex, Text, Switch } from '@chakra-ui/react';

const trucksExample = [{
  "name": "WA900-8R",
  "serie": "A50000",
  "variables": ["Presion", "Temperatura"]
},
{
  "name": "WE1850",
  "serie": "A50001",
  "variables": ["Aceite", "Carga"]
}];

const driversExample = [{
  "name": "Nicolas",
  "lastname": "Vargas"
},
{
  "name": "Sebastian",
  "lastname": "Cifuentes"
}];

const MainPage = () => {
  // Estado de camiones y conductores
  const [selectedTruck, setSelectedTruck] = useState('');
  const [selectedDriver, setSelectedDriver] = useState('');

  const [trucks, setTrucks] = useState([]);
  const [drivers, setDrivers] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');

  // Estados para switches
  const [isTrucksEnabled, setIsTrucksEnabled] = useState(true);
  const [isDriversEnabled, setIsDriversEnabled] = useState(true);

  const [selectedVariables, setSelectedVariables] = useState({});

  const handleVariableToggle = (truckName, variable) => {
    setSelectedVariables((prev) => {
      console.log(prev);
      // Si no existe la llave truckName, inicializa con un objeto que tenga las llaves 'variables' y 'alerts'
      const currentTruck = prev[truckName] || { variables: [], alerts: [], includeAlerts: false, includeVarHistory: false };
      const currentVariables = currentTruck.variables;
      const currentAlerts = currentTruck.alerts;
  
      if (['Resuelto', 'Leido', 'NoLeido'].includes(variable)) {
        // Manejo de alertas
        if (currentAlerts.includes(variable)) {
          // Eliminar alerta si ya está seleccionada
          return {
            ...prev,
            [truckName]: {
              ...currentTruck, // Mantiene las variables existentes
              alerts: currentAlerts.filter(v => v !== variable), // Actualiza las alertas
            },
          };
        } else {
          // Agregar alerta si no está seleccionada
          return {
            ...prev,
            [truckName]: {
              ...currentTruck, // Mantiene las variables existentes
              alerts: [...currentAlerts, variable], // Actualiza las alertas
            },
          };
        }
      } else {
        // Manejo de variables
        if (currentVariables.includes(variable)) {
          // Eliminar variable si ya está seleccionada
          return {
            ...prev,
            [truckName]: {
              ...currentTruck, // Mantiene las alertas existentes
              variables: currentVariables.filter(v => v !== variable), // Actualiza las variables
            },
          };
        } else {
          // Agregar variable si no está seleccionada
          return {
            ...prev,
            [truckName]: {
              ...currentTruck, // Mantiene las alertas existentes
              variables: [...currentVariables, variable], // Actualiza las variables
            },
          };
        }
      }
    });
  };

  const handleSwitchToggle = (truckName, field) => {
    setSelectedVariables((prev) => {
      console.log(prev);
      const currentTruck = prev[truckName] || { variables: [], alerts: [], includeAlerts: false, includeVarHistory: false };
      
      return {
        ...prev,
        [truckName]: {
          ...currentTruck,
          [field]: !currentTruck[field], // Alterna el valor booleano del campo
        },
      };
    });
  };
  
  // Función para añadir camiones seleccionados desde el modal
  const handleAddTruck = (selectedTruckNames) => {
    const selectedTrucks = trucksExample.filter(truck => selectedTruckNames.includes(truck.name));
    setTrucks(selectedTrucks);
  };
  const handleAddDriver = (selectedDriverNames) => {
    console.log(selectedDriverNames);
    const selectedDrivers = driversExample.filter(driver => selectedDriverNames.includes(driver.name.concat(" ", driver.lastname)));
    setDrivers(selectedDrivers);
  };
  //const handleAddDriver = (driver) => setDrivers([...drivers, driver]);

  const handleRemoveTruck = (index) => setTrucks(trucks.filter((_, i) => i !== index));
  const handleRemoveDriver = (index) => setDrivers(drivers.filter((_, i) => i !== index));

  return (
    <Box p={8} maxW="1200px" mx="auto">
      <Text fontSize="3xl" fontWeight="bold" mb={4}>Generación de Reportes</Text>

      <HeaderConfig />

      {/* Sección de Camiones */}
      <Flex direction="column" mb={8} alignItems="flex-start">
        <Flex>
          {/* Lista de Camiones con switch dentro */}
          <ItemList
            title="Camiones"
            items={trucks}
            onAdd={() => { setModalType('truck'); setIsModalOpen(true); }}
            onRemove={handleRemoveTruck}
            isEnabled={isTrucksEnabled}
            onToggle={() => setIsTrucksEnabled(!isTrucksEnabled)}
            setSelectedTruck={setSelectedTruck}
            setSelectedDriver={setSelectedDriver}
          />

          {/* Alertas para los camiones */}
          {isTrucksEnabled && selectedTruck && (
            <AlertsSettings
              variables={trucksExample.find(truck => truck.name === selectedTruck)?.variables || []}
              selectedVariables={selectedVariables[selectedTruck]?.variables || []}
              selectedAlerts={selectedVariables[selectedTruck]?.alerts || []}
              selectedIncludeAlerts={selectedVariables[selectedTruck]?.includeAlerts || false}
              selectedIncludeVarHistory={selectedVariables[selectedTruck]?.includeVarHistory || false}
              onToggle={handleVariableToggle}
              onSwitchToggle={handleSwitchToggle}
              truckName={selectedTruck}
            />
          )}
        </Flex>
      </Flex>




      <Flex direction="column" mb={8} alignItems="flex-start">
        <Flex>
          {/* Lista de Camiones con switch dentro */}
          <ItemList
            title="Conductores"
            items={drivers}
            onAdd={() => { setModalType('driver'); setIsModalOpen(true); }}
            onRemove={handleRemoveDriver}
            isEnabled={isDriversEnabled}
            onToggle={() => setIsDriversEnabled(!isDriversEnabled)}
            setSelectedTruck={setSelectedTruck}
            setSelectedDriver={setSelectedDriver}
          />

          
        </Flex>
      </Flex>

      

      {/* Modal para agregar camiones o conductores */}
      <AddItemModal
        type={modalType}
        items={modalType === 'truck' ? trucksExample : driversExample}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={modalType === 'truck' ? handleAddTruck : handleAddDriver}
      />
    </Box>
  );
};

export default MainPage;
