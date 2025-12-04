import { greekLabels } from "../../util/language";
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

export function ResetPasswordModal({
  isResetOpen,
  onResetClose,
  resetHandler,
}) {
  return (
    <Modal isOpen={isResetOpen} onClose={onResetClose} isCentered>
      <ModalOverlay />
      <ModalContent w="95%">
        <ModalCloseButton />
        <ModalHeader>{greekLabels.RESET_PASSWORD}</ModalHeader>
        <ModalBody>
          <Text>{greekLabels.PASSWORD_CHANGE_QUESTION}</Text>
        </ModalBody>
        <ModalFooter>
          <Flex justify="end">
            <Button colorScheme="green" onClick={resetHandler}>
              {greekLabels.CONFIRM_RESET}
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
