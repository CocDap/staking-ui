"use client";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import React, { FC, useCallback, useState } from "react";
import { Props } from "@/types";
import { useApiContext } from "@/providers/ApiProvider";
import usePsp22Contract from "@/hooks/usePsp22Contract";
import { useWalletContext } from "@/providers/WalletProvider";
import useBalance from "@/hooks/useBalance";
import useContractTx from "@/hooks/useContractTx";
import useContractQuery from "@/hooks/useContractQuery";
import { toast } from "react-toastify";
import { txToaster } from "@/utils/txToaster";
import { formatBalance, shortenAddress } from "@/utils/string";
import {
  CurrencyDollarIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import useWatchContractEvent from "@/hooks/useWatchContractEvent";

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
  console.log("🚀 ~ balanceOf:", balanceOf);

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


// Listen to Transfer event from system events

useWatchContractEvent(
  contract,
  "Transfer",
  useCallback((events) => {
    events.forEach((psp22Event) => {
      const {
        name,
        data: { from, value, to },
      } = psp22Event;

      console.log(
        `Found a ${name} event sent from: ${from?.address()}, message: ${to}  `
      );

      toast.info(
        <div>
          <p>
            Found a <b>{name}</b> event
          </p>
          <p style={{ fontSize: 12 }}>
            To:{" "}
            <b>
              {shortenAddress(to?.address())} claim {value} (Tst)
            </b>
          </p>
        </div>
      );
    });
  }, [])
);

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
      <Flex gap={4} >
        <Button
         display={'flex'}
         alignItems={'center'}
         justifyContent={'center'}
         gap={2}
          paddingX={4}
          rounded={"full"}
          transition={"all 0.3s ease"}
          shadow={"md"}
          _hover={{
            backgroundColor: "#89d7e9",
          }}
          backgroundColor="#C8F5FF"
        >
          <CurrencyDollarIcon height={16} width={16} />
          <Text 
          fontWeight={"semibold"}
          textColor={"#026262"} fontSize={'14px'}
          >
            {formatBalance(balanceOf, tokenDecimal ?? 18) || "0.0000"}{" "}
            {tokenSymbol ?? "TKA"}
          </Text>
        </Button>
        <Button
         display={'flex'}
         alignItems={'center'}
         justifyContent={'center'}
         gap={2}
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
          <BanknotesIcon height={16} width={16} />
          <Text 
          fontWeight={"semibold"}
          textColor={"#026262"} fontSize={'14px'}
          >Faucet</Text>
        </Button>
      </Flex>
    </Box>
  );
};

export default MainFooter;
