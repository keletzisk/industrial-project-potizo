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

export function DeleteModal({ isDeleteOpen, onDeleteClose, deleteHandler }) {
  return (
    <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} isCentered>
      <ModalOverlay />
      <ModalContent w="95%">
        <ModalCloseButton />
        <ModalHeader>{greekLabels.DELETE_ACCOUNT}</ModalHeader>
        <ModalBody>
          <Text>{greekLabels.DELETE_ACCOUNT_QUESTION}</Text>
        </ModalBody>
        <ModalFooter>
          <Flex justify="end">
            <Button colorScheme="orange" onClick={deleteHandler}>
              {greekLabels.CONFIRM_DELETE}
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
