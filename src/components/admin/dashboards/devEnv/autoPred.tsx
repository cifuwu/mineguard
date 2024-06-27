/* eslint-disable */

  import { Box, Flex, Button, Icon, Table, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue, } from '@chakra-ui/react';
  import { createColumnHelper, flexRender, getCoreRowModel, useReactTable, } from '@tanstack/react-table';
  // Custom components
  import Card from 'components/card/Card';
  import ModalConfiguracion from 'components/admin/dashboards/devEnv/configModal';
  import * as React from 'react';
  // Assets
  import { ImCog } from "react-icons/im";

  type RowObj = {
    name: string;
    fecha: string;
    hora: string;
  };
  
  const columnHelper = createColumnHelper<RowObj>();
  
  // const columns = columnsDataCheck;
  export default function AutoPred(props: { tableData: any }) {
    const { tableData } = props;
    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const textColorSecondary = useColorModeValue('secondaryGray.600', 'white');
    const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
    let defaultData = tableData;

    const convertFrequency = (seconds: number) => {
      console.log(seconds);
      const days = Math.floor(seconds / (24 * 3600));
      //const hours = Math.floor((seconds % (24 * 3600)) / 3600);
      let hours;
      if (seconds < 3600) {
        hours = (seconds/3600).toFixed(2);
      } else {
        hours = Math.floor((seconds % (24 * 3600)) / 3600);
      }
      console.log(hours);
      return { days, hours };
    };

    const formatDate = (isoDate: string) => {
      const date = new Date(isoDate);
      return date.toLocaleDateString('es-ES');
    };
  
    const formatTime = (isoDate: string) => {
      const date = new Date(isoDate);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const { days, hours } = convertFrequency(tableData.frequency);
    const processedData: RowObj[] = [
      {
        name: 'Fecha última predicción',
        fecha: formatDate(tableData.lastPredDate),
        hora: formatTime(tableData.lastPredDate),
      },
      {
        name: 'Fecha siguiente predicción',
        fecha: formatDate(tableData.nextPredDate),
        hora: formatTime(tableData.nextPredDate),
      },
      {
        name: 'Frecuencia',
        fecha: `${days} Días`,
        hora: `${hours} Horas`,
      },
    ];

    const columns = [
      columnHelper.accessor('name', {
        id: 'name',
        header: () => (
          <Text>
          </Text>
        ),
        cell: (info: any) => (
          <Text color={textColor} fontSize="sm" fontWeight="600">
            {info.getValue()}
          </Text>
        ),
      }),
      columnHelper.accessor('fecha', {
        id: 'fecha',
        header: () => (
          <Text
            justifyContent="space-between"
            align="center"
            fontSize={{ sm: '10px', lg: '12px' }}
            color="gray.400"
          >
            Fecha
          </Text>
        ),
        cell: (info) => (
          <Text color={textColor} fontSize="sm" fontWeight="600">
            {info.getValue()}
          </Text>
        ),
      }),
      columnHelper.accessor('hora', {
        id: 'hora',
        header: () => (
          <Text
            justifyContent="space-between"
            align="center"
            fontSize={{ sm: '10px', lg: '12px' }}
            color="gray.400"
          >
            Hora
          </Text>
        ),
        cell: (info) => (
          <Text
          color={textColor}
            fontSize="sm"
            fontWeight="600"
          >
            {info.getValue()}
          </Text>
        ),
      }),
    ];
    const [data, setData] = React.useState(() => [...processedData]);
    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      debugTable: true,
    });

    // Estado para controlar la apertura del modal de configuración
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    // Función para abrir el modal
    const handleOpenModal = () => {
      setIsModalOpen(true);
    };

    // Función para cerrar el modal
    const handleCloseModal = () => {
      setIsModalOpen(false);
    };

    return (
      <Card
        flexDirection="column"
        w="100%"
        px="0px"
        overflowX={{ sm: 'scroll', lg: 'hidden' }}
      >
        <Flex align="center" justify="space-between" w="100%" pl="20px" pr="40px" mb="20px">
          <Text
            color={textColor}
            fontSize="lg"
            fontWeight="700"
            lineHeight="100%"
          >
            Predicciones Automáticas
          </Text>
          <Button
            bg={boxBg}
            fontSize="sm"
            fontWeight="500"
            color={textColorSecondary}
            borderRadius="7px"
            onClick={handleOpenModal}
            >
            <Icon
              as={ImCog}
              color={textColorSecondary}
              me="4px"
            />
            Configurar
          </Button>
        </Flex>
        <Box>
          <Table variant="simple" color="gray.500" mt="12px">
            <Thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <Th
                        key={header.id}
                        colSpan={header.colSpan}
                        pe="10px"
                      >
                        <Flex
                          justifyContent="space-between"
                          align="center"
                          fontSize={{ sm: '10px', lg: '12px' }}
                          color="gray.400"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {{
                            asc: '',
                            desc: '',
                          }[header.column.getIsSorted() as string] ?? null}
                        </Flex>
                      </Th>
                    );
                  })}
                </Tr>
              ))}
            </Thead>
            <Tbody>
              {table
                .getRowModel()
                .rows.slice(0, 11)
                .map((row) => {
                  return (
                    <Tr key={row.id}>
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <Td
                            key={cell.id}
                            fontSize={{ sm: '14px' }}
                            minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                            borderColor="transparent"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </Td>
                        );
                      })}
                    </Tr>
                  );
                })}
            </Tbody>
          </Table>
        </Box>
      <ModalConfiguracion isOpen={isModalOpen} onClose={handleCloseModal} />
      </Card>
    );
  }
  