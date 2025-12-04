import React, { useContext } from "react";
import { AuthContext } from "../../../context/auth-context";
import { useMatch } from "react-router-dom";
import logo_horizontal from "assets/icons/logo-white.svg";
import { greekLabels } from "../../../util/language";
import { Button, Flex, Icon, Image, Link } from "@chakra-ui/react";
import { Link as RouterLink, NavLink as RouterNavLink } from "react-router-dom";
import { RiSettings3Fill } from "react-icons/ri";
import { FaHome, FaMapMarkedAlt } from "react-icons/fa";
import { ReactComponent as TreeIcon } from "assets/icons/tree-white.svg";

export function MobileNavigation() {
  const auth = useContext(AuthContext);
  const matchIndex = useMatch("/");
  const matchTrees = useMatch("/trees");
  const matchMap = useMatch("/map");
  const matchSettings = useMatch("/settings");

  return auth.userId ? (
    <Flex px={3} flex="1" align="center" justify="space-around">
      <Link as={RouterNavLink} display="flex" to={"/"}>
        <Icon
          aria-label="homeIcon"
          color={matchIndex ? "blackAlpha.700" : "white"}
          boxSize="2.3em"
          alt="go to home"
          as={FaHome}
        />
      </Link>
      <Link as={RouterNavLink} display="flex" to={"/trees"}>
        <Icon
          aria-label="treesIcon"
          color={matchTrees ? "blackAlpha.700" : "white"}
          boxSize="2.1em"
          alt="go to trees"
        >
          <TreeIcon />
        </Icon>
      </Link>
      <Link as={RouterNavLink} display="flex" to={"/map"}>
        <Icon
          aria-label="mapIcon"
          color={matchMap ? "blackAlpha.700" : "white"}
          boxSize="2.2em"
          alt="go to map"
          as={FaMapMarkedAlt}
        />
      </Link>
      <Link as={RouterNavLink} display="flex" to={"/settings"}>
        <Icon
          aria-label="settingsIcon"
          color={matchSettings ? "blackAlpha.700" : "white"}
          boxSize="2.2em"
          alt="go to settings"
          as={RiSettings3Fill}
        />
      </Link>
    </Flex>
  ) : (
    <Flex px={3} flex="1" align="center" justify="space-between">
      <Link as={RouterLink} to={"/"}>
        <Image w="100px" alt="Application logo" src={logo_horizontal} />
      </Link>
      <Button
        borderRadius="full"
        as={RouterLink}
        to={"/auth"}
        type="button"
        bg="white"
        _hover={{ bgColor: "whiteAlpha.900" }}
      >
        {greekLabels.LOGIN}
      </Button>
    </Flex>
  );
}
