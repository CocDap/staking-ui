"use client";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { shortenAddress } from "@/utils/string";

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
            `${parseFloat(amountToSend) * Math.pow(10, network.decimals)}`
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
              Sent from: <b>{shortenAddress(from?.address())}</b>
            </p>
            <p style={{ fontSize: 12 }}>
              To:{" "}
              <b>
                {shortenAddress(to?.address())} : {value}
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
    <Box maxW="lg" mx="auto" mt={10}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4}>
          <Text>Yield Farming/Token Staking dApp</Text>
          <Text>Address</Text>
          <Text>36.5% (APY) - 0.1% Daily Earnings</Text>

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
          <Text>Total Stake (by all users): 0 TestToken (Tst)</Text>

          <Text>My Stake: 0 TestToken (Tst)</Text>
          <Text>My Estimated Reward: 0.000 TestToken (Tst)</Text>
          <Text>My balance: 213212 TestToken (Tst)</Text>

          <Text>FOR TESTING PURPOSE ONLY</Text>

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
            >
              Claim for 1000 Tst (User)
            </Button>

            <Button type="button" colorScheme="teal" width="full">
              Redistribute rewards (Admin)
            </Button>
          </Flex>

          {/* Text */}

          <Text>Selected Network private id: 57777</Text>
          <Text>Contract Balance: 121232 TestToken (Tst) </Text>

          <Text>Staking Contract address: 0x18219</Text>
        </VStack>
      </form>
    </Box>
  );
};

export default StakingBoardForm;
