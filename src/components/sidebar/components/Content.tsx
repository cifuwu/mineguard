'use client'
// chakra imports
import {
  Avatar,
  Box,
  Flex,
  Stack,
  Text,
  useColorModeValue,
  Button,
  Icon
} from '@chakra-ui/react';
//   Custom components
import Brand from 'components/sidebar/components/Brand';
import Links from 'components/sidebar/components/Links';
import SidebarCard from 'components/sidebar/components/SidebarCard';
import avatar4 from '/public/img/avatars/avatar4.png';
import { IRoute } from 'types/navigation';
import { FiLogOut } from 'react-icons/fi';
import Cookie from 'js-cookie'

// FUNCTIONS

function SidebarContent(props: {
  routes: IRoute[];
  hovered?: boolean;
  mini?: boolean;
}) {
  const { routes, mini, hovered } = props;
  const textColor = useColorModeValue('navy.700', 'white');

  const handleClick = () => {
    Cookie.remove('accessJWT');
    window.location.href = '/login';
  }

  // SIDEBAR
  return (
    <Flex direction="column" height="100%" pt="25px" borderRadius="30px">
      <Brand mini={mini} hovered={hovered} />
      <Stack direction="column" mb="auto" mt="8px">
        <Box
          ps={
            mini === false
              ? '20px'
              : mini === true && hovered === true
              ? '20px'
              : '16px'
          }
          pe={{ md: '16px', '2xl': '1px' }}
          ms={mini && hovered === false ? '-16px' : 'unset'}
        >
          <Links mini={mini} hovered={hovered} routes={routes} />
        </Box>
      </Stack>
      {/*

      */}
      <Flex
        ps="20px"
        pe={{ md: '20px', '2xl': '20px' }}
        mt="60px"
        borderRadius="30px"
        justifyContent={'center'}
        alignItems="center"
      >
        {/*<SidebarCard mini={mini} hovered={hovered} />*/}
      </Flex>
      <Flex mt="75px" mb="56px" justifyContent="center" alignItems="center">
        {/*
        <Avatar
          h="48px"
          w="48px"
          src={avatar4.src}
          me={
            mini === false
              ? '20px'
              : mini === true && hovered === true
              ? '20px'
              : '0px'
          }
        />
        <Box
          display={
            mini === false
              ? 'block'
              : mini === true && hovered === true
              ? 'block'
              : 'none'
          }
        >
          <Text color={textColor} fontSize="md" fontWeight="700">
            Adela Parkson
          </Text>
          <Text color="secondaryGray.600" fontSize="sm" fontWeight="400">
            Product Designer
          </Text>
        </Box>
        */}
        <Button
          borderRadius="16px"
          minW="70%"
          h="44px"
          variant="brand"
          color="white"
          fontSize="sm"
          fontWeight="500"
          _hover={{ bg: 'brand.600' }}
          _active={{ bg: 'brand.500' }}
          _focus={{ bg: 'brand.500' }}
          onClick={handleClick}
        >
          <Icon w="22px" h="22px" me="4px" as={FiLogOut} color="white" />
          {mini ? "" : "Cerrar sesión"}
        </Button>
      </Flex>
    </Flex>
  );
}

export default SidebarContent;
