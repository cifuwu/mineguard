'use client';
/* eslint-disable */

// chakra imports
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  HStack,
  Text,
  List,
  Icon,
  ListItem,
  useColorModeValue,
} from '@chakra-ui/react';
// Assets
import { FaCircle } from 'react-icons/fa';
import NavLink from 'components/link/NavLink';
import { IRoute } from 'types/navigation';
import { PropsWithChildren, useCallback, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export function SidebarLinks(props: { routes: IRoute[]; [x: string]: any }) {
  const router = useRouter();
  const pathname = usePathname();
  //   Chakra color mode
  let activeColor = useColorModeValue('gray.700', 'white');
  let inactiveColor = useColorModeValue(
    'secondaryGray.600',
    'secondaryGray.600',
  );
  let activeIcon = useColorModeValue('brand.500', 'white');

  const { routes, hovered, mini } = props;

  // verifies if routeName is the one active (in browser input)
  const activeRoute = useCallback(
    (routeName: string) => {
      return pathname?.includes(routeName);
    },
    [pathname],
  );

  useEffect(()=>{
    router.prefetch('/home');
    router.prefetch('/maintenance');
    router.prefetch('/manualprediction');
    router.prefetch('/monitorizacion');
    router.prefetch('/generate');
    router.prefetch('/reports');
    router.prefetch('/compare');
    router.prefetch('/management');
    router.prefetch('/alerts');
  },[])

  const handleAccordionClick = (event, route) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Aquí puedes ejecutar la función personalizada que deseas al hacer clic
    if (route.name === 'Home') {
      router.push('/home');
    }
    if (route.name === 'Mantenciones') {
      router.push('/maintenance');
    }
    if (route.name === 'Predicción Manual') {
      router.push('/manualprediction');
    }
    if (route.name === 'Monitorización') {
      router.push('/monitorizacion');
    }
    if (route.name === 'Generar Reporte') {
      router.push('/generate');
    }
    if (route.name === 'Reportes') {
      router.push('/reports');
    }
    if (route.name === 'Comparar') {
      router.push('/compare');
    }
    if (route.name === 'Gestión') {
      router.push('/management');
    }
    if (route.name === 'Alertas') {
      router.push('/alerts');
    }
  };

  // this function creates the links and collapses that appear in the sidebar (left menu)
  const createLinks = (routes: IRoute[]) => {
    return routes.map((route, key) => {
      if (route.collapse) {
        return (
          <Accordion allowToggle key={key}>
            <AccordionItem maxW="100%" border="none" key={key}>
              <AccordionButton
                display="flex"
                alignItems="center"
                justifyContent="center"
                _hover={{
                  bg: 'unset',
                }}
                _focus={{
                  boxShadow: 'none',
                }}
                borderRadius="8px"
                w={{
                  sm: '100%',
                  xl: '100%',
                  '2xl': '95%',
                }}
                px={route.icon ? null : '0px'}
                py="0px"
                bg={'transparent'}
                ms={0}
                onClick={(event) => handleAccordionClick(event, route)}
              >
                {route.icon ? (
                  <Flex
                    align="center"
                    justifyContent={
                      mini === false
                        ? 'space-between'
                        : mini === true && hovered === true
                        ? 'space-between'
                        : 'center'
                    }
                    w="100%"
                  >
                    <HStack
                      mb="6px"
                      spacing={
                        activeRoute(route.path.toLowerCase()) ? '22px' : '26px'
                      }
                    >
                      <Flex
                        w="100%"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Box // Iconos
                          color={
                            activeRoute(route.path.toLowerCase())
                              ? activeIcon
                              : inactiveColor
                          }
                          me={
                            mini === false
                              ? '12px'
                              : mini === true && hovered === true
                              ? '12px'
                              : '0px'
                          }
                          mt="6px"
                        >
                          {route.icon}
                        </Box>
                        <Text // Nombre de ruta
                          display={
                            mini === false
                              ? 'block'
                              : mini === true && hovered === true
                              ? 'block'
                              : 'none'
                          }
                          me="auto"
                          color={
                            activeRoute(route.path.toLowerCase())
                              ? activeColor
                              : 'secondaryGray.600'
                          }
                          fontWeight="500"
                          fontSize="md"
                          whiteSpace="nowrap"
                        >
                          {route.name}
                        </Text>
                      </Flex>
                    </HStack>
                    {/*
                    <AccordionIcon
                      display={
                        mini === false
                          ? 'block'
                          : mini === true && hovered === true
                          ? 'block'
                          : 'none'
                      }
                      ms="auto"
                      color={'secondaryGray.600'}
                      transform={route.icon ? null : 'translateX(-70%)'}
                    />
                    */}
                  </Flex>
                ) : (
                  <Flex
                    pt="0px"
                    pb="10px"
                    justify={'center'}
                    alignItems="center"
                    w="100%"
                  >
                    <HStack
                      spacing={
                        activeRoute(route.path.toLowerCase()) ? '22px' : '26px'
                      }
                      ps={
                        mini === false
                          ? '34px'
                          : mini === true && hovered === true
                          ? '34px'
                          : '0px'
                      }
                    >
                      <Text
                        me="auto"
                        color={
                          activeRoute(route.path.toLowerCase())
                            ? activeColor
                            : inactiveColor
                        }
                        fontWeight="500"
                        fontSize="sm"
                      >
                        {mini === false
                          ? route.name
                          : mini === true && hovered === true
                          ? route.name
                          : route.name[0]}
                      </Text>
                    </HStack>
                    <AccordionIcon
                      display={
                        mini === false
                          ? 'block'
                          : mini === true && hovered === true
                          ? 'block'
                          : 'none'
                      }
                      ms="auto"
                      color={'secondaryGray.600'}
                      transform={null}
                    />
                  </Flex>
                )}
              </AccordionButton>
              <AccordionPanel
                display={
                  mini === false
                    ? 'block'
                    : mini === true && hovered === true
                    ? 'block'
                    : 'flex'
                }
                justifyContent="center"
                alignItems="center"
                flexDirection={'column'}
                // bg="blue"
                pe={route.icon ? '14px !important' : '0px'}
                py="0px"
                ps={route.icon ? '14px !important' : '8px'}
              >
                <List>
                  {
                    route.icon
                      ? createLinks(route.items) // for bullet accordion links
                      : createAccordionLinks(route.items) // for non-bullet accordion links
                  }
                </List>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        );
      } else {
        return (
          <NavLink href={route.layout + route.path} key={key}>
            {route.icon ? (
              <Flex
                align="center"
                justifyContent="space-between"
                w="100%"
                ps="17px"
                mb="0px"
              >
                <HStack
                  mb="6px"
                  spacing={
                    activeRoute(route.path.toLowerCase()) ? '22px' : '26px'
                  }
                >
                  <Flex w="100%" alignItems="center" justifyContent="center">
                    <Box
                      color={
                        activeRoute(route.path.toLowerCase())
                          ? activeIcon
                          : inactiveColor
                      }
                      me="12px"
                      mt="6px"
                    >
                      {route.icon}
                    </Box>
                    <Text
                      me="auto"
                      color={
                        activeRoute(route.path.toLowerCase())
                          ? activeColor
                          : 'secondaryGray.600'
                      }
                      fontWeight="500"
                    >
                      {mini === false
                        ? route.name
                        : mini === true && hovered === true
                        ? route.name
                        : route.name[0]}
                    </Text>
                  </Flex>
                </HStack>
              </Flex>
            ) : (
              <ListItem ms={null}>
                <Flex
                  ps={
                    mini === false
                      ? '34px'
                      : mini === true && hovered === true
                      ? '34px'
                      : '0px'
                  }
                  alignItems="center"
                  mb="8px"
                >
                  <Text
                    color={
                      activeRoute(route.path.toLowerCase())
                        ? activeColor
                        : inactiveColor
                    }
                    fontWeight="500"
                    fontSize="sm"
                  >
                    {mini === false
                      ? route.name
                      : mini === true && hovered === true
                      ? route.name
                      : route.name[0]}
                  </Text>
                </Flex>
              </ListItem>
            )}
          </NavLink>
        );
      }
    });
  };
  // this function creates the links from the secondary accordions (for example auth -> sign-in -> default)
  const createAccordionLinks = (routes: IRoute[]) => {
    return routes.map((route: IRoute, key: number) => {
      return (
        <NavLink href={route.layout + route.path} key={key}>
          <ListItem
            ms={
              mini === false
                ? '28px'
                : mini === true && hovered === true
                ? '28px'
                : '0px'
            }
            display="flex"
            alignItems="center"
            mb="10px"
            key={key}
          >
            <Icon w="6px" h="6px" me="8px" as={FaCircle} color={activeIcon} />
            <Text
              // display={
              //   mini === false
              //     ? 'block'
              //     : mini === true && hovered === true
              //     ? 'block'
              //     : 'none'
              // }
              color={
                activeRoute(route.path.toLowerCase())
                  ? activeColor
                  : inactiveColor
              }
              fontWeight={
                activeRoute(route.path.toLowerCase()) ? 'bold' : 'normal'
              }
              fontSize="sm"
            >
              {mini === false
                ? route.name
                : mini === true && hovered === true
                ? route.name
                : route.name[0]}
            </Text>
          </ListItem>
        </NavLink>
      );
    });
  };
  //  BRAND
  return <>{createLinks(routes)}</>;
}

export default SidebarLinks;
