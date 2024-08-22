"use client";
import { Box, Container, Flex } from "@chakra-ui/react";
import React from "react";
import AccountSelection from "@/components/AccountSelection";
import WalletSelection from "@/components/dialog/WalletSelection";
import { useWalletContext } from "@/providers/WalletProvider";
import NetworkSelection from "@/components/shared/NetworkSelection";

export default function MainHeader() {
  const { injectedApi } = useWalletContext();

  return (
    <Box borderBottom={1} borderStyle="solid" borderColor="gray.200">
      <Container
        maxWidth="container.md"
        px={4}
        mx="auto"
        display="flex"
        justifyContent="end"
        alignItems="center"
        gap={4}
        h={16}
      >
        <Flex gap={2}>
          {injectedApi ? <AccountSelection /> : <WalletSelection />}
        </Flex>
        <NetworkSelection />
      </Container>
    </Box>
  );
}
