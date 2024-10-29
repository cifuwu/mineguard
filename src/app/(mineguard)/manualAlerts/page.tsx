'use client'

import React, { useState } from 'react';
import { Box, Button, Textarea, Select, VStack } from "@chakra-ui/react";
import Card from "components/card/Card";
import { usePathname, useRouter } from 'next/navigation';

const ManualALertsPage = () => {
  const router = useRouter();
  const [serie, setSerie] = useState('');
  const [correctiveAction, setCorrectiveAction] = useState('');
  const [state, setState] = useState('');

  const handleBack = () => {
    router.push('/alerts');
  }

  const handleSend = () => {
    console.log(serie, correctiveAction, state);
  }

  return (
    <Box paddingX={{md: '0', lg: '12%', xl: '15%' }}>
      <Card mt={{ base: '130px', md: '80px', xl: '80px' }}>
        <VStack align="stretch" spacing={4}>
          <Select placeholder="Serie" value={serie} onChange={(e) => setSerie(e.target.value)}>
            <option value="serie1">Serie 1</option>
            <option value="serie2">Serie 2</option>
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