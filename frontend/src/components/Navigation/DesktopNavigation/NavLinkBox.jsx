import { Flex, Link, Text } from "@chakra-ui/react";
import { NavLink as RouterNavLink } from "react-router-dom";

export function NavLinkBox({ to, label }) {
  return (
    <Link
      as={RouterNavLink}
      to={to}
      _activeLink={{
        color: "var(--darker-military-green-alternative)",
      }}
      color="whiteAlpha.900"
      _hover={{ textDecoration: "none" }}
      className="react-router-link"
    >
      <Flex
        h="full"
        align="center"
        _hover={{
          bgColor: "var(--darker-military-green)",
        }}
        cursor="pointer"
      >
        <Text
          fontSize="1.1rem"
          px={3}
          fontWeight="semibold"
          sx={{
            ".react-router-link:hover &": {
              color: "whiteAlpha.900",
            },
          }}
        >
          {label}
        </Text>
      </Flex>
    </Link>
  );
}
