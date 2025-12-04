import { Page, expect } from "@playwright/test";
import { greekLabels } from "../../frontend/src/util/language";
import { Tree } from "./tree";

export class TreeInfo {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async renameTree(newName: string) {
    await this.page.getByLabel("Edit").first().click();
    await this.page.getByRole("textbox").first().fill(newName);
    await this.page.getByLabel("Submit").click();
  }

  async waterTree() {
    await this.page
      .getByRole("button", { name: greekLabels.WATER_TREE })
      .first()
      .click();
  }

  async expectWaterButton() {
    const waterButton = this.page.getByRole("button", {
      name: greekLabels.WATER_TREE,
    });
    await expect(waterButton).toBeVisible();
  }

  async deleteTree() {
    await this.page.getByLabel("Delete tree").first().click();
    await this.page
      .getByRole("button", { name: greekLabels.DELETE_FROM_MY_TREES })
      .click();
  }

  getByText(newName: string | RegExp) {
    return this.page.getByText(newName);
  }

  async expectTreeInfo(tree: Tree) {
    await expect(this.page.getByText(tree.address)).toBeVisible();
    await expect(this.page.getByText(tree.name)).toBeVisible();
    await expect(
      this.page.getByText("Είδος: " + tree.type, { exact: true })
    ).toBeVisible();
  }

  async expectTreeName(tree: Tree) {
    await expect(this.page.getByText(tree.name)).toBeVisible();
  }

  async expectScreenShot() {
    await expect(this.page).toHaveScreenshot();
  }
}
