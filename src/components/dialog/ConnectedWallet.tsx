import { Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { useWalletContext } from '@/providers/WalletProvider';
import Image from 'next/image';

export default function ConnectedWallet() {
  const { connectedWallet } = useWalletContext();

  return (
    <Flex align='center' gap={3} flex={1} justify='center' pb={2}>
      <Image src={connectedWallet?.logo || ''} alt={connectedWallet?.name || ''} width={24} height={24}/>
      <Text fontWeight='600' fontSize='14'>
        {connectedWallet?.name} - v{connectedWallet?.version}
      </Text>
    </Flex>
  );
}
