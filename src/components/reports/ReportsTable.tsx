'use client'
/* eslint-disable */

import Cookies from 'js-cookie';
import {
  Badge,
  Button,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Icon,
  Stack,
  
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  UnorderedList,
  ListItem
} from '@chakra-ui/react';
// Custom components
import { MdChevronRight, MdChevronLeft } from 'react-icons/md';
import * as React from 'react'
import { useEffect } from 'react';
// Assets
import { SearchBar } from 'components/navbar/searchBar/SearchBar';

import {
  PaginationState,
  createColumnHelper,
  useReactTable,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';

import { MdDelete, MdDownload } from "react-icons/md";
import { HiDocumentDuplicate } from "react-icons/hi";

const ENDPOINT = process.env.NEXT_PUBLIC_ENDPOINT;

type TruckConfig = {
  serie: string;
  includeAlerts: boolean;
  alerts: string[];
  includeVarHistory: boolean;
  varList: string[];
};

type DriverConfig = {
  name: string;
  lastname: string;
  includeAlerts: boolean;
  alerts: string[];
  includeActivityHistory: boolean;
};

type Config = {
  from: string;
  to: string;
  includeTrucks: boolean;
  trucks: TruckConfig[];
  includeDrivers: boolean;
  drivers: DriverConfig[];
  includeCsv: boolean;
};

type RowObj = {
  _id: string;
  generated: string;
  author: string;
  config: Config; // Aquí ahora reflejamos la estructura completa del campo config
  status: string;
  download: string;
  actions: string;
};

export default function ReportsTable(props: { tableData: RowObj[] }) {
    const { tableData } = props;
    const textColor = useColorModeValue('navy.700', 'white');
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
    const brandColor = useColorModeValue('brand.500', 'brand.400');

    const [isModalOpen, setModalOpen] = React.useState(false);
    const [selectedConfig, setSelectedConfig] = React.useState<Config | null>(null);

    const accessToken = Cookies.get("accessJWT");

    const handleShowConfig = (config: Config) => {
      setSelectedConfig(config);
      setModalOpen(true);
    };

    const handleCloseModal = () => {
      setModalOpen(false);
      setSelectedConfig(null);
    };

    const [data, setData] = React.useState<RowObj[]>([]);
  
    useEffect(() => {
        setData(tableData);
    }, [tableData]);

    const handleDelete = ( id ) => {
      
      const requestBody = {
        query: `
          mutation DeleteReport($id: String) {
            deleteReport(_id: $id)
          }
        `,
        variables: {
          "id": id
        }
      };
      
      // fetch DeleteReport
      fetch(ENDPOINT, {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.errors) {
            console.error("Error:", data.errors[0].message);
          }
          if (data && data.data && data.data.deleteReport) {
            console.log("Reporte borrado exitosamente:", data.data.deleteReport);
            
            setData((prevTableData) =>
              prevTableData.filter((report) => report._id !== id)
            );
          }
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    }

    const handleDuplicate = ( config ) => {
      console.log(config);
    }

    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    //let defaultData = tableData;
    const [globalFilter, setGlobalFilter] = React.useState('');
    const columnHelper = createColumnHelper<RowObj>();
    const columns = [
        columnHelper.accessor('generated', {
            id: 'generated',
            header: () => (
                <Text
                    justifyContent="space-between"
                    align="center"
                    fontSize={{ sm: '10px', lg: '12px' }}
                    color="gray.400"
                >
                    Generado
                </Text>
            ),
            cell: (info: any) => (
                <Text color={textColor} fontSize="md" fontWeight="500">
                    {new Date( parseInt(info.getValue()) ).toLocaleString()}
                </Text>
            ),
        }),
        columnHelper.accessor('author', {
            id: 'author',
            header: () => (
                <Text
                    justifyContent="space-between"
                    align="center"
                    fontSize={{ sm: '10px', lg: '12px' }}
                    color="gray.400"
                >
                    Autor
                </Text>
            ),
            cell: (info) => (
                <Text color={textColor} fontSize="md" fontWeight="500">
                    {info.getValue()}
                </Text>
            ),
        }),
        columnHelper.accessor('config', {
            id: 'config',
            header: () => (
                <Text
                    justifyContent="space-between"
                    align="center"
                    fontSize={{ sm: '10px', lg: '12px' }}
                    color="gray.400"
                >
                    Configuración
                </Text>
            ),
            cell: (info) => (
              <Button 
              borderRadius="16px"
              h="32px"
              variant="brand"
              color="white"
              fontSize="sm"
              fontWeight="500"
              _hover={{ bg: 'brand.600' }}
              _active={{ bg: 'brand.500' }}
              _focus={{ bg: 'brand.500' }}
              onClick={() => handleShowConfig(info.getValue())}>
                Mostrar
              </Button>
            ),
        }),
        columnHelper.accessor('status', {
            id: 'status',
            header: () => (
                <Text
                    justifyContent="space-between"
                    align="center"
                    fontSize={{ sm: '10px', lg: '12px' }}
                    color="gray.400"
                >
                    Estado
                </Text>
            ),
            cell: (info) => (
                <Text color={textColor} fontSize="md" fontWeight="500">
                    {info.getValue()}
                </Text>
            ),
        }),
        columnHelper.accessor('download', {
            id: 'download',
            header: () => (
                <Text
                    justifyContent="space-between"
                    align="center"
                    fontSize={{ sm: '10px', lg: '12px' }}
                    color="gray.400"
                >
                    Descarga
                </Text>
            ),
            cell: (info) => (
              <Button isDisabled={info.row.getValue('status') !== 'Listo' ? true : false} p={0}>
                <Icon
                  as={MdDownload}
                  w={8}
                  h={8}
                  color='brand.500'
                />
              </Button>
            ),
        }),
        columnHelper.accessor('actions', {
            id: 'actions',
            header: () => (
                <Text
                    justifyContent="space-between"
                    align="center"
                    fontSize={{ sm: '10px', lg: '12px' }}
                    color="gray.400"
                >
                    Acciones
                </Text>
            ),
            cell: (info) => (
              <>
                <Button onClick={() => handleDuplicate(info.row.original.config)} p={0}>
                  <Icon
                    as={HiDocumentDuplicate}
                    w={8}
                    h={8}
                    color='brand.500'
                  />
                </Button>
                <Button onClick={() => handleDelete(info.row.original._id)} p={0}>
                  <Icon
                    as={MdDelete}
                    w={8}
                    h={8}
                    color='red'
                  />
                </Button>
              </>
            ),
        }),
    ];
    //const [data, setData] = React.useState(() => [...defaultData]);
    const [{ pageIndex, pageSize }, setPagination] =
        React.useState<PaginationState>({
            pageIndex: 0,
            pageSize: 6,
        });

    const pagination = React.useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize]
    );
    const table = useReactTable({
        data,
        columns,
        state: {
            columnFilters,
            globalFilter,
            pagination,
        },
        onPaginationChange: setPagination,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        debugTable: true,
        debugHeaders: true,
        debugColumns: false,
    });
    const createPages = (count: number) => {
        let arrPageCount = [];

        for (let i = 1; i <= count; i++) {
            arrPageCount.push(i);
        }

        return arrPageCount;
    };

    React.useEffect(() => {
        console.log(table.getState());
        if (table.getState().columnFilters[0]?.id === 'fullName') {
            if (table.getState().sorting[0]?.id !== 'fullName') {
                table.setSorting([{ id: 'fullName', desc: false }]);
            }
        }
    }, [table.getState().columnFilters[0]?.id]);

    return (
        <>
          <Flex
              direction="column"
              w="100%"
              overflowX={{ sm: 'scroll', lg: 'auto', }}
          >
              <Flex
                  align={{ sm: 'flex-start', lg: 'flex-start' }}
                  justify={{ sm: 'flex-start', lg: 'flex-start' }}
                  w="100%"
                  px="22px"
                  mb="36px"
              >
                  <DebouncedInput
                      value={globalFilter ?? ''}
                      onChange={(value) => setGlobalFilter(String(value))}
                      className="p-2 font-lg shadow border border-block"
                      placeholder="Search..."
                  />
              </Flex>
              <Table variant="simple" color="gray.500" mb="24px">
                  <Thead>
                      {table.getHeaderGroups().map((headerGroup) => (
                          <Tr key={headerGroup.id}>
                              {headerGroup.headers.map((header) => {
                                  return (
                                      <Th
                                          pe="10px"
                                          borderColor={borderColor}
                                          key={header.id}
                                          colSpan={header.colSpan}
                                      >
                                          {header.isPlaceholder ? null : (
                                              <Flex
                                                  {...{
                                                      className:
                                                          header.column.getCanSort()
                                                              ? 'cursor-pointer select-none'
                                                              : '',
                                                      onClick:
                                                          header.column.getToggleSortingHandler(),
                                                  }}
                                                  justify="space-between"
                                                  align="center"
                                                  fontSize={{
                                                      sm: '10px',
                                                      lg: '12px',
                                                  }}
                                                  color="gray.400"
                                              >
                                                  {flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                                  {{
                                                      asc: '',
                                                      desc: '',
                                                  }[
                                                      header.column.getIsSorted() as string
                                                  ] ?? null}
                                              </Flex>
                                          )}
                                      </Th>
                                  );
                              })}
                          </Tr>
                      ))}
                  </Thead>
                  <Tbody>
                      {table.getRowModel().rows.map((row) => {
                          return (
                              <Tr px="20px" key={row.id}>
                                  {row.getVisibleCells().map((cell) => {
                                      return (
                                          <Td
                                              key={cell.id}
                                              fontSize={{ sm: '14px' }}
                                              minW={{
                                                  sm: '150px',
                                                  md: '200px',
                                                  lg: 'auto',
                                              }}
                                              borderColor={borderColor}
                                          >
                                              {flexRender(
                                                  cell.column.columnDef.cell,
                                                  cell.getContext()
                                              )}
                                          </Td>
                                      );
                                  })}
                              </Tr>
                          );
                      })}
                  </Tbody>
              </Table>
              <Flex w="100%" justify="space-between" px="20px" pt="10px" pb="5px">
                  {/* SET ROW NUMBER */}
                  <Text
                      fontSize="sm"
                      color="gray.500"
                      fontWeight="normal"
                      mb={{ sm: '24px', md: '0px' }}
                  >
                      Showing {pageSize * pageIndex + 1} to{' '}
                      {pageSize * (pageIndex + 1) <= tableData.length
                          ? pageSize * (pageIndex + 1)
                          : tableData.length}{' '}
                      of {tableData.length} entries
                  </Text>
                  {/* PAGINATION BUTTONS */}
                  <div className="flex items-center gap-2">
                      <Stack
                          direction="row"
                          alignSelf="flex-end"
                          spacing="4px"
                          ms="auto"
                      >
                          <Button
                              variant="no-effects"
                              onClick={() => table.previousPage()}
                              disabled={!table.getCanPreviousPage()}
                              transition="all .5s ease"
                              w="40px"
                              h="40px"
                              borderRadius="50%"
                              bg="transparent"
                              border="1px solid"
                              borderColor={useColorModeValue('gray.200', 'white')}
                              display={
                                  pageSize === 5
                                      ? 'none'
                                      : table.getCanPreviousPage()
                                      ? 'flex'
                                      : 'none'
                              }
                              _hover={{
                                  bg: 'whiteAlpha.100',
                                  opacity: '0.7',
                              }}
                          >
                              <Icon
                                  as={MdChevronLeft}
                                  w="16px"
                                  h="16px"
                                  color={textColor}
                              />
                          </Button>
                          {createPages(table.getPageCount()).map(
                              (pageNumber, index) => {
                                  return (
                                      <Button
                                          variant="no-effects"
                                          transition="all .5s ease"
                                          onClick={() =>
                                              table.setPageIndex(pageNumber - 1)
                                          }
                                          w="40px"
                                          h="40px"
                                          borderRadius="50%"
                                          bg={
                                              pageNumber === pageIndex + 1
                                                  ? brandColor
                                                  : 'transparent'
                                          }
                                          border={
                                              pageNumber === pageIndex + 1
                                                  ? 'none'
                                                  : '1px solid lightgray'
                                          }
                                          _hover={
                                              pageNumber === pageIndex + 1
                                                  ? {
                                                        opacity: '0.7',
                                                    }
                                                  : {
                                                        bg: 'whiteAlpha.100',
                                                    }
                                          }
                                          key={index}
                                      >
                                          <Text
                                              fontSize="sm"
                                              color={
                                                  pageNumber === pageIndex + 1
                                                      ? '#fff'
                                                      : textColor
                                              }
                                          >
                                              {pageNumber}
                                          </Text>
                                      </Button>
                                  );
                              }
                          )}
                          <Button
                              variant="no-effects"
                              onClick={() => table.nextPage()}
                              disabled={!table.getCanNextPage()}
                              transition="all .5s ease"
                              w="40px"
                              h="40px"
                              borderRadius="50%"
                              bg="transparent"
                              border="1px solid"
                              borderColor={useColorModeValue('gray.200', 'white')}
                              display={
                                  pageSize === 5
                                      ? 'none'
                                      : table.getCanNextPage()
                                      ? 'flex'
                                      : 'none'
                              }
                              _hover={{
                                  bg: 'whiteAlpha.100',
                                  opacity: '0.7',
                              }}
                          >
                              <Icon
                                  as={MdChevronRight}
                                  w="16px"
                                  h="16px"
                                  color={textColor}
                              />
                          </Button>
                      </Stack>
                  </div>
              </Flex>
          </Flex>
          
          {/*Show Configuration Modal*/}
          <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Configuración</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedConfig && (
                <div>
                  <p><strong>Desde: {new Date( parseInt(selectedConfig.from) ).toLocaleString()}</strong></p>
                  <p><strong>Hasta: {new Date( parseInt(selectedConfig.to) ).toLocaleString()}</strong></p>
                  <p><strong>Incluir Camiones: {selectedConfig.includeTrucks ? 'Sí' : 'No'}</strong></p>
                  {selectedConfig.includeTrucks &&
                  (<>
                    <p><strong>Camiones:</strong></p>
                    {selectedConfig.trucks.map((truck, truckIndex) => (
                      <div key={truckIndex}>
                        <p>&emsp;Serie: {truck.serie}</p>
                        <p>&emsp;Incluir Alertas: {truck.includeAlerts ? 'Sí' : 'No'}</p>
                        {truck.includeAlerts && 
                        <>
                          <p>&emsp;Alertas:</p>
                          <UnorderedList>
                            {truck.alerts.map((alert, alertIndex) => (
                              <ListItem key={alertIndex} ml='32px'>{alert}</ListItem>
                            ))}
                          </UnorderedList>
                        </>
                        }
                        <p>&emsp;Incluir Variables: {truck.includeVarHistory ? 'Sí' : 'No'}</p>
                        {truck.includeVarHistory && 
                        <UnorderedList>
                          {truck.varList.map((variable, varIndex) => (
                            <ListItem key={varIndex} ml='32px'>{variable}</ListItem>
                          ))}
                        </UnorderedList>
                        }
                        <br />
                      </div>
                    ))}
                  </>)
                  }
                  <p><strong>Incluir Conductores: {selectedConfig.includeDrivers ? 'Sí' : 'No'}</strong></p>
                  {selectedConfig.includeTrucks &&
                  (<>
                    <p><strong>Conductores:</strong></p>
                    {selectedConfig.drivers.map((driver, driverIndex) => (
                      <div key={driverIndex}>
                        <p>&emsp;Nombre: {driver.name} {driver.lastname}</p>
                        <p>&emsp;Incluir Alertas: {driver.includeAlerts ? 'Sí' : 'No'}</p>
                        {driver.includeAlerts && 
                        <>
                          <p>&emsp;Alertas:</p>
                          <UnorderedList>
                            {driver.alerts.map((alert, alertIndex) => (
                              <ListItem key={alertIndex} ml='32px'>{alert}</ListItem>
                            ))}
                          </UnorderedList>
                        </>
                        }
                        <p>&emsp;Incluir Historial de Actividad: {driver.includeActivityHistory ? 'Sí' : 'No'}</p>
                        <br />
                      </div>
                    ))}
                  </>)
                  }
                  <p><strong>Incluir CSV: {selectedConfig.includeCsv ? 'Sí' : 'No'}</strong></p>
                </div>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );
}
// A debounced input react component
function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
}: {
    value: string | number;
    onChange: (value: string | number) => void;
    debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
    const [value, setValue] = React.useState(initialValue);

    React.useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value);
        }, debounce);

        return () => clearTimeout(timeout);
    }, [value]);

    return (
        <SearchBar
            value={value}
            onChange={(e: any) => setValue(e.target.value)}
            h="44px"
            w={{ lg: '390px' }}
            borderRadius="16px"
        />
    );
}
