'use client'
import { Box, Button, Flex } from "@chakra-ui/react";
import React, { FC, useState } from "react";
import { Props } from "@/types";
import { useApiContext } from "@/providers/ApiProvider";
import usePsp22Contract from "@/hooks/usePsp22Contract";
import { useWalletContext } from "@/providers/WalletProvider";
import useBalance from "@/hooks/useBalance";
import useContractTx from "@/hooks/useContractTx";
import useContractQuery from "@/hooks/useContractQuery";
import { toast } from "react-toastify";
import { txToaster } from "@/utils/txToaster";
import { formatBalance } from "@/utils/string";

const MainFooter: FC<Props> = () => {


  
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
    
      const { data: tokenSymbol } = useContractQuery({
        contract,
        fn: "psp22MetadataTokenSymbol",
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
        console.log("🚀 ~ balanceOf:", balanceOf)

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
    <Box
      maxWidth="full"
      px={4}
      mx="auto"
      display="flex"
      position={"fixed"}
      bottom={0}
      left={0}
      zIndex={10}
      justifyContent="space-between"
      alignItems="center"
      gap={4}
      py={4}
    >
      <Flex gap={4} textColor={"#026262"}>
        <Button
          fontWeight={"semibold"}
          paddingX={4}
          rounded={"full"}
          transition={"all 0.3s ease"}
          shadow={"md"}
          _hover={{
            backgroundColor: "#89d7e9",
          }}
          backgroundColor="#C8F5FF"
          fontSize={"14px"}
        >
           {formatBalance(balanceOf, tokenDecimal ?? 18) || "0.0000"}{" "}{tokenSymbol ?? 'TKA'}
        </Button>
        <Button
          fontWeight={"semibold"}
          paddingX={4}
          rounded={"full"}
          transition={"all 0.3s ease"}
          shadow={"md"}
          _hover={{
            backgroundColor: "#89d7e9",
          }}
          backgroundColor="#C8F5FF"
          fontSize={"14px"}
          onClick={handleMinToken}
        >
          Faucet
        </Button>
      </Flex>
    </Box>
  );
};

export default MainFooter;
