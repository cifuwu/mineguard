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
} from '@chakra-ui/react';
// Custom components
import { MdChevronRight, MdChevronLeft } from 'react-icons/md';
import * as React from 'react'
import { useEffect } from 'react';
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

type RowObj = {
  truck: string;
  serie: string;
  driver: string;
  contactNumber: string;
  date: string;
  component: string;
  criticalVariable: string;
  correctiveAction: string;
  state: string;
};

export default function AlertsTable(props: { tableData: RowObj[] }) {
    const { tableData } = props;
    const router = useRouter();
    const textColor = useColorModeValue('navy.700', 'white');
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
    const brandColor = useColorModeValue('brand.500', 'brand.400');

    const [data, setData] = React.useState<RowObj[]>([]);
  
    useEffect(()=>{
        router.prefetch('/manualAlerts');
      },[])

    const handleManualAlert = () => {
        router.push('/manualAlerts');
    }

    useEffect(() => {
        setData(tableData);
    }, [tableData]);

    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    //let defaultData = tableData;
    const [globalFilter, setGlobalFilter] = React.useState('');
    const columnHelper = createColumnHelper<RowObj>();
    const columns = [
        columnHelper.accessor('truck', {
            id: 'truck',
            header: () => (
                <Text
                    justifyContent="space-between"
                    align="center"
                    fontSize={{ sm: '10px', lg: '12px' }}
                    color="gray.400"
                >
                    Camión
                </Text>
            ),
            cell: (info: any) => (
                <Text color={textColor} fontSize="md" fontWeight="500">
                    {info.getValue()}
                </Text>
            ),
        }),
        columnHelper.accessor('serie', {
            id: 'serie',
            header: () => (
                <Text
                    justifyContent="space-between"
                    align="center"
                    fontSize={{ sm: '10px', lg: '12px' }}
                    color="gray.400"
                >
                    Serie
                </Text>
            ),
            cell: (info) => (
                <Text color={textColor} fontSize="md" fontWeight="500">
                    {info.getValue()}
                </Text>
            ),
        }),
        columnHelper.accessor('driver', {
            id: 'driver',
            header: () => (
                <Text
                    justifyContent="space-between"
                    align="center"
                    fontSize={{ sm: '10px', lg: '12px' }}
                    color="gray.400"
                >
                    Conductor
                </Text>
            ),
            cell: (info) => (
                <Text color={textColor} fontSize="md" fontWeight="500">
                    {info.getValue()}
                </Text>
            ),
        }),
        columnHelper.accessor('contactNumber', {
            id: 'contactNumber',
            header: () => (
                <Text
                    justifyContent="space-between"
                    align="center"
                    fontSize={{ sm: '10px', lg: '12px' }}
                    color="gray.400"
                >
                    Número
                </Text>
            ),
            cell: (info) => (
                <Text color={textColor} fontSize="md" fontWeight="500">
                    {info.getValue()}
                </Text>
            ),
        }),
        columnHelper.accessor('date', {
            id: 'date',
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
                <Text color={textColor} fontSize="md" fontWeight="500">
                    {info.getValue()}
                </Text>
            ),
        }),
        columnHelper.accessor('component', {
            id: 'component',
            header: () => (
                <Text
                    justifyContent="space-between"
                    align="center"
                    fontSize={{ sm: '10px', lg: '12px' }}
                    color="gray.400"
                >
                    Componente
                </Text>
            ),
            cell: (info) => (
                <Text color={textColor} fontSize="md" fontWeight="500">
                    {info.getValue()}
                </Text>
            ),
        }),
        columnHelper.accessor('criticalVariable', {
            id: 'criticalVariable',
            header: () => (
                <Text
                    justifyContent="space-between"
                    align="center"
                    fontSize={{ sm: '10px', lg: '12px' }}
                    color="gray.400"
                >
                    Variable
                </Text>
            ),
            cell: (info) => (
                <Text color={textColor} fontSize="md" fontWeight="500">
                    {info.getValue()}
                </Text>
            ),
        }),
        columnHelper.accessor('correctiveAction', {
            id: 'correctiveAction',
            header: () => (
                <Text
                    justifyContent="space-between"
                    align="center"
                    fontSize={{ sm: '10px', lg: '12px' }}
                    color="gray.400"
                >
                    Acción Correctiva
                </Text>
            ),
            cell: (info) => (
                <Text color={textColor} fontSize="md" fontWeight="500">
                    {info.getValue()}
                </Text>
            ),
        }),
        columnHelper.accessor('state', {
            id: 'state',
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
                <Badge
                    colorScheme={
                        info.getValue() === 'NoLeido' ? 'red' : 'green'
                    }
                    color={
                        info.getValue() === 'NoLeido'
                            ? 'red.500'
                            : 'green.500'
                    }
                    fontSize="md"
                    fontWeight="500"
                >
                    {info.getValue() === 'NoLeido' ? 'No Leido' : info.getValue()}
                </Badge>
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
        <Flex
            direction="column"
            w="100%"
            overflowX={{ sm: 'scroll', lg: 'auto', }}
        >
            <Flex
                align={{ sm: 'flex-start', lg: 'flex-start' }}
                justify="space-between"
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
                <Button px={8} variant="brand" onClick={handleManualAlert}>Alerta Manual</Button>
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
