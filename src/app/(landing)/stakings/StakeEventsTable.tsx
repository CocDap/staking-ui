import { Table, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr } from '@chakra-ui/react'
import React from 'react'

const StakeEventsTable = () => {
  return (
    <TableContainer>
    <Table variant='striped' colorScheme='teal'>
      
      <Thead>
        <Tr>
          <Th>From</Th>
          <Th isNumeric>Value</Th>
          <Th>Symbol</Th>
          
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Td>0x12..12</Td>
         
          <Td isNumeric>25.4</Td>
          <Td>TST</Td>
        </Tr>
       
      </Tbody>
      
    </Table>
  </TableContainer>
  )
}

export default StakeEventsTable