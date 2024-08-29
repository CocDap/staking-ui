'use client'
import { StakingDataUserStakeData } from '@/contracts/types/staking';
import useContractQuery from '@/hooks/useContractQuery';
import usePsp22Contract from '@/hooks/usePsp22Contract';
import useStakingContract from '@/hooks/useStakingContract';
import useWatchContractEvent from '@/hooks/useWatchContractEvent';
import { useWalletContext } from '@/providers/WalletProvider';
import { formatBalance, shortenAddress } from '@/utils/string';
import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import { toast } from 'react-toastify';


// Define the types for the context
interface TokenContextProps {
  tokenDecimal: number | undefined;
  tokenSymbol: string | undefined;
  balanceOfPsp22: bigint | undefined;
  totalStake: bigint | undefined;
  userStakeData: StakingDataUserStakeData | undefined;
  lockingPeriod: bigint | undefined;
  userReward:bigint | undefined;
  refreshBalanceOfPsp22: () => void;
  refreshTotalStake: () => void;
  refreshUserStakeData:() => void;
  refreshUserReward: () => void;
}

// Create the context with default values
const TokenContractContext = createContext<TokenContextProps>({
  tokenDecimal: undefined,
  tokenSymbol: undefined,
  balanceOfPsp22: undefined,
  totalStake: undefined,
  userStakeData: undefined,
  lockingPeriod: undefined,
  userReward: undefined,
  refreshBalanceOfPsp22: () => {},
  refreshTotalStake: () => {},
  refreshUserStakeData: () => {},
  refreshUserReward: () => {},
});

// Provider component to wrap around the components that need access to the context
interface TokenContractWrapProps {
  children: ReactNode; 
}

export const TokenContractWrap: React.FC<TokenContractWrapProps> = ({ children }) => {

  const stakingContract = useStakingContract();
  const psp22Contract = usePsp22Contract();
    const { selectedAccount } = useWalletContext();
   
  const { data: tokenDecimal } = useContractQuery({
    contract: psp22Contract,
    fn: 'psp22MetadataTokenDecimals',
  });

  const { data: tokenSymbol } = useContractQuery({
    contract: psp22Contract,
    fn: 'psp22MetadataTokenSymbol',
  });



  const {
    data: balanceOfPsp22,
    isLoading: isLoadingBalanceOfPsp22,
    refresh: refreshBalanceOfPsp22,
  } = useContractQuery({
    contract: psp22Contract,
    fn: "psp22BalanceOf",
    args: [selectedAccount ? selectedAccount.address : ""],
  });
  


   
  const {
    data: totalStake,
    isLoading: totalStakeIsLoading,
    refresh: refreshTotalStake,
  } = useContractQuery({
    contract: stakingContract,
    fn: "getTotalStaked",
  });

  const {
    data: userStakeData,
    isLoading: userStakeDataIsLoading,
    refresh: refreshUserStakeData,
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

  const {
    data: userReward,
    refresh: refreshUserReward
  } = useContractQuery({
    contract: stakingContract,
    fn: "getUserReward",
    args: [selectedAccount?.address || ""],
  });




// Listen to Unstake event from system events 

useWatchContractEvent(
  stakingContract,
  "Unstake",
  useCallback((events) => {
    events.forEach((stakingEvent) => {
      const {
        name,
        data: { user,amount },
      } = stakingEvent;

      console.log(
        `Found a ${name} event sent from: ${user?.address()}, message: ${formatBalance(amount, tokenDecimal || 18)}  `
      );

      toast.info(
        <div>
          <p>
            Found a <b>{name}</b> event
          </p>
          <p style={{ fontSize: 12 }}>
            To:{" "}
            <b>
              {shortenAddress(user?.address())} claim {formatBalance(amount, tokenDecimal || 18)} ({tokenSymbol})
            </b>
          </p>
        </div>
      );

      const storedEvent = localStorage.getItem("myEvents");
        let myEvent = [];
        if (storedEvent) {
          // Nếu đã có array, chuyển đổi chuỗi JSON trở lại thành array
          myEvent = JSON.parse(storedEvent);
        }
        const stakingData = {
          address: user.address(),
          amount: formatBalance(amount, tokenDecimal || 18),
          method: "Unstake",
        };

        myEvent.push(stakingData);

        localStorage.setItem("myEvents", JSON.stringify(myEvent));

      });

  }, [tokenDecimal,tokenSymbol])
);


// Listen to Stake event from system events

useWatchContractEvent(
  stakingContract,
  "Stake",
  useCallback((events) => {
    events.forEach((stakingEvent) => {
      const {
        name,
        data: { user,amount },
      } = stakingEvent;

      console.log(
        `Found a ${name} event sent from: ${user?.address()}, message: ${formatBalance(amount, tokenDecimal || 18)}  `
      );

      toast.info(
        <div>
          <p>
            Found a <b>{name}</b> event
          </p>
          <p style={{ fontSize: 12 }}>
            To:{" "}
            <b>
              {shortenAddress(user?.address())} claim {formatBalance(amount, tokenDecimal || 18)} ({tokenSymbol})
            </b>
          </p>
        </div>
      );

      const storedEvent = localStorage.getItem("myEvents");
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

  }, [tokenDecimal,tokenSymbol])
);


useWatchContractEvent(
  stakingContract,
  "Claim",
  useCallback((events) => {
    events.forEach((stakingEvent) => {
      const {
        name,
        data: { user,reward },
      } = stakingEvent;

      console.log(
        `Found a ${name} event sent from: ${user?.address()}, message: ${formatBalance(reward, tokenDecimal || 18)}  `
      );

      toast.info(
        <div>
          <p>
            Found a <b>{name}</b> event
          </p>
          <p style={{ fontSize: 12 }}>
            To:{" "}
            <b>
              {shortenAddress(user?.address())} claim {formatBalance(reward, tokenDecimal || 18)} ({tokenSymbol})
            </b>
          </p>
        </div>
      );

      const storedEvent = localStorage.getItem("myEvents");
        let myEvent = [];
        if (storedEvent) {
          // Nếu đã có array, chuyển đổi chuỗi JSON trở lại thành array
          myEvent = JSON.parse(storedEvent);
        }
        const stakingData = {
          address: user.address(),
          amount: formatBalance(reward, tokenDecimal || 18),
          method: "Reward",
        };

        myEvent.push(stakingData);

        localStorage.setItem("myEvents", JSON.stringify(myEvent));

      });

  }, [tokenDecimal,tokenSymbol])
);


  return (
    <TokenContractContext.Provider value={{ userReward, refreshUserReward, tokenDecimal, tokenSymbol, balanceOfPsp22, refreshBalanceOfPsp22,userStakeData,lockingPeriod,totalStake, refreshTotalStake,refreshUserStakeData }}>
      {children}
    </TokenContractContext.Provider>
  );
};

// Custom hook to use the TokenContext
export const useTokenContract = () => useContext(TokenContractContext);
