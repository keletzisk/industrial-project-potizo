import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { adopt, getTreeInfo } from "services/api";
import {
  calcNeedsWateringStatus,
  getWateredColor,
  toastError,
  toastSuccess,
} from "util/helpers";
import { greekLabels } from "util/language";

export function AdoptModal({
  isAdoptOpen,
  onAdoptClose,
  auth,
  setSourceData,
  idOfTree,
}) {
  const [treeInfo, setTreeInfo] = useState(null);
  const toast = useToast();

  useEffect(() => {
    if (!isAdoptOpen) return;

    getTreeInfo(auth.token, idOfTree)
      .then((info) => {
        setTreeInfo(info);
      })
      .catch((error) => {
        toastError(toast, error);
      });
  }, [auth, idOfTree, toast, isAdoptOpen]);

  async function handleAdopt() {
    onAdoptClose();

    adopt(auth.token, idOfTree)
      .then(() => {
        setSourceData((currentData) => {
          let arr = currentData.map((el) => {
            let newElement = { ...el };
            if (el.properties.id === idOfTree) {
              newElement.properties.owner = auth.userId;
            }
            return newElement;
          });
          return arr;
        });

        toastSuccess(toast, greekLabels.CONGRATULATIONS);
      })
      .catch((error) => {
        toastError(toast, error);
      });
  }

  function onAdoptCloseCloseClearTreeInfo() {
    setTreeInfo(null);
    onAdoptClose();
  }

  return (
    <>
      {!treeInfo ? (
        <></>
      ) : (
        <Modal
          isOpen={isAdoptOpen}
          onClose={onAdoptCloseCloseClearTreeInfo}
          isCentered
        >
          <ModalOverlay />
          <ModalContent w="95%">
            <ModalCloseButton />

            <ModalHeader>{treeInfo?.address}</ModalHeader>
            <ModalBody>
              <Stack>
                <Text fontWeight="bold" fontSize="2xl">
                  {treeInfo?.name}
                </Text>

                <Text fontWeight="bold">
                  {greekLabels.LAST_WATERED}{" "}
                  <Text
                    as="span"
                    color={getWateredColor(
                      calcNeedsWateringStatus(treeInfo?.lastWateredDate)
                    )}
                  >
                    {calcNeedsWateringStatus(treeInfo?.lastWateredDate)}
                  </Text>
                </Text>

                <Text>
                  <Text as="span" fontWeight="bold">
                    {greekLabels.TYPE}{" "}
                  </Text>
                  {treeInfo?.type}
                </Text>
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="green" onClick={handleAdopt}>
                {greekLabels.ADOPT_IT}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
