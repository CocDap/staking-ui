import useStakeForm from '@/hooks/useStakeForm'
import { formatBalance } from '@/utils/string'
import { Button, Divider, Flex, Text } from '@chakra-ui/react'
import React from 'react'

const RewardUI = ({userRewad}: {userRewad: bigint | undefined}) => {
  const {handClaimReward, claimRewardTx} = useStakeForm()

  return (
    <Flex
    border={"8px solid #89d7e9"}
    backgroundColor={"#F0FCFF"}
    rounded={"40px"}
    padding={8}
    height={"full"}
    flexDirection={"column"}
    justifyContent={"space-between"}
  >
    <Flex flexDirection={"column"} gap={"2"}>
      <Text fontWeight={"bold"} fontSize={28}  textColor={"#026262"}>
        Reward
      </Text>
      <Divider orientation="horizontal" my={4} borderColor={"#026262"} />
      <Text fontSize={'14px'}>Your Reward </Text>
      <Text fontWeight={'bold'} fontSize={28}> {userRewad ? `${formatBalance(userRewad,18)} TKA` : '0.0000 TKA'}</Text>

   
    </Flex>
    <Button
      width={"full"}
      paddingX={"8"}
      paddingY={"6"}
      rounded={"full"}
      shadow={"lg"}
      _hover={{
        backgroundColor: "#89d7e9",
      }}
      backgroundColor={"#C8F5FF"}
      textColor={"#026262"}
      textTransform={'uppercase'}
      onClick={handClaimReward}
      isLoading={claimRewardTx.isInProgress}
    >
        claim
    </Button>
  </Flex>
  )
}

export default RewardUI