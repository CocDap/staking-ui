"use client";
import { Box, Flex } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Staker UI",
    href: "/staker-ui",
    icon: "",
  },
  {
    label: "Stake Events",
    href: "",
    icon: "",
  },
];

const MenuNavigate = () => {
  const pathName = usePathname();
  console.log("🚀 ~ MenuNavigate ~ pathName:", pathName);

  return (
    <Flex gap={2} alignItems={"center"} justifyContent={"center"} textColor={"#026262"}>
      <Box position={"relative"} width={9} height={9} mr={8}>
        <Image
          fill
          sizes="100%"
          objectFit="contain"
          src="/stake-dapp.jpg"
          alt="logo"
        />
      </Box>
      {menuLinks.map((link) => (
        <Link href={link.href} key={link.label}>
          <Box
            fontWeight={pathName === link.href ? "bold" : "semibold"}
            paddingY={2}
            paddingX={4}
            rounded={"full"}
            transition={"all 0.3s ease"}
            _hover={{
              shadow: "md",
              backgroundColor: "#C8F5FF",
            }}
            backgroundColor={pathName === link.href ? "#89d7e9" : ""}
            fontSize={"14px"}
          >
            {link.label}
          </Box>
        </Link>
      ))}
    </Flex>
  );
};

export default MenuNavigate;
