"use client";
import MainBoard from "@/components/MainBoard";
import StakingBoardForm from "@/components/StakingBoardForm";

import WelcomeBoard from "@/components/WelcomeBoard";
import { useWalletContext } from "@/providers/WalletProvider";
import {
  Box,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";

import React from "react";

const HomePage = () => {
  const { injectedApi } = useWalletContext();
  return (
    <Box maxWidth='container.md' mx='auto' my={4} px={4} flex={1} w='full'>
         <Tabs>
      <TabList>
        <Tab>Wallet</Tab>
        <Tab>Staking</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <Box
            maxWidth="container.md"
            mx="auto"
            my={4}
            px={4}
            flex={1}
            w="full"
          >
            {!!injectedApi ? <MainBoard /> : <WelcomeBoard />}
          </Box>
        </TabPanel>
        <TabPanel>
        <Box
            maxWidth="container.md"
            mx="auto"
            my={4}
            px={4}
            flex={1}
            w="full"
          >
             {!!injectedApi ?  <StakingBoardForm /> : <WelcomeBoard />}
            
   
          </Box>
         
        </TabPanel>
      </TabPanels>
    </Tabs>
    </Box>
   
  );
};

export default HomePage;
