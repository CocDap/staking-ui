"use client";
import MainBoard from "@/components/MainBoard";
import WelcomeBoard from "@/components/WelcomeBoard";
import { useWalletContext } from "@/providers/WalletProvider";
import {
  Box,
} from "@chakra-ui/react";

import React from "react";

const HomePage = () => {
  const { injectedApi } = useWalletContext();
  return (
    <Box  display={'flex'} flexDirection={'column'} maxWidth='container.md' mx='auto' my={4} flex={1} w='full' minHeight='80vh' alignItems={'center'} justifyContent={'center'}>
       {!!injectedApi ? <MainBoard /> : <WelcomeBoard />}
    </Box>
   
  );
};

export default HomePage;
