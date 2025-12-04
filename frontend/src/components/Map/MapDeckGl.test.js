import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

import { getSetCenterMock } from "../../mocks/googleMap";
import { BrowserRouter } from "react-router-dom";
import { greekLabels } from "util/language";
import {
  fetchedTreeData,
  firstTreeFoundWithZip,
  storedTreeData,
  treeOfUserWithTwoTrees1,
  treeOfUserWithTwoTrees2,
  treesVersion,
  userIdWithANamedTree,
  userIdWithNoTrees,
  userIdWithTwoTrees,
} from "mocks/handlers";

import MapDeckGL from "./MapDeckGl";
import { enterText, renderWithAuthRouterWithUserId } from "test/utils";
import { STANDARD_ZOOM } from "util/constants";

jest.mock("@deck.gl/google-maps");

describe("MapDeckGL", () => {
  it("renders", () => {
    render(<MapDeckGL />, { wrapper: BrowserRouter });
  });

  it("shows loading map message which is removed when trees load", async () => {
    render(<MapDeckGL />, { wrapper: BrowserRouter });

    await treesToLoad();
  });

  it("stores JSON of fetched trees in treeData in local storage if localstorage is empty", async () => {
    render(<MapDeckGL />, { wrapper: BrowserRouter });
    await treesToLoad();

    expect(localStorage.getItem("treeData")).toEqual(
      JSON.stringify(fetchedTreeData)
    );
    expect(localStorage.getItem("treeDataVersion")).toEqual(treesVersion);
  });

  it("retrieves treeData from local storage if present and same treeDataVersion", async () => {
    localStorage.setItem("treeData", JSON.stringify(storedTreeData));
    localStorage.setItem("treeDataVersion", treesVersion);

    render(<MapDeckGL />, { wrapper: BrowserRouter });
    await treesToLoad();

    expect(localStorage.getItem("treeData")).toEqual(
      JSON.stringify(storedTreeData)
    );
    expect(localStorage.getItem("treeDataVersion")).toEqual(treesVersion);
  });

  it("fetches new treeData from API if treeData are present but different treeDataVersion", async () => {
    localStorage.setItem("treeData", JSON.stringify(storedTreeData));
    const oldTreeVersion = treesVersion - 1;
    localStorage.setItem("treeDataVersion", oldTreeVersion);

    render(<MapDeckGL />, { wrapper: BrowserRouter });
    await treesToLoad();

    expect(localStorage.getItem("treeData")).toEqual(
      JSON.stringify(fetchedTreeData)
    );
    expect(localStorage.getItem("treeDataVersion")).toEqual(treesVersion);
  });

  it("focuses to selected tree when it comes with location.state", async () => {
    const newState = {
      coordinates: {
        lng: treeOfUserWithTwoTrees2.x,
        lat: treeOfUserWithTwoTrees2.y,
      },
      zoom: 19,
    };
    const initialEntries = [{ pathname: "/", state: newState }];

    renderWithAuthRouterWithUserId(
      <MapDeckGL />,
      userIdWithTwoTrees,
      initialEntries
    );
    await treesToLoad();

    const setCenterMock = getSetCenterMock();
    // first setCenter goes to 1st user tree when map loads
    // others are after click
    expect(setCenterMock.calls).toHaveLength(1);
    expect(setCenterMock.calls[0][0]).toMatchObject({
      lng: treeOfUserWithTwoTrees2.x,
      lat: treeOfUserWithTwoTrees2.y,
    });
  });

  it("My trees button is enabled when user has some trees", async () => {
    renderWithAuthRouterWithUserId(<MapDeckGL />, userIdWithANamedTree);
    await treesToLoad();

    const myTreesButton = await screen.findByLabelText("My trees");
    expect(myTreesButton).toBeInTheDocument();
    expect(myTreesButton).toBeEnabled();
  });

  it("cycles on user trees when user has two trees", async () => {
    renderWithAuthRouterWithUserId(<MapDeckGL />, userIdWithTwoTrees);
    await treesToLoad();

    const myTreesButton = await screen.findByLabelText("My trees");
    expect(myTreesButton).toBeInTheDocument();
    expect(myTreesButton).toBeEnabled();

    fireEvent.click(myTreesButton);
    fireEvent.click(myTreesButton);

    const setCenterMock = getSetCenterMock();
    // first setCenter goes to 1st user tree when map loads
    // others are after click
    expect(setCenterMock.calls).toHaveLength(3);
    expect(setCenterMock.calls[0][0]).toMatchObject({
      lng: treeOfUserWithTwoTrees1.x,
      lat: treeOfUserWithTwoTrees1.y,
    });
    expect(setCenterMock.calls[1][0]).toMatchObject({
      lng: treeOfUserWithTwoTrees2.x,
      lat: treeOfUserWithTwoTrees2.y,
    });
    expect(setCenterMock.calls[2][0]).toMatchObject({
      lng: treeOfUserWithTwoTrees1.x,
      lat: treeOfUserWithTwoTrees1.y,
    });
  });

  it("My trees button is disabled when user has no trees", async () => {
    renderWithAuthRouterWithUserId(<MapDeckGL />, userIdWithNoTrees);
    await treesToLoad();

    const myTreesButton = await screen.findByLabelText("My trees");
    expect(myTreesButton).toBeInTheDocument();
    expect(myTreesButton).toBeDisabled();
  });

  it("shows info modal, and sets the localstorage seen to true when closing", async () => {
    expect(localStorage.getItem("seenInfoModal")).toBeNull();

    render(<MapDeckGL />, { wrapper: BrowserRouter });

    const infoModalHeader = await screen.findByText("Πληροφορίες");
    expect(infoModalHeader).toBeInTheDocument();
    const closeButton = screen.getByLabelText("Close");
    fireEvent.click(closeButton);
    await waitForElementToBeRemoved(() => screen.queryByText("Πληροφορίες"));

    expect(localStorage.getItem("seenInfoModal")).toEqual(true);
  });

  it("it does not show info, when already seen", async () => {
    localStorage.setItem("seenInfoModal", true);

    render(<MapDeckGL />, { wrapper: BrowserRouter });

    await screen.findByLabelText("Show info", { timeout: 5000 });
    expect(screen.queryByText("Πληροφορίες")).not.toBeInTheDocument();
  });

  it("it focuses on current location when pressing the current location", async () => {
    const myLocation = { lat: 51, lng: 45 };
    const mockGeolocation = {
      getCurrentPosition: jest.fn().mockImplementation((success) =>
        Promise.resolve(
          success({
            coords: {
              latitude: myLocation.lat,
              longitude: myLocation.lng,
            },
          })
        )
      ),
    };
    global.navigator.geolocation = mockGeolocation;

    renderWithAuthRouterWithUserId(<MapDeckGL />, userIdWithNoTrees);

    const currentLocationButton = await screen.findByLabelText(
      "Go to current location",
      { timeout: 60000 }
    );
    fireEvent.click(currentLocationButton);

    const setCenterMock = getSetCenterMock();
    expect(setCenterMock.calls).toHaveLength(1);
    expect(setCenterMock.calls[0][0]).toMatchObject(myLocation);
  });
});

it("focuses on first tree with zip code", async () => {
  const user = userEvent.setup();
  renderWithAuthRouterWithUserId(<MapDeckGL />, userIdWithNoTrees);
  const searchZipButton = await screen.findByLabelText("Search zip", {
    timeout: 60000,
  });
  fireEvent.click(searchZipButton);

  await enterText(
    user,
    await screen.getByPlaceholderText("Ταχυδρομικός κώδικας"),
    "11111"
  );

  const gotoButton = await screen.queryByText("Αναζήτηση Ταχυδρομικού Κώδικα");
  await user.click(gotoButton);
  await waitForElementToBeRemoved(gotoButton, { timeout: 60000 });

  const setCenterMock = getSetCenterMock();
  expect(setCenterMock.calls).toHaveLength(1);
  expect(setCenterMock.calls[0][0]).toMatchObject({
    lat: firstTreeFoundWithZip.y,
    lng: firstTreeFoundWithZip.x,
  });
});

async function treesToLoad() {
  const loading = screen.queryByText(greekLabels.LOADING_TREES);
  expect(loading).toBeInTheDocument();

  await waitForElementToBeRemoved(loading, { timeout: 60000 });
}
