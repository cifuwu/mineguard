'use client';
import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';
import HeaderConfig from 'components/generateReport/headerConfig';
import ItemList from 'components/generateReport/itemList';
import AlertsSettings from 'components/generateReport/alertsSettings';
import AlertsDrivers from 'components/generateReport/alertsDrivers';
import AddItemModal from 'components/generateReport/modalConfig';
import { Box, Flex, Text, Switch } from '@chakra-ui/react';
import DownloadSection from 'components/generateReport/buttonDownload';

const ENDPOINT = process.env.NEXT_PUBLIC_ENDPOINT;

const requestBodyTrucks = {
  query: `
    query AllTrucksNamesAndSerieAndVars {
      allTrucksNamesAndSerieAndVars {
        allTrucksNamesAndSerie {
          name
          serie
        }
        allVars
      }
    }
  `
};

const requestBodyDrivers = {
  query: `
    query AllDriversNamesAndLastnames {
      allDriversNamesAndLastnames {
        name
        lastname
      }
    }
  `
};

/*
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
*/

const MainPage = () => {
  const [trucksModal, setTrucksModal] = useState<any[]>([]);
  const [driversModal, setDriversModal] = useState<any[]>([]);

  // Estado de camiones y conductores
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedTruck, setSelectedTruck] = useState('');
  const [selectedDriver, setSelectedDriver] = useState('');
  const [includeCsv, setIncludeCsv] = useState(false);

  const [trucks, setTrucks] = useState([]);
  const [drivers, setDrivers] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');

  // Estados para switches
  const [isTrucksEnabled, setIsTrucksEnabled] = useState(true);
  const [isDriversEnabled, setIsDriversEnabled] = useState(true);
  
  const [selectedVariables, setSelectedVariables] = useState({});
  const [selectedVariablesDrivers, setSelectedVariablesDrivers] = useState({});

  const accessToken = Cookies.get("accessJWT");

  // Fetch allTrucksNamesAndSerieAndVars
  useEffect(() => {

    fetch(ENDPOINT, {
      method: "POST",
      body: JSON.stringify(requestBodyTrucks),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.errors) {
          console.error("Error:", data.errors[0].message);
        }
        if (data && data.data && data.data.allTrucksNamesAndSerieAndVars.allTrucksNamesAndSerie) {
          const trucksWithVariables = data.data.allTrucksNamesAndSerieAndVars.allTrucksNamesAndSerie.map(truck => ({
            ...truck,  // Mantiene los campos originales de cada camión (name, serie)
            variables: data.data.allTrucksNamesAndSerieAndVars.allVars  // Agrega el campo "variables" con todas las variables de allVars
          }));
  
          console.log(trucksWithVariables);  // Muestra el resultado con el nuevo campo
          setTrucksModal(trucksWithVariables);  // Almacena los camiones con el nuevo campo en el estado
        }
      })
      .catch((error) => {
        console.error("Error fetching trucks information:", error);
      });
  }, []);

  // Fetch AllDriversNamesAndLastnames
  useEffect(() => {

    fetch(ENDPOINT, {
      method: "POST",
      body: JSON.stringify(requestBodyDrivers),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.errors) {
          console.error("Error:", data.errors[0].message);
        }
        if (data && data.data && data.data.allDriversNamesAndLastnames) {
          setDriversModal(data.data.allDriversNamesAndLastnames);
        }
      })
      .catch((error) => {
        console.error("Error fetching drivers information:", error);
      });
  }, []);

  const handleVariableToggle = (truckName, variable) => {
    setSelectedVariables((prev) => {
      // Si no existe la llave truckName, inicializa con un objeto que tenga las llaves 'variables' y 'alerts'
      const currentTruck = prev[truckName] || { serie: truckName, variables: [], alerts: [], includeAlerts: false, includeVarHistory: false };
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
      const currentTruck = prev[truckName] || { serie: truckName, variables: [], alerts: [], includeAlerts: false, includeVarHistory: false };
      
      return {
        ...prev,
        [truckName]: {
          ...currentTruck,
          [field]: !currentTruck[field], // Alterna el valor booleano del campo
        },
      };
    });
  };

  const handleSwitchToggleDriver = (driverKey, field) => {
    const [name, lastname] = driverKey.split('-');
    setSelectedVariablesDrivers((prev) => {
      console.log(prev);
      const currentDriver = prev[driverKey] || { name: name, lastname: lastname, alerts: [], includeAlerts: false, includeActivityHistory: false };
      
      return {
        ...prev,
        [driverKey]: {
          ...currentDriver,
          [field]: !currentDriver[field], // Alterna el valor booleano del campo
        },
      };
    });
  };
  
  const handleVariableToggleDriver = (driverKey, variable) => {
    console.log(driverKey);
    const [name, lastname] = driverKey.split('-');
    setSelectedVariablesDrivers((prev) => {
      
      const currentDriver = prev[driverKey] || { name: name, lastname: lastname, alerts: [], includeAlerts: false, includeActivityHistory: false };
      const currentAlerts = currentDriver.alerts;
      
      if (['Resuelto', 'Leido', 'NoLeido'].includes(variable)) {
        // Manejo de alertas
        if (currentAlerts.includes(variable)) {
          // Eliminar alerta si ya está seleccionada
          return {
            ...prev,
            [driverKey]: {
              ...currentDriver, // Mantiene las variables existentes
              alerts: currentAlerts.filter(v => v !== variable), // Actualiza las alertas
            },
          };
        } else {
          // Agregar alerta si no está seleccionada
          return {
            ...prev,
            [driverKey]: {
              ...currentDriver, // Mantiene las variables existentes
              alerts: [...currentAlerts, variable], // Actualiza las alertas
            },
          };
        }
      }
    });
  };

  const handleCsvSwitchToggle = () => {
    setIncludeCsv(!includeCsv);
  };

  // Función para añadir camiones seleccionados desde el modal
  const handleAddTruck = (selectedTruckSeries) => {
    const selectedTrucks = trucksModal.filter(truck => selectedTruckSeries.includes(truck.serie));
    setTrucks(selectedTrucks);
  };
  const handleAddDriver = (selectedDriverNames) => {
    console.log(selectedDriverNames);
    const selectedDrivers = driversModal.filter(driver => selectedDriverNames.includes(driver.name.concat(" ", driver.lastname)));
    setDrivers(selectedDrivers);
  };
  //const handleAddDriver = (driver) => setDrivers([...drivers, driver]);

  const handleRemoveTruck = (index) => setTrucks(trucks.filter((_, i) => i !== index));
  const handleRemoveDriver = (index) => setDrivers(drivers.filter((_, i) => i !== index));

  const onGenerate = () => {

    const selectedTrucksSeries = trucks.map(truck => truck.serie);
    
    // Formato necesario para enviar
    const trucksFormat = Object.keys(selectedVariables).map(truckName => {
      const truckData = selectedVariables[truckName];
      return {
        serie: truckData.serie,
        includeAlerts: truckData.includeAlerts,
        alerts: truckData.alerts,
        includeVarHistory: truckData.includeVarHistory,
        varList: truckData.variables
      };
    });

    // Eliminar camiones no seleccionados
    const filteredTrucksFormat = trucksFormat.filter(truck => 
      selectedTrucksSeries.includes(truck.serie)
    );
    
    const existingSeries = new Set(filteredTrucksFormat.map(truck => truck.serie));

    // Obtener camiones seleccionados, pero que no incluyen variables ni alertas (tienen los switch apagados)
    const additionalTrucks = selectedTrucksSeries
      .filter(serie => !existingSeries.has(serie)) // Filtra las series que no están en filteredTrucksFormat
      .map(serie => ({
        serie: serie,
        includeAlerts: false,
        alerts: [],
        includeVarHistory: false,
        varList: []
      }));

    // Agregar camiones seleccionados, pero que no incluyen variables ni alertas
    const finalTrucksFormat = [...filteredTrucksFormat, ...additionalTrucks];


    const selectedDrivers = drivers.map(driver => driver.name.concat('-', driver.lastname));
    
    // Formato necesario para enviar
    const driversFormat = Object.keys(selectedVariablesDrivers).map(driverKey => {
      const driverData = selectedVariablesDrivers[driverKey];
      return {
        name: driverData.name,
        lastname: driverData.lastname,
        includeAlerts: driverData.includeAlerts,
        alerts: driverData.alerts,
        includeActivityHistory: driverData.includeActivityHistory
      };
    });

    // Eliminar conductores no seleccionados
    const filteredDriversFormat = driversFormat.filter(driver => 
      selectedDrivers.includes(driver.name.concat('-', driver.lastname))
    );

    const existingDrivers = new Set(filteredDriversFormat.map(driver => driver.name.concat('-', driver.lastname)));
    // Obtener conductores seleccionados, pero que no incluyen variables ni alertas (tienen los switch apagados)

    const additionalDrivers = selectedDrivers
    .filter(driverKey => !existingDrivers.has(driverKey)) // Filtra los conductores que no están en existingDrivers
    .map(driverKey => {
      const [name, lastname] = driverKey.split('-'); // Desestructura name y lastname
      return {
        name: name,
        lastname: lastname,
        includeAlerts: false,
        alerts: [],
        includeActivityHistory: false
      };
    });
      
    // Agregar conductores seleccionados, pero que no incluyen variables ni alertas
    const finalDriversFormat = [...filteredDriversFormat, ...additionalDrivers];

    const config = {
      from: fromDate,
      to: toDate,
      includeTrucks: isTrucksEnabled,
      trucks: finalTrucksFormat,
      includeDrivers: isDriversEnabled,
      drivers: finalDriversFormat,
      includeCsv: includeCsv
    }

    const requestBodyGenerateReport = {
      query: `
        mutation GenerateReport($config: Config!) {
          generateReport(config: $config)
        }
      `,
      variables: {
        "config": config
      }
    };

    // fetch GenerateReport
    fetch(ENDPOINT, {
      method: "POST",
      body: JSON.stringify(requestBodyGenerateReport),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.errors) {
          console.error("Error:", data.errors[0].message);
        }
        if (data && data.data && data.data.generateReport) {
          console.log("Reporte creado exitosamente:", data.data.generateReport);
          
          window.location.href = '/reports';
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });

    console.log(config);
    
  }

  return (
    <Box p={8} maxW="1200px" mx="auto">
      <Text fontSize="3xl" fontWeight="bold" mb={4}>Generación de Reportes</Text>

      <HeaderConfig setFromDate={setFromDate} setToDate={setToDate} />

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
              variables={trucksModal.find(truck => truck.serie === selectedTruck)?.variables || []}
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
          {/* Alertas para los conductores */}
          {isDriversEnabled && selectedDriver && (
            <AlertsDrivers
              selectedAlerts={selectedVariablesDrivers[selectedDriver]?.alerts || []}
              selectedIncludeAlerts={selectedVariablesDrivers[selectedDriver]?.includeAlerts || false}
              selectedIncludeActivityHistory={selectedVariablesDrivers[selectedDriver]?.includeActivityHistory || false}
              onToggle={handleVariableToggleDriver}
              driverFullName={selectedDriver}
              onSwitchToggle={handleSwitchToggleDriver}
            />
          )}
          
        </Flex>
      </Flex>

      

      {/* Modal para agregar camiones o conductores */}
      <AddItemModal
        type={modalType}
        items={modalType === 'truck' ? trucksModal : driversModal}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={modalType === 'truck' ? handleAddTruck : handleAddDriver}
      />

    <DownloadSection isZip={includeCsv} onToggleZip={handleCsvSwitchToggle} onGenerate={onGenerate} />
    </Box>

  );
};

export default MainPage;
