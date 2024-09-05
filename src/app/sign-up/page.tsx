'use client';

import React from 'react';
import { useState } from 'react';

// Chakra imports
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Text,
  useColorModeValue,
  Select,
  useToast
} from '@chakra-ui/react';
import Link from 'components/link/Link';

// Custom components
import { HSeparator } from 'components/separator/Separator';
import CenteredAuth from 'components/auth/variants/CenteredAuthLayout/page';

// Assets
import { FcGoogle } from 'react-icons/fc';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';

const ENDPOINT = process.env.NEXT_PUBLIC_ENDPOINT;

function SignUp() {
  // Chakra color mode
  const alertColor = 'red.500';
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = 'gray.400';
  const textColorDetails = useColorModeValue('navy.700', 'secondaryGray.600');
  const textColorBrand = useColorModeValue('brand.500', 'white');
  const brandStars = useColorModeValue('brand.500', 'brand.400');
  
  const toast = useToast();
  
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isValidPassword = (value: string) => {
    const minLength = value.length >= 8;
    const hasNumber = /\d/.test(value);
    const hasUppercase = /[A-Z]/.test(value);

    if (!minLength || !hasNumber || !hasUppercase) {
      setErrorMsg('Contraseña inválida.');
    } else {
      setErrorMsg('');
      return true;
    }

    return false;
  };

  const handleSubmit = () => {
    
    if (!firstname || !lastname || !username || !password || !question || !answer) {
      setErrorMsg("Todos los campos deben estar llenos");
      setError(true);
      return;
    }

    const fullname = firstname + ' ' + lastname;

    if (!isValidPassword(password)) {
      setErrorMsg('Contraseña inválida')
      setError(true);
      return;
    }

    const requestBody = {
      query: `
        mutation Register($data: RegisterData) {
          register(data: $data)
          }
      `,
      variables: {
        data: {
          name: fullname,
          username: username,
          password: password,
          userType: "user",
          question: question,
          answer: answer
        },
      },
    };
  
    // Fetch Register
    fetch(ENDPOINT, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.errors) {
          console.error("Error:", data.errors[0].message);
          if (data.errors[0].message.charAt(0) === '1') {
            setErrorMsg('Nombre de usuario ocupado');
            setError(true);
            return;
          } else {setError(false)}
        }
        if (data && data.data && data.data.register) {
          console.log(data.data.register);
          toast({
            title: 'Cuenta creada.',
            description: "Has creado tu cuenta con éxito!",
            status: 'success',
            duration: 9000,
            isClosable: true,
          })
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };
  
  return (
    <CenteredAuth
      cardTop={{ base: '140px', md: '14vh' }}
      cardBottom={{ base: '50px', lg: '100px' }}
    >
      <Flex
        maxW="max-content"
        mx={{ base: 'auto', lg: '0px' }}
        me="auto"
        justifyContent="center"
        px={{ base: '20px', md: '0px' }}
        flexDirection="column"
      >
        <Box me="auto">
          <Heading
            color={textColor}
            fontSize={{ base: '34px', lg: '36px' }}
            mb="10px"
          >
            Crear cuenta
          </Heading>
          <Text
            mb="24px"
            ms="4px"
            color={textColorSecondary}
            fontWeight="400"
            fontSize="md"
          >
            Ingresa tu usuario y contraseña para crear una cuenta!
          </Text>
        </Box>
        <Text
          color={alertColor}
          fontWeight="400"
          fontSize="md"
          ms="4px"
          display={error ? "flex" : "none"}
        >
          {errorMsg}
        </Text>
        <Flex
          zIndex="2"
          direction="column"
          w={{ base: '100%', md: '420px' }}
          maxW="100%"
          background="transparent"
          borderRadius="15px"
          mx={{ base: 'auto', lg: 'unset' }}
          me="auto"
          mb={{ base: '20px', md: 'auto' }}
        >
          <FormControl>
            <SimpleGrid
              columns={{ base: 1, md: 2 }}
              gap={{ sm: '10px', md: '26px' }}
            >
              <Flex direction="column">
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  color={textColor}
                  mb="8px"
                >
                Nombre<Text color={brandStars}>*</Text>
                </FormLabel>
                <Input
                  isRequired={true}
                  fontSize="sm"
                  ms={{ base: '0px', md: '4px' }}
                  placeholder="First name"
                  variant="auth"
                  mb="24px"
                  size="lg"
                  value={firstname}
                  onChange={(e) => {setFirstname(e.target.value)}}
                />
              </Flex>
              <Flex direction="column">
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  color={textColor}
                  mb="8px"
                >
                  Apellido<Text color={brandStars}>*</Text>
                </FormLabel>
                <Input
                  isRequired={true}
                  variant="auth"
                  fontSize="sm"
                  placeholder="Last name"
                  mb="24px"
                  size="lg"
                  value={lastname}
                  onChange={(e) => {setLastname(e.target.value)}}
                />
              </Flex>
            </SimpleGrid>
            <SimpleGrid
              columns={{ base: 1, md: 2 }}
              gap={{ sm: '10px', md: '26px' }}
            >
              <Flex direction="column">
                
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  color={textColor}
                  mb="8px"
                >
                  Nombre de usuario<Text color={brandStars}>*</Text>
                </FormLabel>
                <Input
                  isRequired={true}
                  variant="auth"
                  fontSize="sm"
                  type="text"
                  placeholder="Pablo.contreras98"
                  size="lg"
                  value={username}
                  onChange={(e) => {setUsername(e.target.value)}}
                />
              </Flex>
              <Flex direction="column">
                <FormLabel
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  color={textColor}
                  display="flex"
                >
                  Contraseña<Text color={brandStars}>*</Text>
                </FormLabel>
                <InputGroup size="md">
                  <Input
                    isRequired={true}
                    variant="auth"
                    fontSize="sm"
                    ms={{ base: '0px', md: '4px' }}
                    placeholder="Min. 8 characters"
                    //mb="24px"
                    size="lg"
                    type={show ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {setPassword(e.target.value)}}
                  />
                  <InputRightElement display="flex" alignItems="center" mt="4px">
                    <Icon
                      color={textColorSecondary}
                      _hover={{ cursor: 'pointer' }}
                      as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                      onClick={handleClick}
                    />
                  </InputRightElement>
                </InputGroup>
              </Flex>
            </SimpleGrid>
            <Text
              mb="24px"
              ms="4px"
              color={textColorSecondary}
              fontWeight="400"
              fontSize="sm"
            >
              La contraseña requiere 8 caracteres, una mayúscula y un número.
            </Text>
            <SimpleGrid
              columns={{ base: 1, md: 2 }}
              gap={{ sm: '10px', md: '26px' }}
            >
              <Flex direction="column">
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  color={textColor}
                  mb="8px"
                >
                  Pregunta secreta<Text color={brandStars}>*</Text>
                </FormLabel>
                <Select value={question} onChange={(e) => {setQuestion(e.target.value)}} 
                  size="lg" 
                  fontSize="sm" 
                  fontWeight="500" 
                  variant="auth" 
                  mb="24px" 
                >
                  <option value=''>Seleccionar</option>
                  <option value='1'>¿En qué ciudad naciste?</option>
                  <option value='2'>¿Cuál fue el nombre de tu primera mascota?</option>
                  <option value='3'>¿Cuál fue el nombre de tu primer amor?</option>
                </Select>
              </Flex>
              <Flex direction="column">
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
              >
                Respuesta<Text color={brandStars}>*</Text>
              </FormLabel>
                <Input
                  isRequired={true}
                  variant="auth"
                  fontSize="sm"
                  type="text"
                  placeholder="Respuesta"
                  size="lg"
                  value={answer}
                  onChange={(e) => {setAnswer(e.target.value)}}
                />
              </Flex>
            </SimpleGrid>
            <Button
              variant="brand"
              fontSize="14px"
              fontWeight="500"
              w="100%"
              h="50"
              mb="24px"
              onClick={handleSubmit}
            >
              Crea tu cuenta
            </Button>
          </FormControl>
          <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="start"
            maxW="100%"
            mt="0px"
          >
            <Text color={textColorDetails} fontWeight="400" fontSize="sm">
              ¿Ya estás registrado?
              <Link href="/login">
                <Text
                  color={textColorBrand}
                  as="span"
                  ms="5px"
                  fontWeight="500"
                >
                  Inicia sesión
                </Text>
              </Link>
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </CenteredAuth>
  );
}

export default SignUp;
