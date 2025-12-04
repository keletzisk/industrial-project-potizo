import React from "react";
import { greekLabels } from "../../util/language";
import { Container, HStack, Icon, Link, Stack, Text } from "@chakra-ui/react";
import { CgFileDocument } from "react-icons/cg";
import { Link as RouterLink } from "react-router-dom";

export function Legal() {
  return (
    <Container maxW="xl" ml={0} mt={2}>
      <Stack>
        <Link
          color="blue.600"
          as={RouterLink}
          to={"/terms"}
          id="hoverable-terms"
        >
          <HStack>
            <Icon
              sx={{
                "#hoverable-terms:hover &": {
                  color: "blue.700",
                },
              }}
              boxSize="30px"
              as={CgFileDocument}
            ></Icon>
            <Text
              fontWeight="semibold"
              sx={{
                "#hoverable-terms:hover &": {
                  color: "blue.700",
                },
              }}
            >
              {greekLabels.TERMS_OF_USE}
            </Text>
          </HStack>
        </Link>
        <Link
          color="blue.600"
          as={RouterLink}
          to={"/data-protection"}
          id="hoverable-data-protection"
        >
          <HStack>
            <Icon
              sx={{
                "#hoverable-data-protection:hover &": {
                  color: "blue.700",
                },
              }}
              boxSize="30px"
              as={CgFileDocument}
            ></Icon>
            <Text
              fontWeight="semibold"
              sx={{
                "#hoverable-data-protection:hover &": {
                  color: "blue.700",
                },
              }}
            >
              Ενημέρωση σχετικά με την επεξεργασία προσωπικών δεδομένων
            </Text>
          </HStack>
        </Link>
      </Stack>
    </Container>
  );
}
