'use client'
/* eslint-disable */

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
  Select,
  Input,
  Alert,
  AlertIcon,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure
} from '@chakra-ui/react';
// Custom components
import { MdChevronRight, MdChevronLeft, MdCheck, MdClose } from 'react-icons/md';
import * as React from 'react'
import { useEffect, useRef } from 'react';
// Assets
import { SearchBar } from 'components/navbar/searchBar/SearchBar';
import { usePathname, useRouter } from 'next/navigation';

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
import { MdDelete, MdEdit } from "react-icons/md";

const ENDPOINT = process.env.NEXT_PUBLIC_ENDPOINT;

const requestBodyGetDrivers = {
    query: `
        query GetDrivers {
            getDrivers {
                _id
                name
                contactNumber
                userType
            }
        }
    `
};

type RowObj = {
  serie: string;
  model: string;
  driver: string;
  status: string;
  driverID: string;
};

export default function AlertsTable(props: { tableData: RowObj[] }) {
    const { tableData } = props;
    const uniqueModels = [... new Set(tableData.map(truck => truck.model))];
    const [driversData, setDriversData] = React.useState([]);
    const [uniqueDriverNames, setUniqueDriverNames] = React.useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef();
    const textColor = useColorModeValue('navy.700', 'white');
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
    const brandColor = useColorModeValue('brand.500', 'brand.400');
    
    const [data, setData] = React.useState<RowObj[]>([]);
    const [editRowIndex, setEditRowIndex] = React.useState<number | null>(null);
    const editRowDataRef = useRef<RowObj | null>(null);

    const [alertMessage, setAlertMessage] = React.useState('');

    const [idToDelete, setIdToDelete] = React.useState<number | null>(null);
    
    useEffect(() => {
        setData(tableData);
    }, [tableData]);

    // Fetch GetDrivers
    useEffect(() => {

    fetch(ENDPOINT, {
        method: "POST",
        body: JSON.stringify(requestBodyGetDrivers),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.errors) {
                console.error("Error:", data.errors[0].message);
            }
            if (data && data.data && data.data.getDrivers) {
                console.log(data.data.getDrivers);
                setDriversData(data.data.getDrivers);
                setUniqueDriverNames([... new Set(data.data.getDrivers.map(driver => driver.name))])
            }
        })
        .catch((error) => {
            console.error("Error fetching drivers information:", error);
        });
    }, []);

    const handleEdit = (index: number) => {
        setEditRowIndex(index);
        editRowDataRef.current = { ...data[index] }; // Copia los datos actuales de la fila
    };

    const handleAccept = () => {
        if (!editRowDataRef.current.driver || !editRowDataRef.current.serie || 
            !editRowDataRef.current.status || !editRowDataRef.current.model) {
            setAlertMessage('Por favor, rellena todos los campos para editar un registro.');
            return;
        } else {
            setAlertMessage('');
        }
        if (editRowIndex !== null && editRowDataRef.current) {

            const driverID = driversData.find(driver => driver.name === editRowDataRef.current.driver)._id;

            const requestBodyUpdateDriver = {
                query: `
                    mutation UpdateTruck($truck: TruckUpdate) {
                        updateTruck(truck: $truck)
                    }
                `,
                variables: {
                    "truck": {
                        "driverID": driverID,
                        "model": editRowDataRef.current.model,
                        "serie": editRowDataRef.current.serie,
                        "status": editRowDataRef.current.status
                    }
                }
            };
            
            // fetch UpdateTruck
            fetch(ENDPOINT, {
                method: "POST",
                body: JSON.stringify(requestBodyUpdateDriver),
                headers: {
                "Content-Type": "application/json",
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.errors) {
                        console.error("Error:", data.errors[0].message);
                    }
                    if (data && data.data && data.data.updateTruck) {
                        console.log("Camión actualizado exitosamente:", data.data.updateTruck);
                        
                        setData((prevData) => {
                            const updatedData = [...prevData];
                            updatedData[editRowIndex] = editRowDataRef.current;
                            return updatedData;
                        });

                        console.log(editRowDataRef.current);
            
                        setEditRowIndex(null);
                        editRowDataRef.current = null;
                    }
                })
                .catch((error) => {
                    console.log("Error:", error);
                });
        }
    };

    const handleCancel = () => {
        setEditRowIndex(null);
        editRowDataRef.current = null;
        setAlertMessage('');
    };

    const handleInputChange = (field: keyof RowObj, value: string) => {
        if (editRowDataRef.current) {
            editRowDataRef.current = { ...editRowDataRef.current, [field]: value };
        }
    };

    const handleDelete = ( rowIndex ) => {
        setIdToDelete(rowIndex);
        onOpen();
    }

    const confirmDelete = () => {
        if (idToDelete !== null) {

            const requestBodyDeleteDriver = {
                query: `
                    mutation DeleteTruck($serie: ID) {
                        deleteTruck(serie: $serie)
                    }
                `,
                variables: {
                    "serie": data[idToDelete]?.serie
                }
            };

            fetch(ENDPOINT, {
                method: "POST",
                body: JSON.stringify(requestBodyDeleteDriver),
                headers: {
                "Content-Type": "application/json",
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.errors) {
                        console.error("Error:", data.errors[0].message);
                    }
                    if (data && data.data && data.data.deleteTruck) {
                        console.log("Camión eliminado exitosamente:", data.data.deleteTruck);
                        
                        setData((prevData) => {
                            console.log(prevData[idToDelete]);
                            const updatedData = prevData.filter((_, index) => index !== idToDelete);
                            return updatedData;
                        });

                        onClose();
                        setIdToDelete(null);
                    }
                })
                .catch((error) => {
                    console.log("Error:", error);
                });
            }
        }

    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    //let defaultData = tableData;
    const [globalFilter, setGlobalFilter] = React.useState('');
    const columnHelper = createColumnHelper<RowObj>();
    const columns = [
        columnHelper.accessor('model', {
        id: 'model',
        header: () => (
            <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
            Camión
            </Text>
        ),
        cell: (info) => {
            const rowIndex = info.row.index;
            return rowIndex === editRowIndex ? (
            <Select
                defaultValue={editRowDataRef.current?.model || ''}
                onChange={(e) => handleInputChange('model', e.target.value)}
            >
                {uniqueModels.map((model, index) => (
                    <option key={`${model}${index}`} value={model}>{model}</option>
                ))}
            </Select>
            ) : (
            <Text color={textColor} fontSize="md" fontWeight="500">
                {info.getValue()}
            </Text>
            );
        },
        }),
        columnHelper.accessor('serie', {
        id: 'serie',
        header: () => (
            <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
            Serie
            </Text>
        ),
        cell: (info) => {
            const rowIndex = info.row.index;
            return rowIndex === editRowIndex ? (
            <Input
                defaultValue={editRowDataRef.current?.serie || ''}
                onChange={(e) => handleInputChange('serie', e.target.value)}
            />
            ) : (
            <Text color={textColor} fontSize="md" fontWeight="500">
                {info.getValue()}
            </Text>
            );
        },
        }),
        columnHelper.accessor('driver', {
        id: 'driver',
        header: () => (
            <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
            Conductor
            </Text>
        ),
        cell: (info) => {
            const rowIndex = info.row.index;
            return rowIndex === editRowIndex ? (
            <Select
                defaultValue={editRowDataRef.current?.driver || ''}
                onChange={(e) => handleInputChange('driver', e.target.value)}
            >
                {uniqueDriverNames.map((driverNmae, index) => (
                    <option key={`${driverNmae}${index}`} value={driverNmae}>{driverNmae}</option>
                ))}
            </Select>
            ) : (
            <Text color={textColor} fontSize="md" fontWeight="500">
                {info.getValue()}
            </Text>
            );
        },
        }),
        columnHelper.accessor('status', {
        id: 'status',
        header: () => (
            <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
            Estado
            </Text>
        ),
        cell: (info) => {
            const rowIndex = info.row.index;
            return rowIndex === editRowIndex ? (
            <Select
                defaultValue={editRowDataRef.current?.status || ''}
                onChange={(e) => handleInputChange('status', e.target.value)}
            >
                <option value="operative">Operativo</option>
                <option value="idle">Inactivo</option>
            </Select>
            ) : (
            <Badge
                colorScheme={info.getValue() === 'idle' ? 'red' : 'green'}
                fontSize="md"
                fontWeight="500"
                >
                {info.getValue()}
            </Badge>
            );
        },
        }),
        {
        id: 'actions',
        header: () => (
            <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
            Acciones
            </Text>
        ),
        cell: (info) => {
            const rowIndex = info.row.index;
            return rowIndex === editRowIndex ? (
            <>
                <Button onClick={handleAccept} p={0}>
                <Icon as={MdCheck} w={8} h={8} color='green.500' />
                </Button>
                <Button onClick={handleCancel} p={0}>
                <Icon as={MdClose} w={8} h={8} color='red.500' />
                </Button>
            </>
            ) : (
            <>
                <Button onClick={() => handleEdit(rowIndex)} p={0}>
                <Icon as={MdEdit} w={8} h={8} color='brand.500' />
                </Button>
                <Button onClick={() => handleDelete(rowIndex)} p={0}>
                <Icon as={MdDelete} w={8} h={8} color='red' />
                </Button>
            </>
            );
        },
        },
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
                justify="flex-start"
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
            {alertMessage && (
                <Alert status="warning">
                    <AlertIcon />
                    {alertMessage}
                </Alert>
            )}
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

        <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        >
        <AlertDialogOverlay>
            <AlertDialogContent>
                <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                    Eliminar Camión
                </AlertDialogHeader>

                <AlertDialogBody>
                    ¿Estás seguro? No puedes deshacer esta acción después.
                </AlertDialogBody>

                <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                    Cancelar
                </Button>
                <Button colorScheme='red' onClick={confirmDelete} ml={3}>
                    Eliminar
                </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialogOverlay>
        </AlertDialog>
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
