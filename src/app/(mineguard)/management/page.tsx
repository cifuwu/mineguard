'use client';

import React, { useState, useEffect } from 'react';
import { Grid, Box, Input, Select, Button, VStack, Text, Alert, AlertIcon, useToast } from "@chakra-ui/react";
import Card from "components/card/Card";
import { useRouter } from 'next/navigation';

const ENDPOINT = process.env.NEXT_PUBLIC_ENDPOINT;

const requestBodyGetTrucks = {
  query: `
    query GetTrucksResults {
      getTrucksResults {
        serie
        model
        driver
        driverID
        status
      }
    }
  `
};

const requestBodyGetDrivers = {
  query: `
    query GetDrivers {
      getDrivers {
        _id
        name
        contactNumber
        userType
      }
    }
  `
};

const ManagementPage = () => {
  const router = useRouter();
  const toast = useToast();

  const [trucksData, setTrucksData] = useState([]);
  const [uniqueModels, setUniqueModels] = useState([]);
  const [uniqueSeries, setUniqueSeries] = useState([]);

  const [driversData, setDriversData] = useState([]);
  const [uniqueDriverNames, setUniqueDriverNames] = useState([]);

  const [serie, setSerie] = useState('');
  const [modelo, setModelo] = useState('');
  const [conductor, setConductor] = useState('');
  
  const [nombre, setNombre] = useState('');
  const [numero, setNumero] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('');
  
  const [modeloSearch, setModeloSearch] = useState('');
  const [serieSearch, setSerieSearch] = useState('');
  
  const [nombreSearch, setNombreSearch] = useState('');
  const [numeroSearch, setNumeroSearch] = useState('');

  const [alertMessage, setAlertMessage] = useState('');

  // Fetch GetTrucksResults
  useEffect(() => {

    fetch(ENDPOINT, {
      method: "POST",
      body: JSON.stringify(requestBodyGetTrucks),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.errors) {
          console.error("Error:", data.errors[0].message);
        }
        if (data && data.data && data.data.getTrucksResults) {
          console.log(data.data.getTrucksResults);
          setTrucksData(data.data.getTrucksResults);
          setUniqueModels([... new Set(data.data.getTrucksResults.map(truck => truck.model))]);
          setUniqueSeries([... new Set(data.data.getTrucksResults.map(truck => truck.serie))]);
        }
      })
      .catch((error) => {
        console.error("Error fetching trucks information:", error);
      });
  }, []);

  // Fetch GetDrivers
  useEffect(() => {

    fetch(ENDPOINT, {
      method: "POST",
      body: JSON.stringify(requestBodyGetDrivers),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.errors) {
          console.error("Error:", data.errors[0].message);
        }
        if (data && data.data && data.data.getDrivers) {
          console.log(data.data.getDrivers);
          setDriversData(data.data.getDrivers);
          setUniqueDriverNames([... new Set(data.data.getDrivers.map(driver => driver.name))])
        }
      })
      .catch((error) => {
        console.error("Error fetching drivers information:", error);
      });
  }, []);

  const handleClearCreateTruck = () => {
    setSerie('');
    setModelo('');
    setConductor('');
    setAlertMessage('');
  };

  const handleClearCreateDriver = () => {
    setNombre('');
    setNumero('');
    setTipoUsuario('');
    setAlertMessage('');
  };

  const handleApplyCreateTruck = () => {
    if (!serie || !modelo || !conductor) {
      setAlertMessage('Por favor, rellena todos los campos para crear un camión.');
      return;
    }
    const conductorId = driversData.find(driver => driver.name === conductor)._id;
    console.log({ serie, modelo, conductor, conductorId });
    setAlertMessage('');

    const requestBodyAddTruck = {
      query: `
        mutation AddTruck($truck: TruckInput) {
          addTruck(truck: $truck)
        }
      `,
      variables: {
        "truck": {
          "driverID": conductorId,
          "model": modelo,
          "serie": serie
        }
      }
    };

    fetch(ENDPOINT, {
      method: "POST",
      body: JSON.stringify(requestBodyAddTruck),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.errors) {
          console.error("Error:", data.errors[0].message);
          toast({
            title: 'Ha ocurrido un error.',
            description: `Por favor, inténtelo más tarde. Si el problema continúa, comuníquese con un administrador.`,
            status: 'error',
            duration: 9000,
            isClosable: true,
          })
        }
        if (data && data.data && data.data.addTruck) {
          console.log("Camión creado exitosamente:", data.data.addTruck);
          toast({
            title: 'Camión creado exitosamente.',
            description: `Se ha creado un camión ${modelo} con serie ${serie} y conductor ${conductor}.`,
            status: 'success',
            duration: 9000,
            isClosable: true,
          })
        }
      })
      .catch((error) => {
        console.log("Error:", error);
        toast({
          title: 'Ha ocurrido un error.',
          description: `Por favor, inténtelo más tarde. Si el problema continúa, comuníquese con un administrador.`,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      });
  };

  const handleApplyCreateDriver = () => {
    if (!nombre || !numero || !tipoUsuario) {
      setAlertMessage('Por favor, rellena todos los campos para crear un conductor.');
      return;
    }
    console.log({ nombre, numero, tipoUsuario });
    setAlertMessage('');

    const requestBodyAddDriver = {
      query: `
        mutation AddDriver($driver: DriverInput) {
          addDriver(driver: $driver)
        }
      `,
      variables: {
        "driver": {
          "contactNumber": numero,
          "name": nombre,
          "userType": tipoUsuario
        }
      }
    };

    fetch(ENDPOINT, {
      method: "POST",
      body: JSON.stringify(requestBodyAddDriver),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.errors) {
          console.error("Error:", data.errors[0].message);
          toast({
            title: 'Ha ocurrido un error.',
            description: `Por favor, inténtelo más tarde. Si el problema continúa, comuníquese con un administrador.`,
            status: 'error',
            duration: 9000,
            isClosable: true,
          })
        }
        if (data && data.data && data.data.addDriver) {
          console.log("Conductor creado exitosamente:", data.data.addDriver);
          toast({
            title: 'Conductor creado exitosamente.',
            description: `Se ha creado un conductor con nombre ${nombre} y número ${numero}.`,
            status: 'success',
            duration: 9000,
            isClosable: true,
          })
        }
      })
      .catch((error) => {
        console.log("Error:", error);
        toast({
          title: 'Ha ocurrido un error.',
          description: `Por favor, inténtelo más tarde. Si el problema continúa, comuníquese con un administrador.`,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      });

  };

  const handleSearchTruck = () => {
    //if (!modeloSearch && !serieSearch) {
    //  setAlertMessage('Por favor, rellena al menos un campo para buscar un camión.');
    //  return;
    //}
    router.push(`/searchTruck?truck=${modeloSearch}&serie=${serieSearch}`);
    setAlertMessage('');
  };

  const handleSearchDriver = () => {
    //if (!nombreSearch && !numeroSearch) {
    //  setAlertMessage('Por favor, rellena al menos un campo para buscar un conductor.');
    //  return;
    //}
    router.push(`/searchDriver?name=${nombreSearch}&number=${numeroSearch}`);
    setAlertMessage('');
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      
      {alertMessage && (
        <Alert status="warning" mb={4}>
          <AlertIcon />
          {alertMessage}
        </Alert>
      )}
      
      <Grid templateColumns={{ base: "1fr", xl: "2fr 1fr" }} gap="40px">
        {/* CREACIÓN DE CAMIÓN */}
        <Box>
          <Text fontSize="xl" fontWeight="bold" mb={4}>Creación de Camión</Text>
          <Card>
            <VStack align="stretch" spacing={4}>
              <Input placeholder="Serie" value={serie} onChange={(e) => setSerie(e.target.value)} />
              <Select placeholder="Modelo" value={modelo} onChange={(e) => setModelo(e.target.value)}>
                {uniqueModels.map((model, index) => (
                  <option key={`${model}${index}`} value={model}>{model}</option>
                ))}
              </Select>
              <Select placeholder="Conductor" value={conductor} onChange={(e) => setConductor(e.target.value)}>
                {uniqueDriverNames.map((driverNmae, index) => (
                  <option key={`${driverNmae}${index}`} value={driverNmae}>{driverNmae}</option>
                ))}
              </Select>
              <Box display="flex" justifyContent="space-between" mt={4}>
                <Button colorScheme="red" onClick={handleClearCreateTruck}>Cancelar</Button>
                <Button variant="brand" onClick={handleApplyCreateTruck}>Aplicar</Button>
              </Box>
            </VStack>
          </Card>
        </Box>

        {/* BÚSQUEDA DE CAMIÓN */}
        <Box>
          <Text fontSize="xl" fontWeight="bold" mb={4}>Buscar Camión</Text>
          <Card>
            <VStack align="stretch" spacing={4}>
              <Select placeholder="Por modelo" value={modeloSearch} onChange={(e) => setModeloSearch(e.target.value)}>
                {uniqueModels.map((model, index) => (
                  <option key={`${model}${index}`} value={model}>{model}</option>
                ))}
              </Select>
              <Select placeholder="Por serie" value={serieSearch} onChange={(e) => setSerieSearch(e.target.value)}>
                {uniqueSeries.map((serie, index) => (
                  <option key={`${serie}${index}`} value={serie}>{serie}</option>
                ))}
              </Select>
              <Button variant="brand" mt={4} onClick={handleSearchTruck}>Buscar</Button>
            </VStack>
          </Card>
        </Box>
      </Grid>

      <Grid templateColumns={{ base: "1fr", xl: "2fr 1fr" }} gap="40px" mt="40px">
        {/* CREACIÓN DE CONDUCTOR */}
        <Box>
          <Text fontSize="xl" fontWeight="bold" mb={4}>Creación de Conductor</Text>
          <Card>
            <VStack align="stretch" spacing={4}>
              <Input placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
              <Input placeholder="Número" type="tel" value={numero} onChange={(e) => setNumero(e.target.value)} />
              <Select placeholder="Tipo de usuario" value={tipoUsuario} onChange={(e) => setTipoUsuario(e.target.value)}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Select>
              <Box display="flex" justifyContent="space-between" mt={4}>
                <Button colorScheme="red" onClick={handleClearCreateDriver}>Cancelar</Button>
                <Button variant="brand" onClick={handleApplyCreateDriver}>Aplicar</Button>
              </Box>
            </VStack>
          </Card>
        </Box>

        {/* BÚSQUEDA DE CONDUCTOR */}
        <Box>
          <Text fontSize="xl" fontWeight="bold" mb={4}>Buscar Conductor</Text>
          <Card>
            <VStack align="stretch" spacing={4}>
              <Select placeholder="Por nombre" value={nombreSearch} onChange={(e) => setNombreSearch(e.target.value)}>
                {uniqueDriverNames.map((driverNmae, index) => (
                  <option key={`${driverNmae}${index}`} value={driverNmae}>{driverNmae}</option>
                ))}
              </Select>
              <Input placeholder="Por #" type="tel" value={numeroSearch} onChange={(e) => setNumeroSearch(e.target.value)} />
              <Button variant="brand" mt={4} onClick={handleSearchDriver}>Buscar</Button>
            </VStack>
          </Card>
        </Box>
      </Grid>
    </Box>
  );
};

export default ManagementPage;
