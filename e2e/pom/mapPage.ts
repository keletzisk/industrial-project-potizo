import { Page, expect } from "@playwright/test";
import { TreeInfo } from "./treeInfoPage";
import { greekLabels } from "../../frontend/src/util/language";
import { Tree } from "./tree";

export class MapPage {
  page: Page;
  treeInfo: TreeInfo;

  constructor(page: Page) {
    this.page = page;
    this.treeInfo = new TreeInfo(page);
  }

  async goto() {
    await this.page.goto("/map");
  }

  async adopt() {
    await this.page.getByRole("button", { name: greekLabels.ADOPT_IT }).click();
  }

  async expectMapToLoad(options = { notifications: false }) {
    const loading = this.page.getByText(greekLabels.LOADING_TREES);

    // show info for maps
    const infoPage = this.page.getByText(greekLabels.INFO_MODAL_HEADER);
    await this.page
      .getByLabel(greekLabels.INFO_MODAL_HEADER)
      .getByLabel("Close")
      .click();

    await expect(infoPage).not.toBeVisible();
    await expect(loading).not.toBeVisible();

    if (options?.notifications) {
      // // only if there are notifications
      const markAsReadButton = this.page.getByText(greekLabels.MARK_AS_READ);
      await markAsReadButton.click();

      await expect(markAsReadButton).not.toBeVisible();
    }
  }

  async zoomToTrees() {
    await this.page.getByLabel("My trees").click();
  }

  async gotoCurrentLocation() {
    // click on button for current location => centers the map so that
    // clicking on the center opens the tree at that location
    await this.page.getByLabel("Go to current location").click();

    // close modal
    await this.page
      .getByRole("status")
      .filter({ hasText: greekLabels.SUCCESSFUL_GEOLOCATION })
      .getByLabel("Close")
      .click();
  }

  async closeTreeInfo(tree: Tree) {
    await this.page.getByLabel(tree.address).getByLabel("Close").click();
  }

  async clickOnCenter() {
    const viewport = this.page.viewportSize();
    if (!viewport) {
      throw new Error("Viewport is null");
    }
    // click on the middle of the map, with an (offset: y+30) for the navbar
    await this.page.mouse.click(viewport.width / 2, viewport.height / 2 + 30);
  }

  async expectAdopted() {
    // close modal
    await this.page
      .getByRole("status")
      .filter({ hasText: greekLabels.CONGRATULATIONS })
      .getByLabel("Close")
      .click();
  }
}
