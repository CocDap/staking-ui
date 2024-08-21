import HomePage from "@/app/(landing)/(homepage)/HomePage";
import { Flex } from "@chakra-ui/react";
import Image from "next/image";

export default function Home() {
  return (
    <Flex direction='column' minHeight='100vh'>
      <HomePage/>
    </Flex>
  );
}
