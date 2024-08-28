'use client'
import useContractQuery from '@/hooks/useContractQuery';
import usePsp22Contract from '@/hooks/usePsp22Contract';
import { useWalletContext } from '@/providers/WalletProvider';
import React, { createContext, useContext, ReactNode } from 'react';


// Define the types for the context
interface TokenContextProps {
  tokenDecimal: number | undefined;
  tokenSymbol: string | undefined;
  balanceOf: bigint | undefined;
  refreshBalanceOf: () => void;
}

// Create the context with default values
const TokenContractContext = createContext<TokenContextProps>({
  tokenDecimal: undefined,
  tokenSymbol: undefined,
  balanceOf: undefined,
  refreshBalanceOf: () => {},
});

// Provider component to wrap around the components that need access to the context
interface TokenContractWrapProps {
  children: ReactNode; 
}

export const TokenContractWrap: React.FC<TokenContractWrapProps> = ({ children }) => {

    const contract = usePsp22Contract();
    const { selectedAccount } = useWalletContext();
   
  const { data: tokenDecimal } = useContractQuery({
    contract,
    fn: 'psp22MetadataTokenDecimals',
  });

  const { data: tokenSymbol } = useContractQuery({
    contract,
    fn: 'psp22MetadataTokenSymbol',
  });



  const {
    data: balanceOf,
    isLoading,
    refresh: refreshBalanceOf,
  } = useContractQuery({
    contract,
    fn: "psp22BalanceOf",
    args: [selectedAccount ? selectedAccount.address : ""],
  });
  

  return (
    <TokenContractContext.Provider value={{ tokenDecimal, tokenSymbol, balanceOf, refreshBalanceOf }}>
      {children}
    </TokenContractContext.Provider>
  );
};

// Custom hook to use the TokenContext
export const useTokenContract = () => useContext(TokenContractContext);
