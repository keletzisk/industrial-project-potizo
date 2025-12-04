import { useRef } from "react";
import {
  Button,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { MdAlternateEmail } from "react-icons/md";
import { greekLabels } from "util/language";

export function ForgotPasswordModal({
  isResetOpen,
  onResetClose,
  handleEmailInputChange,
  confirmResetPasswordHandler,
}) {
  const initialResetRef = useRef();

  return (
    <Modal
      isOpen={isResetOpen}
      onClose={onResetClose}
      isCentered
      initialFocusRef={initialResetRef}
    >
      <ModalOverlay />
      <ModalContent w="95%">
        <ModalHeader>{greekLabels.FORGOT_PASSWORD}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={MdAlternateEmail} color="gray.600" />
            </InputLeftElement>
            <Input
              ref={initialResetRef}
              type="email"
              placeholder={greekLabels.WRITE_YOUR_EMAIL}
              onChange={handleEmailInputChange}
            />
          </InputGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            mr={3}
            colorScheme="error"
            variant="outline"
            onClick={onResetClose}
          >
            {greekLabels.CANCEL_MSG}
          </Button>
          <Button colorScheme="green" onClick={confirmResetPasswordHandler}>
            {greekLabels.CONFIRM}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
