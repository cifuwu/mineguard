'use client';

import React, { useState } from 'react';
import { Grid, Box, Input, Select, Button, VStack, Text, Alert, AlertIcon } from "@chakra-ui/react";
import Card from "components/card/Card";
import { useRouter } from 'next/navigation';

const ManagementPage = () => {
  const router = useRouter();

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
    console.log({ serie, modelo, conductor });
    setAlertMessage('');
  };

  const handleApplyCreateDriver = () => {
    if (!nombre || !numero || !tipoUsuario) {
      setAlertMessage('Por favor, rellena todos los campos para crear un conductor.');
      return;
    }
    console.log({ nombre, numero, tipoUsuario });
    setAlertMessage('');
  };

  const handleSearchTruck = () => {
    if (!modeloSearch && !serieSearch) {
      setAlertMessage('Por favor, rellena al menos un campo para buscar un camión.');
      return;
    }
    router.push(`/searchTruck?truck=${modeloSearch}&serie=${serieSearch}`);
    setAlertMessage('');
  };

  const handleSearchDriver = () => {
    if (!nombreSearch && !numeroSearch) {
      setAlertMessage('Por favor, rellena al menos un campo para buscar un conductor.');
      return;
    }
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
                <option value="modelo1">Modelo 1</option>
                <option value="modelo2">Modelo 2</option>
              </Select>
              <Select placeholder="Conductor" value={conductor} onChange={(e) => setConductor(e.target.value)}>
                <option value="conductor1">Conductor 1</option>
                <option value="conductor2">Conductor 2</option>
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
                <option value="modelo1">Modelo 1</option>
                <option value="modelo2">Modelo 2</option>
              </Select>
              <Select placeholder="Por serie" value={serieSearch} onChange={(e) => setSerieSearch(e.target.value)}>
                <option value="serie1">Serie 1</option>
                <option value="serie2">Serie 2</option>
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
                <option value="tipo1">Tipo 1</option>
                <option value="tipo2">Tipo 2</option>
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
                <option value="nombre1">Nombre 1</option>
                <option value="nombre2">Nombre 2</option>
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
