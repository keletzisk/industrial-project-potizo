import React from "react";
import { MobileNavigation } from "../MobileNavigation/MobileNavigation";
import { DesktopNavigation } from "../DesktopNavigation/DesktopNavigation";
import { Box, Flex, useMediaQuery } from "@chakra-ui/react";

export function MainNavigation() {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");

  return (
    <Box id="app-nav" w="100%" pos="sticky" top="0" zIndex={1} bg="green.500">
      <Flex
        h={16}
        maxW="1280px"
        mx="auto"
        display="flex"
        align="center"
        justify="space-between"
        px={isLargerThan768 && 5}
      >
        {isLargerThan768 ? <DesktopNavigation /> : <MobileNavigation />}
      </Flex>
    </Box>
  );
}
