import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  FormControl,
  FormErrorMessage,
  Input,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Define Zod schema for validation
const schema = z.object({
  numberToken: z.coerce.number().min(3),
});

// Type for form data
type FormData = z.infer<typeof schema>;

const StakeDialog = ({
  isOpen,
  cancelRef,
  onClose,
  handApproveToken
}: {
  isOpen: boolean;
  cancelRef: React.RefObject<HTMLButtonElement>;
  onClose: () => void;
  handApproveToken:  (amountToSend: string) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    console.log(data);
    await handApproveToken(data.numberToken.toString()); // Approve token first
   
  };

 
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <AlertDialogBody>
              <FormControl isInvalid={!!errors.numberToken}>
                <Input
                  id="numberToken"
                  padding={"6"}
                  rounded={"40px"}
                  borderColor={"#89d7e9"}
                  placeholder="0 TOKEN"
                  type="number"
                  {...register("numberToken")}
                />
                <FormErrorMessage>
                  {errors.numberToken?.message}
                </FormErrorMessage>
              </FormControl>

              {/* <Input
              padding={"6"}
              rounded={"40px"}
              borderColor={"#89d7e9"}
              placeholder="0 TOKEN"
              type="number"
            /> */}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                paddingY={"4"}
                paddingX={"6"}
                rounded={"40px"}
                shadow={"lg"}
                ref={cancelRef}
                onClick={onClose}
                type="button"
              >
                CANCEL
              </Button>
          
              <Button
                paddingY={"4"}
                paddingX={"6"}
                rounded={"40px"}
                shadow={"lg"}
                backgroundColor="#C8F5FF"
      
                ml={3}
                type="submit"
              >
                STAKE
              </Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default StakeDialog;
