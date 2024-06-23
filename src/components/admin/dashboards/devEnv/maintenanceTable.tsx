'use client'
/* eslint-disable */

import { Box, Flex, Table, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue, Switch } from '@chakra-ui/react';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import * as React from 'react';
import { useEffect } from 'react';

type RowObj = {
  component: string;
  priority: string;
  maintenance: string;
  done: boolean;
};

const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('es-ES');
  };

const columnHelper = createColumnHelper<RowObj>();

export default function MaintenanceTable({ tableData, truckName, truckDate }: { tableData: RowObj[], truckName: string, truckDate: string }) {
  const textColor = useColorModeValue('navy.700', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  const [data, setData] = React.useState<RowObj[]>([]);
  
  useEffect(() => {
    setData(tableData);
  }, [tableData]);
  
  const handleSwitchChange = (index: number) => {
    const newData = [...data];
    newData[index].done = !newData[index].done;
    setData(newData);
  };

  const columns = [
    columnHelper.accessor('component', {
      id: 'component',
      header: () => (
        <Text justifyContent="space-between" align="center" fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          {truckName} - {formatDate(truckDate)}
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="md" fontWeight="700">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('priority', {
      id: 'priority',
      header: () => (
        <Text justifyContent="space-between" align="center" fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          PRIORIDAD
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="md" fontWeight="500">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('maintenance', {
      id: 'maintenance',
      header: () => (
        <Text justifyContent="space-between" align="center" fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          MANTENIMIENTO
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="md" fontWeight="500">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('done', {
      id: 'done',
      header: () => (
        <Text justifyContent="space-between" align="center" fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          REALIZADO
        </Text>
      ),
      cell: (info) => (
        <Switch
          isChecked={info.getValue()}
          onChange={() => handleSwitchChange(info.row.index)}
        />
        /*<Text color={textColor} fontSize="md" fontWeight="500">
          {info.getValue() ? 'Sí' : 'No'}
        </Text>*/
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
  });

  return (
    <Flex direction="column" w="100%" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
      <Box>
        <Table variant="simple" color="gray.500">
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <Th key={header.id} colSpan={header.colSpan} pe="10px" borderColor={borderColor}>
                      <Flex justifyContent="space-between" align="center" fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </Flex>
                    </Th>
                  );
                })}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.slice(0, 11).map((row) => {
              return (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <Td
                        key={cell.id}
                        fontSize={{ sm: '14px' }}
                        minW={{ sm: '170px', md: '200px', lg: 'auto' }}
                        borderColor={borderColor}
                        mt="20px !important"
                        py="22px !important"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>
    </Flex>
  );
}
