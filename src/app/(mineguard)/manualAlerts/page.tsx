'use client'

import React, { useState, useEffect } from 'react';
import { Box, Text, Button, Textarea, Select, VStack, Alert, AlertIcon, useToast } from "@chakra-ui/react";
import Card from "components/card/Card";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

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

const ManualALertsPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toast = useToast();

  const [uniqueSeries, setUniqueSeries] = useState([]);

  const [serie, setSerie] = useState(searchParams.get("serie") || '');
  const [correctiveAction, setCorrectiveAction] = useState('');
  const [state, setState] = useState('');

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
            setUniqueSeries([... new Set(data.data.getTrucksResults.map(truck => truck.serie))]);
          }
        })
        .catch((error) => {
          console.error("Error fetching trucks information:", error);
        });
    }, []);

  const handleBack = () => {
    router.push('/alerts');
  }

  const handleSend = () => {
    if (!serie || !correctiveAction || !state) {
      setAlertMessage('Por favor, rellena todos los campos enviar una alerta.');
      return;
    }
    setAlertMessage('');
    console.log(serie, correctiveAction, state);

    const requestBodySendManualAlert = {
      query: `
        mutation SendManualAlert($alert: ManualAlert) {
          sendManualAlert(alert: $alert)
        }
      `,
      variables: {
        "alert": {
          "correctiveAction": correctiveAction,
          "defaultState": state,
          "serie": serie
        }
      }
    };

    fetch(ENDPOINT, {
      method: "POST",
      body: JSON.stringify(requestBodySendManualAlert),
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
        if (data && data.data && data.data.sendManualAlert) {
          console.log("Alerta creada exitosamente:", data.data.sendManualAlert);
          toast({
            title: 'Alerta creada exitosamente.',
            description: `Se ha creado una alerta para el camión con serie ${serie}`,
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

  }

  return (
    <Box paddingX={{md: '0', lg: '12%', xl: '15%' }}>
      <Card mt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>Generar Alerta Manual</Text>
      {alertMessage && (
        <Alert status="warning" mb={4}>
          <AlertIcon />
          {alertMessage}
        </Alert>
      )}
        <VStack align="stretch" spacing={4}>
          <Select placeholder="Serie" value={serie} onChange={(e) => setSerie(e.target.value)}>
            {uniqueSeries.map((serie, index) => (
              <option key={`${serie}${index}`} value={serie}>{serie}</option>
            ))}
          </Select>
          <Textarea 
            placeholder="Acción Correctiva" 
            h='150px'
            value={correctiveAction}
            onChange={(e) => setCorrectiveAction(e.target.value)} />
          <Select placeholder="Estado" value={state} onChange={(e) => setState(e.target.value)}>
            <option value="Resuelto">Resuelto</option>
            <option value="Leido">Leído</option>
            <option value="NoLeido">No Leído</option>
          </Select>
          <Box display="flex" justifyContent="space-between" mt={4}>
            <Button colorScheme="red" onClick={handleBack}>Atrás</Button>
            <Button variant="brand" onClick={handleSend}>Enviar</Button>
          </Box>
        </VStack>
      </Card>
    </Box>
  )
}

export default ManualALertsPage;