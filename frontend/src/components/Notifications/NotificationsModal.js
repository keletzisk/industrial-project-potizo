import {
  Divider,
  Flex,
  HStack,
  Icon,
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
import {
  getNotSeenNotifications,
  setAllNotificationsToSeen,
} from "services/api";
import { AuthContext } from "context/auth-context";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { ReactComponent as TreeIcon } from "assets/icons/tree-white.svg";
import { format } from "date-fns";
import elLocale from "date-fns/locale/el";
import { BiCheckDouble } from "react-icons/bi";
import { greekLabels } from "util/language";
import { toastError } from "util/helpers";

export function NotificationsModal() {
  const auth = useContext(AuthContext);
  const [groupedNotifications, setGroupedNotifications] = useState();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (!auth?.token) return;

    getNotSeenNotifications(auth.token)
      .then((notifications) => {
        if (notifications.length === 0) return;
        const tempNotificationsMap = new Map();
        for (const notification of notifications) {
          const key = notification.category + "_" + notification.header;
          if (!tempNotificationsMap.has(key)) {
            tempNotificationsMap.set(key, {
              isCollapsed: true,
              isSeen: false,
              notifications: [notification],
            });
          } else {
            tempNotificationsMap.get(key)["notifications"].push(notification);
          }
        }
        setGroupedNotifications(tempNotificationsMap);
        onOpen();
      })
      .catch((error) => {
        toastError(toast, error);
      });
  }, [auth, onOpen, toast]);

  function seeAllNotifications(shouldClose = true) {
    setAllNotificationsToSeen(auth.token)
      .then(() => {
        shouldClose && onClose();
        setGroupedNotifications((previousMap) => {
          const clonedMap = new Map(previousMap);
          clonedMap.forEach((value) => {
            value.isSeen = true;
          });

          return clonedMap;
        });
      })
      .catch((error) => {
        toastError(toast, error);
      });
  }

  function toggleNotificationCollapse(key) {
    setGroupedNotifications((previousMap) => {
      const clonedMap = new Map(previousMap);
      const oldNotificationWrapper = clonedMap.get(key);
      seeAllNotifications(false);
      oldNotificationWrapper.isCollapsed = !oldNotificationWrapper.isCollapsed;
      return clonedMap;
    });
  }

  if (!groupedNotifications) return;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent w="95%">
        <ModalCloseButton />
        <ModalHeader>Ειδοποιήσεις</ModalHeader>
        <ModalBody py={0}>
          {groupedNotifications &&
            [...groupedNotifications.entries()].map(
              ([key, notificationsWrapper]) => {
                const notifications = notificationsWrapper.notifications;
                const notification = notifications[0];

                const categorizedNotification =
                  greekLabels.notifications[notification.category];
                const notificationHeader = categorizedNotification
                  ? categorizedNotification.header
                  : notification.header;
                let notificationMessage = categorizedNotification
                  ? categorizedNotification.message
                  : notification.message;

                return (
                  <Fragment key={notification.id}>
                    <HStack
                      userSelect="none"
                      justify="space-between"
                      gap={4}
                      cursor="pointer"
                      p={2}
                      borderRadius={5}
                      _hover={{ bgColor: "gray.100" }}
                      onClick={() => toggleNotificationCollapse(key)}
                    >
                      <Stack gap={1} minW="0">
                        <HStack align="start">
                          {!notificationsWrapper.isSeen &&
                            notifications.length > 0 && (
                              <Flex
                                mt={1}
                                p={1}
                                flexShrink={0}
                                minW={6}
                                borderRadius="full"
                                bgColor="orange.500"
                                justify="center"
                                align="center"
                                mr={1}
                                float="left"
                                _before={{
                                  content: '""',
                                  display: "inline-block",
                                  pt: "100%",
                                }}
                                color="white"
                                fontSize="0.7rem"
                                fontWeight="bold"
                              >
                                {notifications.length}
                              </Flex>
                            )}
                          <Stack>
                            <Text
                              fontWeight={notification.seen ? "normal" : "bold"}
                            >
                              {notificationHeader}
                            </Text>
                            {notificationsWrapper.isCollapsed && (
                              <Text fontSize="0.8rem">
                                {notificationMessage}
                              </Text>
                            )}
                            <Text
                              color="gray.500"
                              fontWeight="semibold"
                              fontSize="0.8rem"
                            >
                              {format(new Date(notification.createdAt), "PPp", {
                                locale: elLocale,
                              })}
                            </Text>
                          </Stack>
                        </HStack>
                      </Stack>

                      <HStack justify="end" flex={1} gap={0}>
                        <Icon
                          borderRadius="full"
                          padding={1}
                          bgColor="green.500"
                          color="white"
                          boxSize="2.5rem"
                        >
                          <TreeIcon />
                        </Icon>
                      </HStack>
                    </HStack>

                    <Divider my={1} />
                  </Fragment>
                );
              }
            )}
        </ModalBody>
        <ModalFooter pt={0}>
          <HStack
            color="blue.500"
            _hover={{ color: "blue.600" }}
            gap={1}
            fontWeight="semibold"
            cursor="pointer"
            onClick={seeAllNotifications}
          >
            <Icon as={BiCheckDouble} />
            <Text fontSize="0.8rem">{greekLabels.MARK_AS_READ}</Text>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
