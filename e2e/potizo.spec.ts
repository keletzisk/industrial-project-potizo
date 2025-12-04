import { test, expect } from "@playwright/test";

import {
  adopted,
  adopted2,
  availableTree,
  availableTree2,
  initDatabase,
} from "./database";
import { MapPage } from "./pom/mapPage";
import { TreesPage } from "./pom/treesPage";
import { greekLabels } from "../frontend/src/util/language";

test.beforeEach(async ({ page }) => {
  await initDatabase();
});

test.describe("Trees Page", () => {
  let treesPage: TreesPage;

  test.beforeEach(async ({ page }) => {
    treesPage = new TreesPage(page);
    await treesPage.goto();
    await treesPage.allTreesAreLoaded(adopted, adopted2);
  });

  test("Trees Page rename", async () => {
    const newName = "A new name";
    await treesPage.treeInfo.renameTree(newName);

    await expect(treesPage.page.getByText(newName)).toBeVisible();
    await treesPage.treeInfo.expectScreenShot();
  });

  test("Trees Page water", async () => {
    await treesPage.treeInfo.waterTree();

    await expect(
      treesPage.page.getByText("Ποτίστηκε τελευταία: Σήμερα")
    ).toBeVisible();
    await treesPage.treeInfo.expectScreenShot();
  });

  test("Trees Page delete", async () => {
    await treesPage.treeInfo.deleteTree();

    await expect(
      treesPage.page.getByText(greekLabels.TREE_DELETED)
    ).toBeVisible();
    await expect(treesPage.page.getByText(adopted.address)).not.toBeVisible();
    await treesPage.treeInfo.expectScreenShot();
  });
});

test.describe("Map Page", () => {
  let mapPage: MapPage;

  test.beforeEach(async ({ page }) => {
    mapPage = new MapPage(page);
    await mapPage.goto();
  });

  test("View map", async () => {
    await mapPage.expectMapToLoad({ notifications: true });

    // initially map centers on the first adopted tree
    await mapPage.treeInfo.expectScreenShot();
  });

  test("Focus on my trees", async () => {
    await mapPage.expectMapToLoad({ notifications: true });

    // initially map centers on the first tree
    // clicking on the zoom to trees button
    // centers on the second tree
    await mapPage.zoomToTrees();
    await mapPage.clickOnCenter();
    await mapPage.treeInfo.expectTreeInfo(adopted2);
    await mapPage.closeTreeInfo(adopted2);

    // ... and clicking again cycles back to the first
    await mapPage.zoomToTrees();
    await mapPage.clickOnCenter();
    await mapPage.treeInfo.expectTreeInfo(adopted);
  });

  test.describe("Map Tree first adopted", () => {
    // The tests are based on the assumption that
    // once the map loads it focuses on the first adopted tree

    test.beforeEach(async () => {
      await mapPage.expectMapToLoad({ notifications: true });
      await mapPage.clickOnCenter();
      await mapPage.treeInfo.expectTreeInfo(adopted);
    });

    test("Map Tree info rename", async () => {
      const newName = "A new name";

      await mapPage.treeInfo.renameTree(newName);

      await expect(mapPage.page.getByText(newName)).toBeVisible();
      await mapPage.treeInfo.expectScreenShot();
    });

    test("Map Tree info delete", async () => {
      await mapPage.treeInfo.deleteTree();

      await expect(
        mapPage.page.getByText(greekLabels.TREE_DELETED)
      ).toBeVisible();
      await mapPage.treeInfo.expectScreenShot();
    });

    test("Map Tree info water", async () => {
      await mapPage.treeInfo.waterTree();

      await expect(
        mapPage.page.getByText(greekLabels.TREE_WATERED_SUCCESSFULLY)
      ).toBeVisible();
      await mapPage.treeInfo.expectScreenShot();
    });
  });

  test.describe("Map Tree available", () => {
    test("Click on available trees", async ({ context }) => {
      await mapPage.expectMapToLoad({ notifications: true });

      await context.setGeolocation({
        latitude: availableTree.latitude,
        longitude: availableTree.longitude,
      });
      await mapPage.gotoCurrentLocation();
      await mapPage.clickOnCenter();
      await mapPage.treeInfo.expectTreeInfo(availableTree);
      await mapPage.closeTreeInfo(availableTree);

      await context.setGeolocation({
        latitude: availableTree2.latitude,
        longitude: availableTree2.longitude,
      });
      await mapPage.gotoCurrentLocation();
      await mapPage.clickOnCenter();
      await mapPage.treeInfo.expectTreeInfo(availableTree2);
    });

    test("Adopt available", async ({ context }) => {
      await context.setGeolocation({
        latitude: availableTree.latitude,
        longitude: availableTree.longitude,
      });

      await mapPage.expectMapToLoad({ notifications: true });
      await mapPage.gotoCurrentLocation();
      await mapPage.clickOnCenter();
      await mapPage.treeInfo.expectTreeInfo(availableTree);

      await mapPage.adopt();

      await mapPage.expectAdopted();

      await mapPage.clickOnCenter();
      await mapPage.treeInfo.expectWaterButton();
    });
  });
});
