import { Box, Divider, Link, ListItem, Text, UnorderedList } from '@chakra-ui/react';
import React from 'react';

import WalletSelection from '@/components/dialog/WalletSelection';

export default function WelcomeBoard() {
  return (
    <Box>
      <Box textAlign='center'>
       
      
        <Text mb={4} fontSize='xl'>
          Connect to your wallet to getting started
        </Text>
        <WalletSelection />
      </Box>
      <Divider mt={8} mb={4} />
     
    </Box>
  );
}
