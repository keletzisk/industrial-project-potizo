import {
  Flex,
  Heading,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  IconButton,
} from "@chakra-ui/react";
import { greekLabels } from "util/language";
import { FaCircle } from "react-icons/fa";
import { TbFocus2 } from "react-icons/tb";
import { BiSearch } from "react-icons/bi";
import { TiInfoLarge } from "react-icons/ti";
import { ReactComponent as TreeIcon } from "assets/icons/tree-white.svg";
import matureTree from "assets/icons/matureTree.png";
import youngTree from "assets/icons/youngTree.png";
import myTree from "assets/icons/myTree.png";
import adoptedTree from "assets/icons/adoptedTree.png";

export function TutorialModal({ isTutorialOpen, onTutorialClose }) {
  return (
    <Modal
      isOpen={isTutorialOpen}
      onClose={onTutorialClose}
      scrollBehavior="inside"
      isCentered
    >
      <ModalOverlay />
      <ModalContent w="95%">
        <ModalCloseButton />
        <ModalHeader>{greekLabels.INFO_MODAL_HEADER}</ModalHeader>
        <ModalBody>
          <Stack spacing="5" mb={5}>
            <Heading fontSize="sm">{greekLabels.INFO_MODAL_TREE_INFO}</Heading>
            <Flex align="center">
              <img
                boxSize="0.7em"
                // color="#2A941B"
                // as={FaCircle}
                src={matureTree}
                mr={7}
                ml={3}
              />
              <Heading fontSize="sm">
                {greekLabels.INFO_MODAL_MATURE_TREES}
              </Heading>
            </Flex>
            <Flex align="center">
              <img boxSize="2em" src={youngTree} as={FaCircle} mr={5} />
              <Heading fontSize="sm">
                {greekLabels.INFO_MODAL_YOUNG_TREES}
              </Heading>
            </Flex>
            <Flex align="center">
              <img boxSize="2em" src={myTree} as={FaCircle} mr={5} />
              <Heading fontSize="sm">
                {greekLabels.INFO_MODAL_USER_ADOPTED_TREES}
              </Heading>
            </Flex>
            <Flex align="center">
              <img boxSize="2em" src={adoptedTree} as={FaCircle} mr={5} />
              <Heading fontSize="sm">
                {greekLabels.INFO_MODAL_OTHER_ADOPTED_TREES}
              </Heading>
            </Flex>
          </Stack>

          <Stack mb={5}>
            <Heading fontSize="sm">
              {greekLabels.INFO_MODAL_QUESTION_ADOPT_TREE}
            </Heading>
            <Text fontSize="sm">
              {greekLabels.INFO_MODAL_QUESTION_ADOPT_TREE_TEXT}
            </Text>
          </Stack>

          <Stack mb={5}>
            <Heading fontSize="sm">
              {greekLabels.INFO_MODAL_QUESTION_WATER_TREE}
            </Heading>
            <Text fontSize="sm">
              {greekLabels.INFO_MODAL_QUESTION_WATER_TREE_TEXT}
            </Text>
          </Stack>

          <Stack spacing="5" mb={5}>
            <Heading fontSize="sm">
              {greekLabels.INFO_MODAL_DESCRIBE_ICONS}
            </Heading>
            <Flex align="center">
              <IconButton
                size="sm"
                fontSize="2rem"
                mr={5}
                colorScheme="green"
                borderRadius="3px"
                boxShadow="rgba(0, 0, 0, 0.3) 1px 2px 2px 0px"
                icon={<TiInfoLarge />}
              />
              <Heading fontSize="sm">
                {greekLabels.INFO_MODAL_DESCRIBE_ICONS_SEE_INSTRUCTIONS}
              </Heading>
            </Flex>
            <Flex align="center">
              <IconButton
                size="sm"
                fontSize="2rem"
                mr={5}
                colorScheme="green"
                borderRadius="3px"
                boxShadow="rgba(0, 0, 0, 0.3) 1px 2px 2px 0px"
                icon={
                  <Icon>
                    <TreeIcon />
                  </Icon>
                }
              />
              <Heading fontSize="sm">
                {greekLabels.INFO_MODAL_DESCRIBE_ICONS_FIND_TREES}
              </Heading>
            </Flex>
            <Flex align="center">
              <IconButton
                size="sm"
                fontSize="2rem"
                mr={5}
                colorScheme="green"
                borderRadius="3px"
                boxShadow="rgba(0, 0, 0, 0.3) 1px 2px 2px 0px"
                icon={<BiSearch />}
              />
              <Heading fontSize="sm">
                {
                  greekLabels.INFO_MODAL_DESCRIBE_ICONS_FIND_TREE_BASED_ON_POSTAL_CODE
                }
              </Heading>
            </Flex>
            <Flex align="center">
              <IconButton
                size="sm"
                fontSize="2rem"
                mr={5}
                colorScheme="green"
                borderRadius="3px"
                boxShadow="rgba(0, 0, 0, 0.3) 1px 2px 2px 0px"
                icon={<TbFocus2 />}
              />
              <Heading fontSize="sm">
                {
                  greekLabels.INFO_MODAL_DESCRIBE_ICONS_FIND_TREE_BASED_ON_LOCATION
                }
              </Heading>
            </Flex>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
