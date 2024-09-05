'use client';

import React from 'react';
import { useState } from 'react';
import Cookies from 'js-cookie';
// Chakra imports
import {
  Box,
  Button,
  IconButton,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  useColorModeValue,
  Text,
  Badge,
  useToast
} from '@chakra-ui/react';
import { SearchIcon  } from '@chakra-ui/icons'
// Assets
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';

// Custom components
import { HSeparator } from 'components/separator/Separator';
import CenteredAuth from 'components/auth/variants/CenteredAuthLayout/page';
import NavLink from 'components/link/NavLink';
import { set } from 'date-fns';

const ENDPOINT = process.env.NEXT_PUBLIC_ENDPOINT;

function SignIn() {
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

  const [usernameToFind, setUsernameToFind] = useState('');
  const [username, setUsername] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const questions = ["¿En qué ciudad naciste?", "¿Cuál fue el nombre de tu primera mascota?", "¿Cuál fue el nombre de tu primer amor?"];

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

  const handleIconClick = () => {

    const requestBody = {
      query: `
        query Query {
          getQuestion(username: "${usernameToFind}")
        }
      `
    };
  
    // Fetch getQuestion
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
        }
        if (data && data.data && data.data.getQuestion) {
          setQuestion(questions[parseInt(data.data.getQuestion)-1])
          setUsername(usernameToFind);
        } else {setQuestion('')}
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  const handleSubmit = () => {

    if (!username || !answer || !newPassword) {
      setErrorMsg("Introduce tu usuario, la respuesta y la contraseña nueva");
      setError(true);
      return;
    }

    if (!isValidPassword(newPassword)) {
      setErrorMsg('Contraseña inválida')
      setError(true);
      return;
    }

    const requestBody = {
      query: `
        mutation Mutation {
          changePassword(username: "${username}", answer: "${answer}", newPassword: "${newPassword}")
        }
      `
    };
  
    // Fetch changePassword
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

          if (data.errors[0].message.charAt(0) === '2') {
            setErrorMsg('Respuesta incorrecta');
            setError(true);
            return;
          } else {setError(false)}
        }
        if (data && data.data && data.data.changePassword) {
          console.log(data.data.changePassword);
          toast({
            title: 'Contraseña restablecida.',
            description: "Has restablecido tu contraseña con éxito!",
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
      cardBottom={{ base: '50px', lg: 'auto' }}
    >
      <Flex
        maxW={{ base: '100%', md: 'max-content' }}
        w="100%"
        mx={{ base: 'auto', lg: '0px' }}
        me="auto"
        justifyContent="center"
        px={{ base: '20px', md: '0px' }}
        flexDirection="column"
      >
        <Box me="auto">
          <Heading color={textColor} fontSize="36px" mb="10px">
            Restablecer contraseña
          </Heading>
          <Text
            mb="24px"
            ms="4px"
            color={textColorSecondary}
            fontWeight="400"
            fontSize="md"
          >
            Ingresa tu usuario y responde la pregunta secreta
          </Text>
        </Box>
        <Text
          color={alertColor}
          fontWeight="400"
          fontSize="lg"
          mb="4px"
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
            <FormLabel
              display="flex"
              ms="4px"
              fontSize="sm"
              fontWeight="500"
              color={textColor}
              mb="8px"
            >
              Nombre de usuario
            </FormLabel>
            <InputGroup size="lg" mb="24px" variant="auth">
              <Input
                fontSize="sm"
                fontWeight="500"
                isRequired={true}
                ms={{ base: '0px', md: '0px' }}
                type="text"
                placeholder="Pablo.contreras98"
                value={usernameToFind}
                onChange={(e) => {setUsernameToFind(e.target.value)}}
              />
              <InputRightElement>
                <IconButton
                  colorScheme='brand'
                  aria-label='Search database'
                  icon={<SearchIcon />}
                  onClick={handleIconClick}
                />
              </InputRightElement>
            </InputGroup>
            <Badge 
              w='100%' 
              textAlign="center" 
              variant="solid" 
              mb='24px'
              fontSize='0.8em'
            >
              {question ? question : "Ingresa tu usuario y haz click a la lupa"}
            </Badge>
            <FormLabel
              display="flex"
              ms="4px"
              fontSize="sm"
              fontWeight="500"
              color={textColor}
              mb="8px"
            >
              Respuesta
            </FormLabel>
            <Input
              size="lg" 
              mb="24px" 
              fontWeight="500" 
              fontSize="sm" 
              variant="auth"
              isRequired={true}
              ms={{ base: '0px', md: '0px' }}
              type="text"
              placeholder="Pablo.contreras98"
              isDisabled={question ? false : true}
              value={answer}
              onChange={(e) => {setAnswer(e.target.value)}}
            />
            <FormLabel
              ms="4px"
              fontSize="sm"
              fontWeight="500"
              color={textColor}
              display="flex"
            >
              Nueva contraseña
            </FormLabel>
            <InputGroup size="md">
              <Input
                isRequired={true}
                fontSize="sm"
                ms={{ base: '0px', md: '4px' }}
                placeholder="Min. 8 characters"
                size="lg"
                type={show ? 'text' : 'password'}
                variant="auth"
                isDisabled={question ? false : true}
                value={newPassword}
                onChange={(e) => {setNewPassword(e.target.value)}}
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
            <Text
              mb="24px"
              mt="2px"
              ms="4px"
              color={textColorSecondary}
              fontWeight="400"
              fontSize="sm"
            >
              La contraseña requiere 8 caracteres, una mayúscula y un número.
            </Text>
            <Button
              fontSize="sm"
              variant="brand"
              fontWeight="500"
              w="100%"
              h="50"
              mb="24px"
              onClick={handleSubmit}
            >
              Cambiar contraseña
            </Button>
          </FormControl>
          <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="start"
            maxW="100%"
            mt="0px"
          >
            <Text color={textColorDetails} fontWeight="400" fontSize="14px">
              ¿Has recordado?
              <NavLink href="/login">
                <Text
                  color={textColorBrand}
                  as="span"
                  ms="5px"
                  fontWeight="500"
                >
                  Inicia sesión
                </Text>
              </NavLink>
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </CenteredAuth>
  );
}

export default SignIn;
