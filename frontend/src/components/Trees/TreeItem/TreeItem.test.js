import {
  render,
  screen,
  fireEvent,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

import { BrowserRouter } from "react-router-dom";

import { expectMockToastMessage } from "mocks/toast";
import { expectMockNavigate } from "mocks/navigateDom";
import {
  mockAPInickname,
  treeIdWithNickname,
  treeIdWithNullNickName,
} from "mocks/handlers";
import { createTree, getNextNumber } from "../../../../../backend/test/factory";
import { greekLabels } from "util/language";

import TreeItem from "./TreeItem";
import { enterText } from "test/utils";

const IVISKOS = {
  latinName: "Hibiscus sinensis",
  floweringSeason: "Μάιος-Οκτώβριος",
  Dimensions: {
    maxHeight: "1,5-2,5μ",
    maxCrownDiameter: "1-1,5μ",
  },
  Description:
    "Ο σινικός ιβίσκος είναι αειθαλής ή ημιαειθαλής, σφαιρικός θάμνος ή δένδρο μεσαίας ανάπτυξης. Έχει σκληρούς βλαστούς, πράσινα, λαμπερά φύλλα και μεγάλα άνθη με διάφορα χρώματα και σχήματα.",
};

describe("TreeItem", () => {
  it("receives a tree and displays its data and the nickname it receives", async () => {
    const tree = createTree(treeIdWithNickname);
    tree.type = "Ιβίσκος";

    renderTreeItem(tree);

    expect(screen.getByText(tree.type)).toBeInTheDocument();
    expect(screen.getByText(tree.address)).toBeInTheDocument();
    expect(screen.getByText(tree.name)).toBeInTheDocument();

    expect(screen.getByText(IVISKOS.latinName)).toBeInTheDocument();
    expect(screen.getByText(IVISKOS.floweringSeason)).toBeInTheDocument();
    expect(screen.getByText(IVISKOS.Dimensions.maxHeight)).toBeInTheDocument();
    expect(
      screen.getByText(IVISKOS.Dimensions.maxCrownDiameter)
    ).toBeInTheDocument();
    expect(screen.getByText(IVISKOS.Description)).toBeInTheDocument();

    // nickname appears after the get request
    await waitForElementToBeRemoved(() => screen.queryByText(tree.name));
    expect(await screen.findByText(mockAPInickname)).toBeInTheDocument();
  });

  it("receives a tree and displays its data, shows default name if it receives a null treeNickname", async () => {
    const tree = createTree(treeIdWithNullNickName);
    renderTreeItem(tree);

    expect(screen.getByText(tree.type)).toBeInTheDocument();
    expect(screen.getByText(tree.address)).toBeInTheDocument();
    expect(screen.getByLabelText("Tree name")).toBeInTheDocument();

    // nickname appears after the get request
    await waitForElementToBeRemoved(() => screen.queryByLabelText("Tree name"));
    expect(await screen.findByText(tree.name)).toBeInTheDocument();
  });

  it("changes the tree to watered when watering", async () => {
    const tree = createTree(treeIdWithNickname);
    renderTreeItem(tree);

    expect(screen.getByText(greekLabels.NOT_WATERED)).toBeInTheDocument();

    // CLICK on the water button
    fireEvent.click(screen.getByText(greekLabels.WATER_TREE));

    // expect button to be replaced and be disabled
    await waitForElementToBeRemoved(() =>
      screen.queryByText(greekLabels.WATER_TREE)
    );
    expect(screen.getByText(greekLabels.WATERED_RECENTLY)).toBeInTheDocument();
    expect(screen.getByText(greekLabels.WATERED_RECENTLY)).toBeDisabled();

    // toast with message called
    expectMockToastMessage(greekLabels.TREE_WATERED_SUCCESSFULLY);
  });

  it("deletes the tree when deleting", async () => {
    const tree = createTree(treeIdWithNickname);
    let fnPassedToSetLoadedTrees;

    const setLoadedTrees = function (f) {
      // capture the function passed to setLoadedTrees
      fnPassedToSetLoadedTrees = f;
    };

    renderTreeItem(tree, setLoadedTrees);

    // CLICK on the delete button
    const deleteButton = screen.getByLabelText("Delete tree");
    fireEvent.click(deleteButton);

    // and confirm
    const confirmButton = await screen.findByText(
      greekLabels.DELETE_FROM_MY_TREES
    );
    fireEvent.click(confirmButton);

    await waitForElementToBeRemoved(() =>
      screen.queryByText(greekLabels.DELETE_FROM_MY_TREES)
    );

    // toast with message called
    expectMockToastMessage(greekLabels.TREE_DELETED);

    // assert that the correct function is passed to setLoadedTrees
    const otherTreeId = getNextNumber();
    const trees = [{ id: treeIdWithNickname }, { id: otherTreeId }];
    expect(fnPassedToSetLoadedTrees(trees)).toHaveLength(1);
    expect(fnPassedToSetLoadedTrees(trees)[0].id).toEqual(otherTreeId);
  });

  it("renames the tree nickname", async () => {
    const user = userEvent.setup();
    const newNickName = "Some new name";
    const tree = createTree(treeIdWithNickname);

    renderTreeItem(tree);
    expect(await screen.findByText(mockAPInickname)).toBeInTheDocument();

    await user.click(await screen.findByLabelText("Edit"));
    await enterText(user, screen.getByRole("textbox"), newNickName);
    await user.click(screen.getByLabelText("Submit"));

    expect(await screen.findByText(newNickName)).toBeInTheDocument();
    expectMockToastMessage(greekLabels.SUCCESSFUL_TREE_RENAME);
  });

  it("navigates to the location of the tree on the map", async () => {
    const tree = createTree(treeIdWithNickname);

    renderTreeItem(tree);

    const goToMapButton = await screen.findByLabelText("Go to map location");
    fireEvent.click(goToMapButton);

    expectMockNavigate("/map", tree.latitude, tree.longitude);
  });
});

function renderTreeItem(tree, setLoadedTrees) {
  render(
    /*
         wrap in a BrowserRouter to solve:
         Error: Uncaught [Error: useNavigate() may be used
            only in the context of a <Router> component.
        */
    <BrowserRouter>
      <TreeItem tree={tree} setLoadedTrees={setLoadedTrees} />
    </BrowserRouter>
  );
}
