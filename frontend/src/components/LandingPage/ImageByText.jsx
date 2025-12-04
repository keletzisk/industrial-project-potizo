import { Flex, Image, Text } from "@chakra-ui/react";

export function ImageByText({
  textElement,
  image,
  shouldReverseDirection = false,
}) {
  return (
    <Flex
      direction={{
        base: "column",
        md: shouldReverseDirection ? "row" : "row-reverse",
      }}
      align="center"
      py={2}
      mx={6}
      mb={{ base: 5, md: 10 }}
      alignSelf="center"
      maxW="80%"
      gap={{ base: 5, md: 10, lg: 20 }}
    >
      <Text fontSize="lg" mb={4} flex="1">
        {textElement}
      </Text>

      <Flex
        flex="1"
        justify="center"
        alignSelf="stretch"
        bg="cyan.100"
        borderRadius={10}
        py={{ base: 2, lg: 5 }}
        px={{ base: 2, lg: 10 }}
      >
        <Image height="250px" src={image} />
      </Flex>
    </Flex>
  );
}
