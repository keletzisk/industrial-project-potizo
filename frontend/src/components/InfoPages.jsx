import React from "react";
import { Flex } from "@chakra-ui/react";
import { InfoPagesAccordion } from "components/InfoPagesAccordion";

export function InfoPages() {
  return (
    <Flex
      pt={4}
      maxH="calc(100vh - 64px)"
      alignSelf="stretch"
      direction="column"
      flex="1"
      pb={8}
    >
      <InfoPagesAccordion defaultIndex={0} />
    </Flex>
  );
}
