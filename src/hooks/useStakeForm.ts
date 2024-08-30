import useBalance from "@/hooks/useBalance";
import useContractTx from "@/hooks/useContractTx";
import usePsp22Contract from "@/hooks/usePsp22Contract";
import useStakingContract from "@/hooks/useStakingContract";
import { useWalletContext } from "@/providers/WalletProvider";
import { txToaster } from "@/utils/txToaster";
import { toast } from "react-toastify";
import { ADDRESS_STAKING } from "@/contracts/psp22/pop-network-testnet";
import { useTokenContract } from "@/providers/TokenContractWrap";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";

// Define Zod schema for validation
export const schema = z.object({
  numberToken: z.coerce.number().min(3),
});

// Type for form data
export type FormData = z.infer<typeof schema>;

export default function useStakeForm() {
  const stakingContract = useStakingContract();
  const psp22Contract = usePsp22Contract();

  const { selectedAccount } = useWalletContext();
  const balance = useBalance(selectedAccount?.address);
  const stakingTx = useContractTx(stakingContract, "stake");
  const unStakingTx = useContractTx(stakingContract, "withdraw");
  const claimRewardTx = useContractTx(stakingContract, "claimReward");


  const approveTx = useContractTx(psp22Contract, "psp22Approve");
  const {
    refreshBalanceOfPsp22,
    balanceOfPsp22,
    tokenDecimal,
    refreshTotalStake,
    refreshUserStakeData,
    refreshUserReward
  } = useTokenContract();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmitStake = async (data: FormData) => {
    await handApproveToken(data.numberToken.toString());
  };

  const onSubmitUnStake = async (data: FormData) => {
    await handUnStakeToken(data.numberToken.toString());
  };

  const handApproveToken = async (amountToSend: string) => {
    if (!psp22Contract) return;

    if (!selectedAccount) {
      toast.info("Please connect to your wallet");
      return;
    }

    if (
      balanceOfPsp22 &&
      balanceOfPsp22 <
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
      refreshTotalStake();
      refreshUserStakeData();
      refreshBalanceOfPsp22();
      refreshUserReward();
      setValue("numberToken", 0);
    }
  };

  const handUnStakeToken = async (amountToSend: string) => {
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
      refreshTotalStake();
      refreshUserStakeData();
      refreshBalanceOfPsp22();
      refreshUserReward();
      setValue("numberToken", 0);
    }
  };


  const handClaimReward = async () => {
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
      await claimRewardTx.signAndSend({
        
        callback: ({ status }) => {
          console.log(status);

          toaster.updateTxStatus(status);
        },
      });
    } catch (e: any) {
      console.error(e, e.message);
      toaster.onError(e);
    } finally {
      refreshUserReward()
      refreshBalanceOfPsp22()
    }
  };

  

  return {
    register,
    handleSubmit,
    onSubmitStake,
    errors,
    onSubmitUnStake,
    handClaimReward,
    claimRewardTx,
    stakingTx,
    unStakingTx,
    stakingContract
  };
}
