import { menuLinks } from "@/components/shared/MainHeader/MenuNavigate";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
Bars4Icon
  } from "@heroicons/react/24/outline";
import React from "react";

export function DrawerMenu() {
  const pathName = usePathname();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef(null);

  return (
    <Box   display={{
        lg: "none",
        sm: "flex",
      }}>
      <Button ref={btnRef}  onClick={onOpen} padding={0}>
       <Bars4Icon height={24} width={24}/>
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <br />
          </DrawerHeader>

          <DrawerBody display={"flex"} flexDirection={"column"} gap={"2"}>
            {menuLinks.map((link) => (
              <Link key={link.label} href={link.href}>
                <Flex
                  alignItems={"center"}
                  justifyContent={"start"}
                  gap={2}
                  width={"full"}
                  paddingY={2}
                  paddingX={4}
                  transition={"all 0.3s ease"}
                  _hover={{
                    shadow: "md",
                    backgroundColor: "#C8F5FF",
                  }}
                  backgroundColor={pathName === link.href ? "#89d7e9" : ""}
                  cursor={"pointer"}
                  flexShrink={0}
                >
                  {link.icon}
                  <Text textColor={"#026262"} fontWeight={pathName === link.href ? "bold" : "semibold"} >{link.label}</Text>
                </Flex>
              </Link>
            ))}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
