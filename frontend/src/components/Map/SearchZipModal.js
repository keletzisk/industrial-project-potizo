import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { greekLabels } from "util/language";

export function SearchZipModal({
  isSearchOpen,
  onSearchClose,
  setZip,
  zip,
  handleZipCodeSearch,
}) {
  return (
    <Modal isOpen={isSearchOpen} onClose={onSearchClose} isCentered>
      <ModalOverlay />
      <ModalContent w="95%">
        <ModalCloseButton />
        <ModalHeader>Εύρεση δέντρων σε Ταχυδρομικό Κώδικα</ModalHeader>
        <ModalBody>
          <Input
            type="text"
            placeholder="Ταχυδρομικός κώδικας"
            pattern="[0-9]*"
            value={zip}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length > 5) return;
              const onlyNumbersValue = value.replace(/[^\d]/g, "");
              setZip(onlyNumbersValue);
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            isDisabled={zip.length === 0}
            colorScheme="green"
            onClick={handleZipCodeSearch}
          >
            {greekLabels.GO_THERE}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
