import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { greekLabels } from "util/language";

export function DeleteTreeModal({
  isDeleteOpen,
  onDeleteClose,
  deleteHandler,
}) {
  return (
    <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} isCentered>
      <ModalOverlay />
      <ModalContent w="95%">
        <ModalCloseButton />
        <ModalHeader>{greekLabels.ARE_YOU_SURE_MSG}</ModalHeader>
        <ModalBody>
          <Flex justify="end">
            <Button colorScheme="orange" onClick={deleteHandler}>
              {greekLabels.DELETE_FROM_MY_TREES}
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
