import React from "react";
import { greekLabels } from "util/language";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Heading,
} from "@chakra-ui/react";
import { Legal } from "components/Legal/Legal";
import { Developers } from "components/Developers/Developers";

export function InfoPagesAccordion({ defaultIndex }) {
  return (
    <Accordion
      allowToggle
      display="flex"
      flexDir="column"
      defaultIndex={defaultIndex}
    >
      <AccordionItem>
        <AccordionButton px={5} py={3}>
          <Heading textAlign="start" flex="1" fontSize="1.1rem">
            {greekLabels.LEGALITY}
          </Heading>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel pb={4}>
          <Legal />
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <AccordionButton px={5} py={3}>
          <Heading textAlign="start" flex="1" fontSize="1.1rem">
            {greekLabels.DEVELOPERS}
          </Heading>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel pb={4}>{<Developers />}</AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
