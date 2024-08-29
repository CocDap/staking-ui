'use client'
import { shortenAddress } from '@/utils/string';
import { Table, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'

const StakeEventsTable = () => {
  const [listEvent, setListEvent] = useState<any []>();
  useEffect(() => {
    const myEvents = localStorage.getItem('myEvents');
    if (myEvents) {
      const parsedEvents = JSON.parse(myEvents);
      setListEvent(parsedEvents)
  
    }
  }, []);
  
  return (
    <TableContainer>
    <Table variant='striped' colorScheme='teal'>
      
      <Thead>
        <Tr>
          <Th>From</Th>
          <Th isNumeric>Value</Th>
          <Th>Method</Th>
          
        </Tr>
      </Thead>
      <Tbody>
        {
          listEvent && listEvent.map((event, index) => (
            <Tr key={index}>
              <Td>{shortenAddress(event?.address)}</Td>
              <Td isNumeric>{event.amount}</Td>
              <Td>{event.method}</Td>
            </Tr>
          ))  || <Tr>No events yet.</Tr>  // Default message when list is empty
        }
       
       
      </Tbody>
      
    </Table>
  </TableContainer>
  )
}

export default StakeEventsTable