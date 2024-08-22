"use client";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { date, symbol, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  CheckboxIcon,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import Image from "next/image";
import useContractQuery from "@/hooks/useContractQuery";
import usePsp22Contract from "@/hooks/usePsp22Contract";
import { useApiContext } from "@/providers/ApiProvider";
import useWatchContractEvent from "@/hooks/useWatchContractEvent";
import { useWalletContext } from "@/providers/WalletProvider";
import { toast } from "react-toastify";
import useBalance from "@/hooks/useBalance";
import { txToaster } from "@/utils/txToaster";
import useContractTx from "@/hooks/useContractTx";
import { formatBalance, shortenAddress } from "@/utils/string";

// Define Zod schema for validation
const schema = z.object({
  numberToken: z.coerce.number().min(3),
});

// Type for form data
type FormData = z.infer<typeof schema>;

const StakingBoardForm: React.FC = () => {
  const [amountToSend, setAmountToSend] = useState<string>("100");
  const { network } = useApiContext();
  const contract = usePsp22Contract();
  const { selectedAccount } = useWalletContext();
  const balance = useBalance(selectedAccount?.address);
  const mintableMintTx = useContractTx(contract, "psp22MintableMint");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
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

  const { data: tokenDecimal } = useContractQuery({
    contract,
    fn: "psp22MetadataTokenDecimals",
  });

  const { data: tokenSymbol } = useContractQuery({
    contract,
    fn: "psp22MetadataTokenSymbol",
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

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <Box
      maxW="lg"
      mx="auto"
      mt={10}
      border={1}
      borderStyle={"solid"}
      p={8}
      rounded={8}
      borderColor={"gray.200"}
      textAlign={"center"}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4}>
          <VStack spacing={2}>
            <Text fontWeight={700} fontSize={"24"}>
              Yield Farming/Token Staking dApp
            </Text>
            <Text>36.5% (APY) - 0.1% Daily Earnings</Text>
          </VStack>

          {/* Number Token Field */}
          <FormControl isInvalid={!!errors.numberToken}>
            <Input
              id="numberToken"
              type="number"
              placeholder="Number Token"
              {...register("numberToken")}
            />
            <FormErrorMessage>{errors.numberToken?.message}</FormErrorMessage>
          </FormControl>

          {/* Submit Button */}
          <Flex
            direction={{ base: "column", md: "row" }}
            width={"full"}
            align={"center"}
            justify={"center"}
            gap={"2"}
          >
            <Button type="submit" colorScheme="teal" width="full">
              <Flex align={"center"} justify={"center"} gap={"2"}>
                <Image src={"/stake.png"} alt="stake" width={24} height={24} />
                <Text>Stake</Text>
              </Flex>
            </Button>

            <Button type="submit" colorScheme="teal" width="full">
              <Flex align={"center"} justify={"center"} gap={"2"}>
                <Image
                  src={"/unstake.png"}
                  alt="unstake"
                  width={24}
                  height={24}
                />
                <Text>Unstake</Text>
              </Flex>
            </Button>
          </Flex>

          {/* Text */}
          <VStack spacing={2}>
            <Text>
              Total Stake (by all users):<strong> 0.000 </strong>
              <strong>{tokenSymbol}</strong>
            </Text>

            <Text>
              My Stake: <strong> 0.000 </strong>
              <strong>{tokenSymbol}</strong>
            </Text>
            <Text>
              My Estimated Reward:
              <strong> 0.000 </strong>
              <strong>{tokenSymbol}</strong>
            </Text>
            <Text>
              My balance:
              <strong>
                {" "}
                {formatBalance(balanceOf, tokenDecimal ?? 18) || "0"}{" "}
              </strong>
              <strong>{tokenSymbol}</strong>
            </Text>
          </VStack>

          <Text fontWeight={700} fontSize={"24"}>
            FOR TESTING PURPOSE ONLY
          </Text>

          {/* Button */}

          <Flex
            direction={{ base: "column", md: "row" }}
            width={"full"}
            align={"center"}
            justify={"center"}
            gap={"2"}
          >
            <Button
              type="button"
              colorScheme="teal"
              width="full"
              onClick={handleMinToken}
              isLoading={mintableMintTx.isInProgress}
            >
              Claim for 1000 {tokenSymbol} (User)
            </Button>
          </Flex>

          {/* Text */}

          <VStack spacing={2}>
            <Text>
              Contract Balance: <strong> 0.000 </strong>
              <strong>{tokenSymbol}</strong>
            </Text>
          </VStack>
        </VStack>
      </form>
    </Box>
  );
};

export default StakingBoardForm;
