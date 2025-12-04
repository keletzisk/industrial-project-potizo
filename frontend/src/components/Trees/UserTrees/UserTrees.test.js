import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router";
import { setMatches } from "../../../matchMedia.mock";
import { existingEmail, loginToken, userTrees } from "mocks/handlers";
import { greekLabels } from "util/language";
import * as reactRouter from "react-router";
import * as auth from "hooks/useAuth.js";

import UserTrees from "./UserTrees";

describe("UserTrees", () => {
  beforeAll(() => {
    setMatches(false);
  });

  it("renders", () => {
    render(
      <MemoryRouter>
        <UserTrees />
      </MemoryRouter>
    );
    expect(screen.getByText("Loading", { exact: false })).toBeInTheDocument();
  });

  it("loads the trees", async () => {
    render(
      <MemoryRouter>
        <UserTrees />
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(() =>
      screen.queryByText("Loading", { exact: false })
    );

    expect(screen.getAllByLabelText("Tree address")).toHaveLength(
      userTrees.data.trees.length
    );
    // there are 2 trees and an adopt link
    expect(screen.getByText(greekLabels.ADOPT_A_TREE)).toBeInTheDocument();
  });

  it("adopt a tree goes to the map", async () => {
    const mockNavigate = jest.fn();
    jest
      .spyOn(reactRouter, "useNavigate")
      .mockImplementation(() => mockNavigate);

    jest.spyOn(auth, "useAuth").mockReturnValue({
      token: loginToken,
      userId: 1,
      login: null,
      logout: null,
      email: existingEmail,
      isLinkedAccount: false,
    });
    render(
      <MemoryRouter>
        <UserTrees />
      </MemoryRouter>
    );

    const adoptButton = await screen.findByText(greekLabels.ADOPT_A_TREE);
    fireEvent.click(adoptButton);

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/map"));
  });
});
