"use client";
import StakeDialog from "@/components/StakeContractInteraction/StakeDialog";
import useBalance from "@/hooks/useBalance";
import useContractQuery from "@/hooks/useContractQuery";
import useContractTx from "@/hooks/useContractTx";
import usePsp22Contract from "@/hooks/usePsp22Contract";
import useStakingContract from "@/hooks/useStakingContract";
import { useWalletContext } from "@/providers/WalletProvider";
import { formatBalance, formatLockingPeriod, shortenAddress } from "@/utils/string";
import { txToaster } from "@/utils/txToaster";
import { Box, Button, Text, useDisclosure } from "@chakra-ui/react";
import { isContractInstantiateDispatchError } from "dedot/contracts";
import React, { useCallback, useRef } from "react";
import { toast } from "react-toastify";
import { StakingContractApi } from "@/contracts/types/staking";
import { ADDRESS_STAKING } from "@/contracts/psp22/pop-network-testnet";
import { useTokenContract } from "@/providers/TokenContractWrap";
import useWatchContractEvent from "@/hooks/useWatchContractEvent";

const StakeContractInteraction = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);

  const stakingContract = useStakingContract();
  const psp22Contract = usePsp22Contract();

  const { selectedAccount } = useWalletContext();
  const balance = useBalance(selectedAccount?.address);
  const stakingTx = useContractTx(stakingContract, "stake");
  const unStakingTx = useContractTx(stakingContract, "withdraw");

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
    fn: "getUserData",
    args: [selectedAccount?.address || ""],
  });


  const {
    data: lockingPeriod,
   
  } = useContractQuery({
    contract: stakingContract,
    fn: "durationTime",
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

  const handUnStakeToken = async (amountToSend: string) => {
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
    }
  };

  // Listen to Transfer event from system events

  useWatchContractEvent(
    stakingContract,
    "Stake",
    useCallback(
      (events) => {
        events.forEach((stakingEvent) => {
          const {
            name,
            data: { user, amount },
          } = stakingEvent;

          console.log(
            `Found a ${name} event sent from: ${user?.address()}, message: ${amount}  `
          );

          // toast.info(
          //   <div>
          //     <p>
          //       Found a <b>{name}</b> event
          //     </p>
          //     <p style={{ fontSize: 12 }}>
          //       From:{" "}
          //       <b>
          //         {shortenAddress(user?.address())} stake { formatBalance(amount, tokenDecimal || 18)} (Tst)
          //       </b>
          //     </p>
          //   </div>
          // );
          const storedEvent = localStorage.getItem("myEvents");
          console.log("🚀 ~ events.forEach ~ storedEvent:", storedEvent);
          let myEvent = [];
          if (storedEvent) {
            // Nếu đã có array, chuyển đổi chuỗi JSON trở lại thành array
            myEvent = JSON.parse(storedEvent);
          }
          const stakingData = {
            address: user.address(),
            amount: formatBalance(amount, tokenDecimal || 18),
            method: "Stake",
          };

          myEvent.push(stakingData);

          localStorage.setItem("myEvents", JSON.stringify(myEvent));
        });
      },
      [tokenDecimal]
    )
  );

  // Listen to Transfer event from system events

  useWatchContractEvent(
    stakingContract,
    "Unstake",
    useCallback(
      (events) => {
        events.forEach((stakingEvent) => {
          const {
            name,
            data: { user, amount },
          } = stakingEvent;

          console.log(
            `Found a ${name} event sent from: ${user?.address()}, message: ${amount}  `
          );

          // toast.info(
          //   <div>
          //     <p>
          //       Found a <b>{name}</b> event
          //     </p>
          //     <p style={{ fontSize: 12 }}>
          //       From:{" "}
          //       <b>
          //         {shortenAddress(user?.address())} stake { formatBalance(amount, tokenDecimal || 18)} (Tst)
          //       </b>
          //     </p>
          //   </div>
          // );
          const storedEvent = localStorage.getItem("myEvents");
          let myEvent = [];
          if (storedEvent) {
            // Nếu đã có array, chuyển đổi chuỗi JSON trở lại thành array
            myEvent = JSON.parse(storedEvent);
          }
          const stakingData = {
            address: user.address(),
            amount: formatBalance(amount, tokenDecimal || 18),
            method: "unstake",
          };

          myEvent.push(stakingData);

          localStorage.setItem("myEvents", JSON.stringify(myEvent));
        });
      },
      [tokenDecimal]
    )
  );

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
        <Text>{shortenAddress(ADDRESS_STAKING)}</Text>
      </Box>

      <Box
        width={"100%"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Box>
          <Text fontWeight={"600"} fontSize={"xl"}>
            Locking Period
          </Text>
          <Text>{formatLockingPeriod(lockingPeriod) || '0'}{"s"}</Text>
        </Box>
        <Box>
          <Text fontWeight={"600"} fontSize={"xl"}>
            You Staked
          </Text>
          <Text>
            {formatBalance(balanceOfStake?.amount, tokenDecimal || 18) || "0"}
          </Text>
        </Box>
      </Box>

      <Box>
        <Text fontWeight={"600"} fontSize={"xl"}>
          Total Staked
        </Text>
        <Text>{formatBalance(totalStake, tokenDecimal || 18) || "0"}</Text>
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
            // onClick={handUnStakeToken}
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
