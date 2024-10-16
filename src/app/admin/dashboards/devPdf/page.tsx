'use client';

import { useState } from 'react';
import HeaderConfig from 'components/admin/dashboards/devPdf/headerConfig';
import ItemList from 'components/admin/dashboards/devPdf/itemList';
import AlertsSettings from 'components/admin/dashboards/devPdf/alertsSettings';
import AddItemModal from 'components/admin/dashboards/devPdf/modalConfig';
import DownloadSection from 'components/admin/dashboards/devPdf/buttonDownload';
import { Box, Flex, Text, Switch, Button } from '@chakra-ui/react';

const MainPage = () => {
  // Actualización de los estados iniciales con objetos complejos
  const [trucks, setTrucks] = useState([
    { name: 'Camión 1', series: 'ABC123' },
    { name: 'Camión 2', series: 'XYZ456' },
    { name: 'Camión 3', series: 'DEF789' },
  ]);

  const [drivers, setDrivers] = useState([
    { firstName: 'Nicolás', lastName: '' },
    { firstName: 'Brandon', lastName: '' },
    { firstName: 'Hugo', lastName: '' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  
  // Estados para manejar los switches de camiones y conductores
  const [isTrucksEnabled, setIsTrucksEnabled] = useState(true);
  const [isDriversEnabled, setIsDriversEnabled] = useState(true);

  const handleAddTruck = (truck) => setTrucks([...trucks, truck]);
  const handleAddDriver = (driver) => setDrivers([...drivers, driver]);
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
            type="truck"
            isEnabled={isTrucksEnabled}
            onToggle={() => setIsTrucksEnabled(!isTrucksEnabled)}
          />

          {/* Alertas para los camiones */}
          {isTrucksEnabled && (
            <AlertsSettings
              settings={{
                alerts: true,
                options: [
                  { label: 'Historial de Variables', checked: true },
                  { label: 'Presión en ruedas', checked: true },
                  { label: 'Nivel de aceite', checked: false },
                  { label: 'Amortiguadores', checked: false },
                ]
              }}
              onToggle={() => {}}
            />
          )}
        </Flex>
      </Flex>

      {/* Sección de Conductores */}
      <Flex direction="column" mb={8} alignItems="flex-start"> {/* Alineación a la izquierda */}
        <Flex>
          {/* Lista de Conductores con switch dentro */}
          <ItemList
            title="Conductores"
            items={drivers}
            onAdd={() => { setModalType('driver'); setIsModalOpen(true); }}
            onRemove={handleRemoveDriver}
            type="driver"
            isEnabled={isDriversEnabled}
            onToggle={() => setIsDriversEnabled(!isDriversEnabled)}
          />

          {/* Alertas para los conductores */}
          {isDriversEnabled && (
            <AlertsSettings
              settings={{
                alerts: true,
                options: [{ label: 'Historial de actividad', checked: true }]
              }}
              onToggle={() => {}}
            />
          )}
        </Flex>
      </Flex>

      <DownloadSection/>

      <AddItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={modalType === 'truck' ? handleAddTruck : handleAddDriver}
      />
    </Box>
  );
};

export default MainPage;
