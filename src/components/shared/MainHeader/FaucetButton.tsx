'use client'
import useBalance from '@/hooks/useBalance'
import useContractQuery from '@/hooks/useContractQuery'
import useContractTx from '@/hooks/useContractTx'
import usePsp22Contract from '@/hooks/usePsp22Contract'
import { useApiContext } from '@/providers/ApiProvider'
import { useWalletContext } from '@/providers/WalletProvider'
import { txToaster } from '@/utils/txToaster'
import { Box, Button, Flex, Tooltip } from '@chakra-ui/react'
import Image from 'next/image'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

const FaucetButton = () => {
    const [amountToSend, setAmountToSend] = useState<string>("100");
    const { network } = useApiContext();
    const contract = usePsp22Contract();
    const { selectedAccount } = useWalletContext();
    const balance = useBalance(selectedAccount?.address);
    const mintableMintTx = useContractTx(contract, "psp22MintableMint");

    const { data: tokenDecimal } = useContractQuery({
        contract,
        fn: "psp22MetadataTokenDecimals",
      });
    

      const {
        data: balanceOf,
        isLoading,
        refresh,
      } = useContractQuery({
        contract,
        fn: "psp22BalanceOf",
        args: [selectedAccount ? selectedAccount.address : ""],
      });

    const handleMinToken = async () => {
        if (!contract) return;
    
        if (!selectedAccount) {
          toast.info("Please connect to your wallet");
          return;
        }
    
        if (balance === 0n) {
          toast.error("Balance insufficient to make transaction.");
          return;
        }
    
        const toaster = txToaster("Signing transaction...");
    
        try {
          await mintableMintTx.signAndSend({
            args: [
              BigInt(
                `${parseFloat(amountToSend) * Math.pow(10, tokenDecimal ?? 18)}`
              ),
            ],
            callback: ({ status }) => {
              console.log(status);
    
              toaster.updateTxStatus(status);
            },
          });
        } catch (e: any) {
          console.error(e, e.message);
          toaster.onError(e);
        } finally {
          refresh();
        }
      };
  return (
    <Tooltip label='Grab funds from faucet'>
        <Button display={'flex'} alignItems={'center'} justifyContent={'center'} width={10} height={10}  backgroundColor={'#89d7e9'} rounded={'full'}   _hover={{
        shadow: "md",
        backgroundColor: "#C8F5FF",
      }}
      cursor={'pointer'}
      onClick={handleMinToken}
      >
        <Image alt='faucet' width={24} height={24} src={'/stake.png'} />
      </Button>
    </Tooltip>
    
  )
}

export default FaucetButton