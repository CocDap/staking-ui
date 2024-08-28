import StakeEventsTable from '@/app/(landing)/stakings/StakeEventsTable'
import { Box, Text } from '@chakra-ui/react'
import React from 'react'

const StakingEvents = () => {
  return (
    <Box
    maxWidth="container.md"
    mx="auto"
    display={'flex'}
    flexDirection={'column'}
    alignItems={'center'}
    justifyContent={'center'}
    flex={1}
    w="full"
    minHeight='80vh'
    gap={8}
    
  >
     
    <Text
      fontWeight={"semibold"}
      textColor={"#026262"} fontSize={'26px'}
    >All Staking Events</Text>

    <StakeEventsTable/>

  </Box>
  )
}

export default StakingEvents