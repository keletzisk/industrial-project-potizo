import React, { useContext } from "react";
import { AuthContext } from "../../context/auth-context";
import { greekLabels } from "../../util/language";
import { DeleteModal } from "./DeleteModal";
import { ResetPasswordModal } from "./ResetPasswordModal";
import { Flex, Heading, useDisclosure, useToast } from "@chakra-ui/react";
import { deleteUser, requestResetPassword } from "services/api";
import { InfoPagesAccordion } from "components/InfoPagesAccordion";
import { toastError, toastSuccess } from "util/helpers";

function Settings() {
  const auth = useContext(AuthContext);
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const {
    isOpen: isResetOpen,
    onOpen: onResetOpen,
    onClose: onResetClose,
  } = useDisclosure();
  const toast = useToast();

  const confirmDeleteHandler = async () => {
    deleteUser(auth.token)
      .then(() => {
        onDeleteClose();
        toastSuccess(toast, greekLabels.SUCCESSFUL_ACCOUNT_DELETION);
        auth.logout();
      })
      .catch((error) => {
        toastError(toast, error);
      });
  };

  const resetHandler = async () => {
    requestResetPassword(auth.email)
      .then(() => {
        onResetClose();
        toastSuccess(toast, greekLabels.SUCCESSFUL_REQUEST_RESET_PASSWORD);
      })
      .catch((error) => {
        toastError(toast, error);
      });
  };

  return (
    <Flex
      maxH="calc(100vh - 64px)"
      alignSelf="stretch"
      direction="column"
      flex="1"
      pb={8}
    >
      <Heading mx={5} size="lg" pt={8} pb={5}>
        {greekLabels.ACCOUNT_SETTINGS}
      </Heading>
      <Flex minH="0" flex="1" direction="column">
        <Flex direction="column" align="flex-start" mb={5}>
          {!auth.isLinkedAccount && (
            <>
              <Heading
                fontSize="1.1rem"
                px={5}
                py={3}
                fontWeight="bold"
                cursor="pointer"
                color="blackAlpha.800"
                _hover={{ color: "blackAlpha.900" }}
                onClick={onResetOpen}
              >
                {greekLabels.RESET_PASSWORD}
              </Heading>
            </>
          )}
          <Heading
            fontSize="1.1rem"
            px={5}
            py={3}
            fontWeight="bold"
            cursor="pointer"
            color="blackAlpha.800"
            _hover={{ color: "blackAlpha.900" }}
            onClick={onDeleteOpen}
          >
            {greekLabels.DELETE_ACCOUNT}
          </Heading>
          <Heading
            fontSize="1.1rem"
            px={5}
            py={3}
            fontWeight="bold"
            cursor="pointer"
            color="blackAlpha.800"
            _hover={{ color: "blackAlpha.900" }}
            onClick={auth.logout}
          >
            {greekLabels.DISCONNECT}
          </Heading>
        </Flex>

        <InfoPagesAccordion />
      </Flex>

      <DeleteModal
        isDeleteOpen={isDeleteOpen}
        onDeleteClose={onDeleteClose}
        deleteHandler={confirmDeleteHandler}
      />

      <ResetPasswordModal
        isResetOpen={isResetOpen}
        onResetClose={onResetClose}
        resetHandler={resetHandler}
      />
    </Flex>
  );
}

export default Settings;
