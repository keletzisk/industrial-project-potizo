import React from "react";

import { Stack, Icon, Box, Button } from "@chakra-ui/react";
import { MdAddCircle } from "react-icons/md";
import { ReactComponent as TreeIcon } from "assets/icons/tree-white.svg";
import { greekLabels } from "util/language";
import { useNavigate } from "react-router";

export function AdoptTreeCard() {
  const navigate = useNavigate();
  return (
    <Box p={2} h="full" onClick={() => navigate("/map")}>
      <Stack
        h="full"
        pt={10}
        pb={8}
        borderRadius={6}
        boxShadow="1px 2px 8px rgba(0, 0, 0, 0.2)"
        align="center"
        justify="end"
      >
        <Stack cursor="pointer" id="hoverable-adopt-tree-box">
          <Box alignSelf="center" pos="relative" pr={2}>
            <Icon
              pos="absolute"
              right="8px"
              bottom="-10px"
              color="green.300"
              boxSize="2rem"
              as={MdAddCircle}
              sx={{
                "#hoverable-adopt-tree-box:hover &": {
                  color: "green.400",
                },
              }}
            />
            <Icon
              color="green.500"
              boxSize="4.5rem"
              alt="go to trees"
              sx={{
                "#hoverable-adopt-tree-box:hover &": {
                  color: "green.600",
                },
              }}
            >
              <TreeIcon />
            </Icon>
          </Box>

          <Button
            sx={{
              "#hoverable-adopt-tree-box:hover &": {
                backgroundColor: "green.600",
              },
            }}
            colorScheme="green"
            mt={4}
          >
            {greekLabels.ADOPT_A_TREE}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
