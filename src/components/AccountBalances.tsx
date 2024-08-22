'use client'
import { Flex, Skeleton, Stack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useBoolean } from 'react-use';
import { useApiContext } from '@/providers/ApiProvider';
import { FrameSystemAccountInfo } from '@dedot/chaintypes/substrate'; 
import { formatBalance } from '@/utils/string';

interface AccountBalancesProps {
  address: string;
}

export default function AccountBalances({ address }: AccountBalancesProps) {
  const { api, network, apiReady } = useApiContext();
  const [loading, setLoading] = useBoolean(true);
  const [balance, setBalance] = useState<FrameSystemAccountInfo>();

  useEffect(() => {
    let unsubscribe: any;
    (async () => {
      const client = api;
      if (!client) {
        return;
      }

      setLoading(true);
      unsubscribe = await client.query.system.account(address, (resp) => {
        setBalance(resp);
        setLoading(false);
      });
    })();

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [api, address, setLoading]);

  const values = [
    {
      label: 'Free Balance',
      amount: balance?.data?.free ?? 0n,
    },
   
  ];

  return (
    <Stack m={4}>
      {values.map(({ label, amount }) => (
        <Flex key={label} gap={2}>
          <Text>{label}:</Text>
          <Skeleton h={6} minW={10} isLoaded={apiReady && !loading}>
            <strong>
              {formatBalance(amount, network.decimals) || '0'}
              &nbsp;
              {network.symbol}
            </strong>
          </Skeleton>
        </Flex>
      ))}
    </Stack>
  );
}
