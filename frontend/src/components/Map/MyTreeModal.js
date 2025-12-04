import {
  Button,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { EditableWithButtons } from "components/Map/EditableWithButtons";
import { FaTrash } from "react-icons/fa";
import { deleteTree, renameTree, water } from "services/api";
import {
  calcNeedsWateringStatus,
  getWateredColor,
  calcAllowedWatering,
  toastSuccess,
  toastError,
} from "util/helpers";
import { greekLabels } from "util/language";
import { DeleteTreeModal } from "./DeleteTreeModal";
import { useEffect, useState } from "react";
import { fetchTreeInfoAndNickname } from "./mapService";

export function MyTreeModal({
  isMyTreeOpen,
  onMyTreeClose,
  auth,
  setSourceData,
  idOfTree,
}) {
  const [treeInfo, setTreeInfo] = useState(null);
  const toast = useToast();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  useEffect(() => {
    if (!isMyTreeOpen) return;

    fetchTreeInfoAndNickname(idOfTree, auth)
      .then(({ info, nickname }) => {
        info.needsWateringStatus = calcNeedsWateringStatus(
          info.lastWateredDate
        );
        info.isAllowedWatering = calcAllowedWatering(info.lastWateredDate);
        if (nickname) info.name = nickname;

        setTreeInfo(info);
      })
      .catch((error) => {
        toastError(toast, error);
      });
  }, [auth, idOfTree, toast, isMyTreeOpen]);

  async function renameTreeHandler(name) {
    renameTree(auth.token, idOfTree, name)
      .then(() => {
        setTreeInfo((info) => {
          info.name = name;
          return info;
        });
        toastSuccess(toast, greekLabels.SUCCESSFUL_TREE_RENAME);
      })
      .catch((error) => {
        toastError(toast, error);
      });
  }

  async function waterHandler() {
    onMyTreeClose();
    water(auth.token, idOfTree)
      .then(() => {
        toastSuccess(toast, greekLabels.TREE_WATERED_SUCCESSFULLY);
      })
      .catch((error) => {
        toastError(toast, error);
      });
  }

  async function deleteHandler() {
    deleteTree(auth.token, idOfTree)
      .then(() => {
        setSourceData((currentData) => {
          const newSourceData = currentData.map((tree) => {
            if (tree.properties.id === idOfTree) {
              tree.properties.owner = null;
            }
            return tree;
          });
          return newSourceData;
        });
        onMyTreeClose();
        toastSuccess(toast, greekLabels.TREE_DELETED);
      })
      .catch((error) => {
        toastError(toast, error);
      });

    onDeleteClose();
  }

  function onMyTreeCloseClearTreeInfo() {
    setTreeInfo(null);
    onMyTreeClose();
  }

  return (
    <>
      {!treeInfo ? (
        <></>
      ) : (
        <>
          <Modal
            isOpen={isMyTreeOpen}
            onClose={onMyTreeCloseClearTreeInfo}
            isCentered
          >
            <ModalOverlay />
            <ModalContent w="95%">
              <ModalCloseButton />
              <ModalHeader>{treeInfo?.address}</ModalHeader>
              <ModalBody py={0}>
                <Stack>
                  <EditableWithButtons
                    defaultValue={treeInfo.name}
                    onSubmit={renameTreeHandler}
                    textFontSize="2xl"
                  />

                  <Text fontWeight="bold">
                    {greekLabels.LAST_WATERED}{" "}
                    <Text
                      as="span"
                      color={getWateredColor(treeInfo?.needsWateringStatus)}
                    >
                      {treeInfo?.needsWateringStatus}
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
                <HStack flex="1" justify="space-between">
                  <IconButton
                    icon={<FaTrash />}
                    aria-label="Delete tree"
                    onClick={onDeleteOpen}
                  />
                  <Button
                    isDisabled={!treeInfo?.isAllowedWatering}
                    colorScheme="blue"
                    onClick={waterHandler}
                  >
                    {treeInfo?.isAllowedWatering
                      ? greekLabels.WATER_TREE
                      : greekLabels.WATERED_RECENTLY}
                  </Button>
                </HStack>
              </ModalFooter>
            </ModalContent>
          </Modal>

          <DeleteTreeModal
            isDeleteOpen={isDeleteOpen}
            onDeleteClose={onDeleteClose}
            deleteHandler={deleteHandler}
          />
        </>
      )}
    </>
  );
}
