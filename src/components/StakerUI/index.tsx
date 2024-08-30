import FormStakerUI from "@/components/StakerUI/FormStakerUI";
import HeaderStaker from "@/components/StakerUI/HeaderStaker";
import RewardUI from "@/components/StakerUI/RewardUI";
import useStakeForm from "@/hooks/useStakeForm";
import { useTokenContract } from "@/providers/TokenContractWrap";
import { formatBalance, formatLockingPeriod } from "@/utils/string";
import { Box, Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import { CircleStackIcon, CalendarIcon } from "@heroicons/react/24/outline";

import React from "react";

const StakerUI = () => {
  const {
    totalStake,
    userStakeData,
    lockingPeriod,
    tokenDecimal,
    userReward,
    tokenSymbol,
  } = useTokenContract();
  console.log("🚀 ~ StakerUI ~ tokenSymbol:", tokenSymbol);

  return (
    <>
      <Grid
        h="70vh"
        templateRows={{ md: "repeat(3, 1fr)", mdl: "repeat(2, 1fr)" }} // Responsive rows
        templateColumns={{ md: "repeat(2, 1fr)", mdl: "repeat(6, 1fr)" }} // Responsive columns
        gap={4}
        w={"full"}
        paddingX={8}
      >
        <GridItem colSpan={2}>
          <HeaderStaker
            label="Total Stake"
            value={
              totalStake
                ? `${formatBalance(totalStake, tokenDecimal || 18)} TKA`
                : "0.0000 TKA"
            }
            icon={<CircleStackIcon width={16} height={16} />}
          />
        </GridItem>
        <GridItem colSpan={2}>
          <HeaderStaker
            label="Locking Period"
            value={
              lockingPeriod
                ? `${formatLockingPeriod(lockingPeriod)} Days`
                : "0 Days"
            }
            icon={<CalendarIcon width={16} height={16} />}
          />
        </GridItem>
        <GridItem colSpan={2}>
          <HeaderStaker
            label="Your staked Amount"
            value={
              userStakeData?.amount
                ? `${formatBalance(userStakeData?.amount, tokenDecimal || 18)} TKA`
                : "0.0000 TKA"
            }
            icon={<CircleStackIcon width={16} height={16} />}
          />
        </GridItem>

        <GridItem
          rowSpan={{
            base: 24,
            mdl: 16,
          }}
          colSpan={2}
        >
          <FormStakerUI
            title="Stake"
            subTitle="Enter Stake Amount"
            labelButton="stake"
          />
        </GridItem>
        <GridItem
          rowSpan={{
            base: 24,
            mdl: 16,
          }}
          colSpan={2}
        >
          <FormStakerUI
            type="unstake"
            title="Withdraw"
            subTitle="Your available balance"
            labelButton="withdraw"
          />
        </GridItem>
        <GridItem
          rowSpan={{
            base: 20,
            mdl: 16,
          }}
          colSpan={2}
        >
          <RewardUI userRewad={userReward} />
        </GridItem>
      </Grid>
    </>
  );
};

export default StakerUI;
