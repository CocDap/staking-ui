import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Input,
} from "@chakra-ui/react";
import React from "react";

const StakeDialog = ({
  isOpen,
  cancelRef,
  onClose,
}: {
  isOpen: boolean;
  cancelRef: React.RefObject<HTMLButtonElement>;
  onClose: () => void;
}) => {
  return (
    <AlertDialog
      isCentered
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent
          backgroundColor={"#F0FCFF"}
          padding={"8"}
          rounded={"xl"}
        >
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Stake Token
          </AlertDialogHeader>

          <AlertDialogBody>
            <Input
              padding={"6"}
              rounded={"40px"}
              borderColor={"#89d7e9"}
              placeholder="0 TOKEN"
              type="number"
            />
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button
              paddingY={"4"}
              paddingX={"6"}
              rounded={"40px"}
              shadow={"lg"}
              ref={cancelRef}
              onClick={onClose}
            >
              CANCEL
            </Button>
            <Button
              paddingY={"4"}
              paddingX={"6"}
              rounded={"40px"}
              shadow={"lg"}
              backgroundColor="#C8F5FF"
              onClick={onClose}
              ml={3}
            >
              STAKE
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default StakeDialog;
