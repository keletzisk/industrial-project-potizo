import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    body: `"Roboto", Arial, Helvetica, sans-serif`,
    heading: `"Roboto", Arial, Helvetica, serif`,
  },
  colors: {
    lightGreen: {
      50: "#EAFAF5",
      100: "#C5F1E3",
      200: "#A0E8D1",
      300: "#7BDFBF",
      400: "#56D7AD",
      500: "#31CE9B",
      600: "#27A57C",
      700: "#1E7B5D",
      800: "#14523E",
      900: "#0A291F",
    },
  },
  components: {
    Heading: {
      baseStyle: {
        color: "blackAlpha.800",
      },
    },
  },
});

export default theme;
