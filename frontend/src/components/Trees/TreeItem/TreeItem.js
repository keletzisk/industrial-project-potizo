import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/auth-context";
import { useNavigate } from "react-router-dom";
import { greekLabels } from "../../../util/language";
import { typeToTreeInfoMap } from "../../../util/treeInfo";
import { DeleteTreeModal } from "components/Map/DeleteTreeModal";
import { useDisclosure } from "@chakra-ui/hooks";
import { useToast } from "@chakra-ui/toast";
import { deleteTree, getTreeNickName, water, renameTree } from "services/api";
import { EditableWithButtons } from "components/Map/EditableWithButtons";
import {
  Box,
  Text,
  Button,
  Divider,
  Flex,
  IconButton,
  HStack,
  Stack,
  Heading,
} from "@chakra-ui/react";
import { FaTrash, FaMapMarkedAlt } from "react-icons/fa";
import {
  calcAllowedWatering,
  calcNeedsWateringStatus,
  getWateredColor,
  toastError,
  toastSuccess,
} from "util/helpers";
import { STANDARD_ZOOM } from "util/constants";

const createLocation = (latitude, longitude) => {
  return {
    lat: latitude,
    lng: longitude,
  };
};

const TreeItem = ({ tree, setLoadedTrees }) => {
  const {
    id,
    lastWateredDate: initialLastWatered,
    type,
    name,
    address,
    latitude,
    longitude,
  } = tree;
  const toast = useToast();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [treeNickname, setTreeNickname] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [lastWateredDate, setLastWateredDate] = useState(initialLastWatered);
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  useEffect(() => {
    getTreeNickName(auth.token, id)
      .then((nickname) => {
        setTreeNickname(nickname);
        setIsLoading(false);
      })
      .catch((error) => {
        toastError(toast, error);
      });
  }, [auth.token, id, toast]);

  const waterHandler = async () => {
    water(auth.token, id)
      .then(() => {
        setLastWateredDate(Date.now());
        toastSuccess(toast, greekLabels.TREE_WATERED_SUCCESSFULLY);
      })
      .catch((error) => {
        toastError(toast, error);
      });
  };

  const deleteHandler = async () => {
    deleteTree(auth.token, id)
      .then(() => {
        setLoadedTrees((prevTrees) =>
          prevTrees.filter((tree) => tree.id !== id)
        );
        toastSuccess(toast, greekLabels.TREE_DELETED);
      })
      .catch((error) => {
        toastError(toast, error);
      });

    onDeleteClose();
  };

  const renameTreeHandler = async (new_nickname) => {
    renameTree(auth.token, id, new_nickname)
      .then(() => {
        setTreeNickname(new_nickname);
        toastSuccess(toast, greekLabels.SUCCESSFUL_TREE_RENAME);
      })
      .catch((error) => {
        toastError(toast, error);
      });
  };

  window.history.replaceState({}, document.title);

  const treeInfoOfType = typeToTreeInfoMap.get(type);

  const needsWateringStatus = calcNeedsWateringStatus(lastWateredDate);
  const isAllowedWatering = calcAllowedWatering(lastWateredDate);
  return (
    <Box p={2}>
      <DeleteTreeModal
        isDeleteOpen={isDeleteOpen}
        onDeleteClose={onDeleteClose}
        deleteHandler={deleteHandler}
      />
      <Stack
        p={4}
        borderRadius={6}
        boxShadow="1px 2px 8px rgba(0, 0, 0, 0.2)"
        gap={2}
      >
        {isLoading ? (
          <Text aria-label="Tree name" fontSize="2xl" fontWeight="bold">
            {name}
          </Text>
        ) : (
          <EditableWithButtons
            defaultValue={treeNickname || name}
            onSubmit={renameTreeHandler}
            textFontSize="2xl"
          />
        )}

        <Heading aria-label="Tree address" size="sm" color="green.400">
          {address}
        </Heading>

        <Text fontWeight="bold">
          {greekLabels.LAST_WATERED}{" "}
          <Text as="span" color={getWateredColor(needsWateringStatus)}>
            {needsWateringStatus}
          </Text>
        </Text>

        <HStack ml={1} my={1} justify="left">
          <IconButton
            aria-label="Go to map location"
            colorScheme="green"
            onClick={() => {
              navigate("/map", {
                state: {
                  coordinates: createLocation(latitude, longitude),
                  zoom: STANDARD_ZOOM,
                },
              });
            }}
            fontSize="1.3rem"
            icon={<FaMapMarkedAlt />}
          />
          <Button
            isDisabled={!isAllowedWatering}
            colorScheme="blue"
            onClick={waterHandler}
          >
            {isAllowedWatering
              ? greekLabels.WATER_TREE
              : greekLabels.WATERED_RECENTLY}
          </Button>
        </HStack>

        <Flex direction="column" mt={2}>
          <Text>
            <Text as="span" fontWeight="bold">
              {greekLabels.TYPE}{" "}
            </Text>
            {type}
          </Text>
          <Divider my={1} />
          {!treeInfoOfType ? (
            <Text>{greekLabels.NO_INFO_ON_TYPE}</Text>
          ) : (
            <>
              <Text>
                <Text as="span" fontWeight="bold">
                  {greekLabels.LATIN_NAME}:{" "}
                </Text>
                {treeInfoOfType.latinName}
              </Text>
              <Divider my={1} />
              <Text>
                <Text as="span" fontWeight="bold">
                  {greekLabels.FLOWERING}:{" "}
                </Text>
                {treeInfoOfType.floweringSeason}
              </Text>
              <Divider my={1} />
              <Text>
                <Text as="span" fontWeight="bold">
                  {greekLabels.MAX_HEIGHT}:{" "}
                </Text>
                {treeInfoOfType.Dimensions.maxHeight}
              </Text>
              <Divider my={1} />
              <Text>
                <Text as="span" fontWeight="bold">
                  {greekLabels.MAX_CROWN_DIAMETER}:{" "}
                </Text>
                {treeInfoOfType.Dimensions.maxCrownDiameter}
              </Text>
              <Divider my={1} />
              <Box>
                <Text>{treeInfoOfType.Description}</Text>
              </Box>
            </>
          )}
        </Flex>
        <IconButton
          aria-label="Delete tree"
          justifySelf="end"
          onClick={onDeleteOpen}
          icon={<FaTrash />}
          alignSelf="start"
        />
      </Stack>
    </Box>
  );
};

export default TreeItem;
