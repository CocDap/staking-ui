import { ADDRESS_STAKING } from '@/contracts/pop-network-testnet';
import stakingMeta from '@/contracts/staking/staking.json';
import { StakingContractApi } from '@/contracts/types/staking';
import useContract from '@/hooks/useContract';

export default function useStakingContract() {
  const { contract } = useContract<StakingContractApi>(stakingMeta as any, ADDRESS_STAKING);

  return contract;
}
