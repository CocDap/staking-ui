"use client";
import { Box, Container, Flex, Text } from "@chakra-ui/react";
import React from "react";
import AccountSelection from "@/components/AccountSelection";
import WalletSelection from "@/components/dialog/WalletSelection";
import { useWalletContext } from "@/providers/WalletProvider";
import NetworkSelection from "@/components/shared/NetworkSelection";
import Link from "next/link";
import MenuNavigate from "@/components/shared/MainHeader/MenuNavigate";
import Image from "next/image";
import FaucetButton from "@/components/shared/MainHeader/FaucetButton";
import { DrawerMenu } from "@/components/shared/MainHeader/DrawerMenu";

export default function MainHeader() {
  const { injectedApi } = useWalletContext();

  return (
    <Box borderBottom={1} borderStyle="solid" borderColor="gray.200">
      <Container
        maxWidth="full"
        px={4}
        mx="auto"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap={4}
        h={16}
      >
        <DrawerMenu/>
       <MenuNavigate/>
        <Flex gap={2}>
        <NetworkSelection />

          {injectedApi ? <AccountSelection /> : <WalletSelection />}
         
        </Flex>
      </Container>
    </Box>
  );
}
