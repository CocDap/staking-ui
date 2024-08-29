"use client";
import StakeDialog from "@/components/StakeContractInteraction/StakeDialog";
import useBalance from "@/hooks/useBalance";
import useContractQuery from "@/hooks/useContractQuery";
import useContractTx from "@/hooks/useContractTx";
import usePsp22Contract from "@/hooks/usePsp22Contract";
import useStakingContract from "@/hooks/useStakingContract";
import { useWalletContext } from "@/providers/WalletProvider";
import { formatBalance } from "@/utils/string";
import { txToaster } from "@/utils/txToaster";
import { Box, Button, Text, useDisclosure } from "@chakra-ui/react";
import { isContractInstantiateDispatchError } from "dedot/contracts";
import React, { useRef } from "react";
import { toast } from "react-toastify";
import { StakingContractApi } from "@/contracts/types/staking";
import { ADDRESS_STAKING } from "@/contracts/psp22/pop-network-testnet";
import { useTokenContract } from "@/providers/TokenContractWrap";

const StakeContractInteraction = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);

  const stakingContract = useStakingContract();
  const psp22Contract = usePsp22Contract();

  const { selectedAccount } = useWalletContext();
  const balance = useBalance(selectedAccount?.address);
  const stakingTx = useContractTx(stakingContract, "stake");
  const unStakingTx = useContractTx(stakingContract, "unstake");

  const approveTx = useContractTx(psp22Contract, "psp22Approve");
  const { refreshBalanceOf, balanceOf } = useTokenContract();

  const { data: tokenDecimal } = useContractQuery({
    contract: psp22Contract,
    fn: "psp22MetadataTokenDecimals",
  });

  const {
    data: totalStake,
    isLoading,
    refresh,
  } = useContractQuery({
    contract: stakingContract,
    fn: "getTotalStaked",
  });

  const {
    data: balanceOfStake,
    isLoading: balanceOfIsLoading,
    refresh: refreshYouStake,
  } = useContractQuery({
    contract: stakingContract,
    fn: "getBalanceByAccount",
    args: [selectedAccount?.address || ""],
  });

  const handApproveToken = async (amountToSend: string) => {
    console.log(
      "===========================Approve Token ============================="
    );
    if (!psp22Contract) return;

    if (!selectedAccount) {
      toast.info("Please connect to your wallet");
      return;
    }

    if (
      balanceOf &&
      balanceOf <
        BigInt(`${parseFloat(amountToSend) * Math.pow(10, tokenDecimal || 18)}`)
    ) {
      toast.error("Balance < Amount To Send");
      return;
    }
    if (balance === 0n) {
      toast.error("Balance insufficient to make transaction.");
      return;
    }

    const toaster = txToaster("Signing transaction...");

    try {
      await approveTx.signAndSend({
        args: [
          ADDRESS_STAKING,
          BigInt(
            `${parseFloat(amountToSend) * Math.pow(10, tokenDecimal || 18)}`
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
      await handStakeToken(amountToSend);
    }
  };

  const handStakeToken = async (amountToSend: string) => {
    console.log(
      "===========================Stake Token ============================="
    );

    if (!stakingContract) return;

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
      await stakingTx.signAndSend({
        args: [
          BigInt(
            `${parseFloat(amountToSend) * Math.pow(10, tokenDecimal || 18)}`
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
      refreshYouStake();
      refreshBalanceOf();
      onClose();
    }
  };

  const handUnStakeToken = async () => {
    console.log(
      "===========================Unstake Token ============================="
    );

    if (!stakingContract) return;

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
      await unStakingTx.signAndSend({
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
      refreshYouStake();
      refreshBalanceOf();
    }
  };

  return (
    <Box
      maxWidth={"container.md"}
      border={"8px solid #89d7e9"}
      backgroundColor={"#F0FCFF"}
      width={"100%"}
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      gap={"12"}
      paddingY={"8"}
      paddingX={{
        md: "20",
        base: "18",
      }}
      shadow={"lg"}
      textColor={"#026262"}
      rounded={"xl"}
      textAlign={"center"}
    >
      <Box>
        <Text fontWeight={"600"} fontSize={"2xl"}>
          Staker Contract
        </Text>
        <Text>01213</Text>
      </Box>

      <Box
        width={"100%"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Box>
          <Text fontWeight={"600"} fontSize={"xl"}>
            Time Left
          </Text>
          <Text>01213</Text>
        </Box>
        <Box>
          <Text fontWeight={"600"} fontSize={"xl"}>
            You Staked
          </Text>
          <Text>{formatBalance(balanceOfStake, 18) || "0"}</Text>
        </Box>
      </Box>

      <Box>
        <Text fontWeight={"600"} fontSize={"xl"}>
          Total Staked
        </Text>
        <Text>{formatBalance(totalStake, 18) || "0"}</Text>
      </Box>

      <Box display={"flex"} flexDirection={"column"} gap={"8"}>
        <Box
          display={"flex"}
          gap={{
            md: "8",
            base: "4",
          }}
        >
          <Button
            paddingX={{
              md: "8",
              base: "4",
            }}
            paddingY={{
              md: "6",
              base: "3",
            }}
            rounded={"full"}
            shadow={"lg"}
            backgroundColor={"#C8F5FF"}
            textColor={"#026262"}
          >
            EXECUTE!
          </Button>
          <Button
            paddingX={{
              md: "8",
              base: "4",
            }}
            paddingY={{
              md: "6",
              base: "3",
            }}
            rounded={"full"}
            shadow={"lg"}
            backgroundColor={"#C8F5FF"}
            textColor={"#026262"}
            onClick={handUnStakeToken}
          >
            WITHDRAW
          </Button>
        </Box>

        <Button
          paddingX={"8"}
          paddingY={"6"}
          rounded={"full"}
          shadow={"lg"}
          backgroundColor={"#C8F5FF"}
          textColor={"#026262"}
          onClick={onOpen}
        >
          STAKE
        </Button>
      </Box>

      <StakeDialog
        handApproveToken={handApproveToken}
        isOpen={isOpen}
        onClose={onClose}
        cancelRef={cancelRef}
      />
    </Box>
  );
};

export default StakeContractInteraction;
