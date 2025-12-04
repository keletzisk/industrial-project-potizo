import React, { useContext, useEffect, useState } from "react";
import potizo_logo from "assets/images/potizo_logo.svg";
import thess_logo from "assets/images/thess.png";
import green_planet from "assets/images/green_planet.png";
import water_tree from "assets/images/icon-01.png";
import select_location from "assets/images/icon-02.png";
import forest from "assets/images/icon-03.png";
import bird_on_tree from "assets/images/icon-04.png";
import nature_in_city from "assets/images/icon-05.png";
import teamwork from "assets/images/icon-06.png";
import potistiri from "assets/icons/potistiri.svg";
import mobile_phone from "assets/images/mobile_phone.png";
import city_logo from "assets/images/city_logo.jpg";
import { FaHeart, FaAngleDoubleDown, FaMapMarkedAlt } from "react-icons/fa";
import { greekLabels } from "../../util/language";
import { Link as RouterLink } from "react-router-dom";

import {
  Heading,
  Text,
  Button,
  Flex,
  Box,
  Container,
  Image,
  Grid,
  GridItem,
  Icon,
  keyframes,
  Link,
  HStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router";
import { AuthContext } from "context/auth-context";
import { motion } from "framer-motion";
import { ImageByText } from "components/LandingPage/ImageByText";

const animationKeyframes = keyframes`
  0%   { transform: scale(1,1)    translateY(0); }
  10%  { transform: scale(1.05,.9) translateY(0); }
  30%  { transform: scale(.9,1.05) translateY(-5px); }
  50%  { transform: scale(1,1)    translateY(0); }
  100% { transform: scale(1,1)    translateY(0); }
`;

const animation = `${animationKeyframes} 3s ease-in-out infinite`;

const LandingPage = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [hasUserScrolled, setHasUserScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setTimeout(() => {
        setHasUserScrolled(true);
      }, 250);
      window.removeEventListener("scroll", onScroll);
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  });

  return (
    <>
      {!hasUserScrolled && (
        <Box
          zIndex={1}
          pointerEvents="none"
          pos="fixed"
          align="center"
          bottom={0}
          left={0}
          right={0}
        >
          <Flex
            pb={5}
            height={{ base: "150px", md: "250px" }}
            direction="column"
            align="center"
            justify="flex-end"
            bgGradient="linear(to-b, transparent, white)"
          >
            <Heading color="green.900" size="md" mb={2}>
              {greekLabels.home.learnMore}
            </Heading>
            <Flex as={motion.div} animation={animation}>
              <Icon as={FaAngleDoubleDown} color="green.800" boxSize="20px" />
            </Flex>
          </Flex>
        </Box>
      )}

      <Flex
        maxW="1200px"
        mt={{ base: 5, md: 20 }}
        direction={{ base: "column", md: "row-reverse" }}
        px={{ base: 5, md: 10 }}
        mb={{ base: 0, md: 10 }}
      >
        <Image
          alignSelf="center"
          maxW={{ base: "300px", lg: "400px" }}
          boxSize={{ base: "100%", md: "50%" }}
          alt="potizo logo"
          src={potizo_logo}
          mb={{ base: 8, lg: 0 }}
        />

        <Flex direction="column" maxH={{ base: "auto", lg: "400px" }}>
          <Image maxW="300px" mx="auto" alt="thess logo" src={thess_logo} />
          <Heading
            as="h2"
            size={{ base: "xl", lg: "2xl" }}
            align="center"
            my={12}
          >
            <Text as="span" whiteSpace="nowrap" display="inline-block">
              Υιοθετώ ένα{" "}
              <Text as="span" color="green.600">
                δέντρο<span>&nbsp;</span>
              </Text>
            </Text>

            <Text as="span" whiteSpace="nowrap">
              στην{" "}
              <Text as="span" color="green.600">
                πόλη
              </Text>{" "}
              μου
            </Text>
          </Heading>
          <Heading size="lg" align="center" mb={4}>
            {greekLabels.home.welcomeMessage}
          </Heading>
          <Box align="center">
            <Button
              borderRadius="full"
              mb={4}
              colorScheme="green"
              size="lg"
              onClick={() => navigate(auth.userId ? "/map" : "/auth")}
            >
              {greekLabels.home.adoptNow}
            </Button>
          </Box>
        </Flex>
      </Flex>

      <Container p={5}>
        <Image boxSize="300px" mx="auto" src={green_planet} mb={10} />
        <Heading align="center" color="green.600" size="xl" mb={4}>
          Υιοθέτησε και εσύ ένα δέντρο στην πόλη σου
        </Heading>
        <Text fontSize="lg" mb={4}>
          {greekLabels.home.appDescription}
        </Text>
        <Text fontSize="lg">{greekLabels.home.waterYourTree}</Text>
      </Container>

      <Flex maxW="1200px" direction="column">
        <Heading py={7} align="center" size="xl">
          {greekLabels.home.whyAdoptTree}
        </Heading>

        <ImageByText
          textElement={
            <>
              <Text as="span" fontWeight="bold">
                {greekLabels.home.youngTreeSurvival1}
              </Text>{" "}
              {greekLabels.home.youngTreeSurvival2}
            </>
          }
          image={water_tree}
        />

        <ImageByText
          shouldReverseDirection
          textElement={
            <>
              <Text as="span" fontWeight="bold">
                {greekLabels.home.environmentShaping1}
              </Text>{" "}
              {greekLabels.home.environmentShaping2}
            </>
          }
          image={select_location}
        />

        <ImageByText
          textElement={
            <>
              <Text as="span" fontWeight="bold">
                {greekLabels.home.protectYourEnvironment1}
              </Text>{" "}
              {greekLabels.home.protectYourEnvironment2}
            </>
          }
          image={forest}
        />

        <ImageByText
          shouldReverseDirection
          textElement={
            <>
              <Text as="span" fontWeight="bold">
                {greekLabels.home.beautifyYourDay1}
              </Text>{" "}
              {greekLabels.home.beautifyYourDay2}
            </>
          }
          image={nature_in_city}
        />

        <ImageByText
          textElement={
            <>
              <Text as="span" fontWeight="bold">
                {greekLabels.home.provideShelter1}
              </Text>{" "}
              {greekLabels.home.provideShelter2}
            </>
          }
          image={bird_on_tree}
        />

        <ImageByText
          shouldReverseDirection
          textElement={
            <>
              <Text as="span" fontWeight="bold">
                {greekLabels.home.betterFuture}
              </Text>{" "}
              {greekLabels.home.beVolunteer}
            </>
          }
          image={teamwork}
        />
      </Flex>

      <Box bg="green.50" alignSelf="stretch" align="center">
        <Flex maxW="1200px" direction="column" align="center" gap={5} p={5}>
          <Heading align="center" size="lg">
            {greekLabels.home.treeAdoptionResponsibilities}
          </Heading>
          <Grid templateColumns="auto auto" gap={8}>
            <GridItem display="flex" alignItems="center">
              <Image fit="contain" m="auto" boxSize="80px" src={potistiri} />
            </GridItem>
            <GridItem my="auto">
              <Text>{greekLabels.home.waterYourTreeDescription}</Text>
              <Container size="sm" p={0}>
                <Text mt={1} fontSize="sm" fontStyle="italic">
                  {greekLabels.home.wateringInstructions}
                </Text>
              </Container>
            </GridItem>
            <GridItem display="flex" alignItems="center">
              <Image fit="contain" m="auto" boxSize="80px" src={mobile_phone} />
            </GridItem>
            <GridItem my="auto">
              <Text>{greekLabels.home.notifyWatering}</Text>
            </GridItem>
          </Grid>
        </Flex>
      </Box>

      <Heading py={7} align="center" size="lg">
        {greekLabels.home.howToAdoptTree}
      </Heading>

      <Box
        bgGradient="linear-gradient(90deg, green.50 50%, green.200 50%)"
        alignSelf="stretch"
        align="center"
      >
        <Flex
          maxW="1200px"
          alignSelf="stretch"
          direction={{ base: "column", md: "row" }}
        >
          <Flex
            flex="1"
            align="center"
            justify="center"
            direction="column"
            bg="green.50"
            p={5}
          >
            <Button
              borderRadius="full"
              mr={{ base: 0, lg: 4 }}
              mb={4}
              colorScheme="green"
              size="lg"
              onClick={() => navigate(auth.userId ? "/map" : "/auth")}
            >
              {greekLabels.home.adoptNow}
            </Button>
            <Text align="center">{greekLabels.home.adoptTreeDescription}</Text>
          </Flex>

          <Flex
            flex="1"
            align="center"
            justify="start"
            direction="column"
            bg="green.100"
            p={5}
          >
            <Icon as={FaMapMarkedAlt} boxSize="80px" mb={3} />

            <Heading color="green.600" size="md" mb={4}>
              {greekLabels.home.chooseTreesHeading}
            </Heading>
            <Text align="center">
              {greekLabels.home.chooseTreesDescription}
            </Text>
          </Flex>

          <Flex
            flex="1"
            align="center"
            justify="start"
            direction="column"
            bg="green.200"
            p={5}
          >
            <Icon as={FaHeart} boxSize="80px" mb={3} />

            <Heading color="green.600" size="md" mb={4}>
              {greekLabels.home.congratulationsHeading}
            </Heading>
            <Text align="center">{greekLabels.home.congratulationsText}</Text>
          </Flex>
        </Flex>
      </Box>

      <Heading py={7} align="center" size="md" fontStyle="italic">
        {greekLabels.home.learnMoreQuestion}
      </Heading>

      <Flex
        alignSelf="stretch"
        direction="column"
        align="center"
        bg="green.50"
        p={5}
      >
        <Heading align="center" size="sm" mb={5}>
          {greekLabels.home.aboutCreatorsHeading}
        </Heading>
        <Flex direction="column" align="center" mb={5}>
          <Link isExternal color="blue" href="https://citycollege.eu/">
            <Image fit="contain" htmlWidth="150px" src={city_logo} mb={5} />
          </Link>

          <Container>
            <Text>{greekLabels.home.aboutCreatorsText}</Text>
          </Container>
        </Flex>
        {/* Municipality does not want to provide communication email */}
        {/* <Heading align="center" size="sm" mb={3}>
          {greekLabels.home.contactUsHeading}
        </Heading>
        <Container>
          <Text>{greekLabels.home.contactUsText}</Text>
        </Container> */}
      </Flex>

      <Box p={5} align="center" bg="cyan.100" alignSelf="stretch">
        <Link isExternal color="blue" href="https://thessaloniki.gr/">
          <Image
            maxW="300px"
            fit="contain"
            w="75%"
            mx="auto"
            alt="thess logo"
            src={thess_logo}
          />
        </Link>
        <Image
          mt={4}
          maxW="250px"
          boxSize={{ base: "100%", lg: "50%" }}
          alt="potizo logo"
          src={potizo_logo}
        />
      </Box>
      <Box p={3} alignSelf="stretch">
        <HStack justify="center">
          <Link fontSize="0.8rem" as={RouterLink} to="/terms">
            Όροι χρήσης
          </Link>
          <Text>•</Text>
          <Link fontSize="0.8rem" as={RouterLink} to="/data-protection">
            Προσωπικά δεδομένα
          </Link>
        </HStack>
      </Box>
    </>
  );
};

export default LandingPage;
