'use client'
import StakerUI from '@/components/StakerUI';
import WelcomeBoard from '@/components/WelcomeBoard';
import { useWalletContext } from '@/providers/WalletProvider';
import { Box } from '@chakra-ui/react';
import React from 'react'

const StakingPage = () => {
    const { injectedApi } = useWalletContext();
  return (
    <Box
    mx="auto"
    display={'flex'}
    alignItems={'center'}
    justifyContent={'center'}
    flex={1}
    w="full"
    minHeight='80vh'
    
  >
     
     {!!injectedApi ?  <StakerUI /> : <WelcomeBoard />}

  </Box>
   
    
  )
}

export default StakingPage