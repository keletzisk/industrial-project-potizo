import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { ChakraProvider } from "@chakra-ui/react";

import LandingPage from "./LandingPage";

it("Landing page renders", () => {
  render(
    // Wrapping in ChakraProvider solves error:
    // TypeError: Cannot use 'in' operator to search for 'colors.transparent' in undefined
    <ChakraProvider>
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    </ChakraProvider>
  );
});
