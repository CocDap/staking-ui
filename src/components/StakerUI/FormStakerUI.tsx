"use client";
import useStakeForm from "@/hooks/useStakeForm";
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  Text,
} from "@chakra-ui/react";
import React from "react";


const FormStakerUI = ({
  type = "stake",
  title,
  subTitle,
  labelButton,
}: {
  type?: string;
  title: string;
  subTitle: string;
  labelButton: string;
}) => {
  const {
    register,
    handleSubmit,
    onSubmitStake,
    onSubmitUnStake,
    errors,
    stakingTx,
    unStakingTx,
  } = useStakeForm();

  return (
    <form
      onSubmit={
        type === "stake"
          ? handleSubmit(onSubmitStake)
          : handleSubmit(onSubmitUnStake)
      }
      style={{
        width: "100%",
        height: "100%",
      }}
    >
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
          <Text fontWeight={"bold"} fontSize={28} textColor={"#026262"}>
            {title || "Stake"}
          </Text>
          <Divider orientation="horizontal" my={4} borderColor={"#026262"} />
          <Text fontSize={"14px"}>{subTitle || "Enter Stake Amount"}</Text>

          <FormControl isInvalid={!!errors.numberToken}>
            <Input
              id="numberToken"
              focusBorderColor="#89d7e9"
              _focus={{
                boxShadow: "none", // Removes the default focus ring shadow
              }}
              padding={"6"}
              rounded={"40px"}
              borderColor={"#89d7e9"}
              placeholder="0.00"
              type="number"
              fontWeight={"800"}
              _placeholder={{
                fontWeight: "800",
              }}
              {...register("numberToken")}
            />
            <FormErrorMessage>{errors.numberToken?.message}</FormErrorMessage>
          </FormControl>
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
          type="submit"
          textTransform={"uppercase"}
          // onClick={onSubmit}
          isLoading={
            type === "stake" ? stakingTx.isInProgress : unStakingTx.isInProgress
          }
        >
          {labelButton || " STAKE"}
        </Button>
      </Flex>
    </form>
  );
};

export default FormStakerUI;
