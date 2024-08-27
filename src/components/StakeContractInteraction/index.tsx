import StakeDialog from "@/components/StakeContractInteraction/StakeDialog";
import { Box, Button, Text, useDisclosure } from "@chakra-ui/react";
import React, { useRef } from "react";

const StakeContractInteraction = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef(null)
  return (
    <Box
      border={"8px solid #89d7e9"}
      backgroundColor={"#F0FCFF"}
      width={"100%"}
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      gap={"12"}
      paddingY={"8"}
      paddingX={"20"}
      shadow={"lg"}
      textColor={"#026262"}
      rounded={"xl"}
      textAlign={"center"}
    >
      <Box>
        <Text fontWeight={"600"} fontSize={"2xl"}>
          Staker Contract
        </Text>
        <Text>01213</Text>
      </Box>

      <Box
        width={"100%"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Box>
          <Text fontWeight={"600"} fontSize={"xl"}>
            Time Left
          </Text>
          <Text>01213</Text>
        </Box>
        <Box>
          <Text fontWeight={"600"} fontSize={"xl"}>
            You Staked
          </Text>
          <Text>01213</Text>
        </Box>
      </Box>

      <Box>
        <Text fontWeight={"600"} fontSize={"xl"}>
          Total Staked
        </Text>
        <Text>01213</Text>
      </Box>

      <Box display={"flex"} flexDirection={"column"} gap={"8"}>
        <Box display={"flex"} gap={"8"}>
          <Button
           paddingX={"8"}
           paddingY={"6"}
           rounded={"full"}

            shadow={"lg"}
            backgroundColor={"#C8F5FF"}
            textColor={"#026262"}
          >
            EXECUTE!
          </Button>
          <Button
            paddingX={"8"}
            paddingY={"6"}

            rounded={"full"}

            shadow={"lg"}
            backgroundColor={"#C8F5FF"}
            textColor={"#026262"}
          >
            WITHDRAW
          </Button>
        </Box>

        <Button
          paddingX={"8"}
          paddingY={"6"}
          rounded={"full"}
          shadow={"lg"}
          backgroundColor={"#C8F5FF"}
          textColor={"#026262"}
          onClick={onOpen}
        >
          STAKE TOKEN
        </Button>
      </Box>

      <StakeDialog isOpen={isOpen} onClose={onClose} cancelRef={cancelRef}/>
      
    </Box>
  );
};

export default StakeContractInteraction;
