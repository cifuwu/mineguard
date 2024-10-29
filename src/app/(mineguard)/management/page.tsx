'use client';

import React, { useState } from 'react';
import { Grid, Box, Input, Select, Button, VStack, Text } from "@chakra-ui/react";
import Card from "components/card/Card";

const ManagementPage = () => {
  const [id, setId] = useState('');
  const [modelo, setModelo] = useState('');
  const [conductor, setConductor] = useState('');

  const [nombre, setNombre] = useState('');
  const [numero, setNumero] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('');

  const handleClearCard1 = () => {
    setId('');
    setModelo('');
    setConductor('');
  };

  const handleClearCard3 = () => {
    setNombre('');
    setNumero('');
    setTipoUsuario('');
  };

  const handleApplyCard1 = () => {
    console.log({ id, modelo, conductor });
  };

  const handleApplyCard3 = () => {
    console.log({ nombre, numero, tipoUsuario });
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Grid templateColumns={{ base: "1fr", xl: "2fr 1fr" }} gap="40px">

        {/* CREACIÓN DE CAMIÓN */}
        <Box>
          <Text fontSize="xl" fontWeight="bold" mb={4}>Creación de Camión</Text>
          <Card>
            <VStack align="stretch" spacing={4}>
              <Input placeholder="ID" value={id} onChange={(e) => setId(e.target.value)} />
              <Select placeholder="Modelo" value={modelo} onChange={(e) => setModelo(e.target.value)}>
                <option value="modelo1">Modelo 1</option>
                <option value="modelo2">Modelo 2</option>
              </Select>
              <Select placeholder="Conductor" value={conductor} onChange={(e) => setConductor(e.target.value)}>
                <option value="conductor1">Conductor 1</option>
                <option value="conductor2">Conductor 2</option>
              </Select>
              <Box display="flex" justifyContent="space-between" mt={4}>
                <Button colorScheme="red" onClick={handleClearCard1}>Cancelar</Button>
                <Button variant="brand" onClick={handleApplyCard1}>Aplicar</Button>
              </Box>
            </VStack>
          </Card>
        </Box>

        {/* BÚSQUEDA DE CAMIÓN */}
        <Box>
          <Text fontSize="xl" fontWeight="bold" mb={4}>Buscar Camión</Text>
          <Card>
            <VStack align="stretch" spacing={4}>
              <Select placeholder="Por modelo">
                <option value="modelo1">Modelo 1</option>
                <option value="modelo2">Modelo 2</option>
              </Select>
              <Select placeholder="Por ID">
                <option value="id1">ID 1</option>
                <option value="id2">ID 2</option>
              </Select>
              <Button variant="brand" mt={4}>Buscar</Button>
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
                <Button colorScheme="red" onClick={handleClearCard3}>Cancelar</Button>
                <Button variant="brand" onClick={handleApplyCard3}>Aplicar</Button>
              </Box>
            </VStack>
          </Card>
        </Box>

        {/* BÚSQUEDA DE CONDUCTOR */}
        <Box>
          <Text fontSize="xl" fontWeight="bold" mb={4}>Buscar Conductor</Text>
          <Card>
            <VStack align="stretch" spacing={4}>
              <Select placeholder="Por nombre">
                <option value="nombre1">Nombre 1</option>
                <option value="nombre2">Nombre 2</option>
              </Select>
              <Input placeholder="Por #" type="tel" />
              <Button variant="brand" mt={4}>Buscar</Button>
            </VStack>
          </Card>
        </Box>
      </Grid>
    </Box>
  );
};

export default ManagementPage;
