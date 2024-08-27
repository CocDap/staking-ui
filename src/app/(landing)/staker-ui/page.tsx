'use client'

import StakeContractInteraction from '@/components/StakeContractInteraction';
import WelcomeBoard from '@/components/WelcomeBoard';
import { useWalletContext } from '@/providers/WalletProvider';
import { Box } from '@chakra-ui/react'
import React from 'react'

const StakerPage = () => {
    const { injectedApi } = useWalletContext();
  return (
    <Box
    maxWidth="container.md"
    mx="auto"
    display={'flex'}
    alignItems={'center'}
    justifyContent={'center'}
    flex={1}
    w="full"
    minHeight='80vh'
    
  >
     {!!injectedApi ?  <StakeContractInteraction /> : <WelcomeBoard />}
    

  </Box>
  )
}

export default StakerPage