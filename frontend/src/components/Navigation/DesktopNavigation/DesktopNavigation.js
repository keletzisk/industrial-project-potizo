import React, { useContext } from "react";
import { AuthContext } from "../../../context/auth-context";
import { greekLabels } from "../../../util/language";
import { NavLink, useNavigate } from "react-router-dom";
import { VscSignOut } from "react-icons/vsc";
import logo_horizontal from "assets/icons/logo-white.svg";

import { Button, Flex, Icon, Image, Link } from "@chakra-ui/react";
import { NavLinkBox } from "components/Navigation/DesktopNavigation/NavLinkBox";
import { Link as RouterLink } from "react-router-dom";

export function DesktopNavigation() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const username = auth.email
    ? auth.email.substring(0, auth.email.indexOf("@"))
    : "";

  return (
    <>
      <Link as={RouterLink} to={"/"} mr={2}>
        <Image w="100px" alt="Application logo" src={logo_horizontal} />
      </Link>

      {auth.userId && (
        <Flex flex="1" h="full">
          <NavLinkBox to="/trees" label={greekLabels.MY_TREES} />
          <NavLinkBox to="/map" label={greekLabels.TREE_MAP} />
        </Flex>
      )}

      <Flex h="full">
        {auth.userId ? (
          <>
            <NavLinkBox to="/settings" label={username} />
            <Flex
              aria-label="logout"
              align="center"
              _hover={{ bgColor: "var(--darker-military-green)" }}
              px={3}
              cursor="pointer"
              onClick={() => {
                auth.logout();
                navigate("/");
              }}
            >
              <Icon color="whiteAlpha.900" boxSize="1.5rem" as={VscSignOut} />
            </Flex>
          </>
        ) : (
          <Button
            alignSelf="center"
            borderRadius="full"
            as={NavLink}
            to={"/auth"}
            type="button"
            bg="white"
            _hover={{ bgColor: "whiteAlpha.900" }}
          >
            {greekLabels.LOGIN}
          </Button>
        )}
      </Flex>
    </>
  );
}
