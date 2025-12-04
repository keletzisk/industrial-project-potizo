import { Page, expect } from "@playwright/test";
import { greekLabels } from "../../frontend/src/util/language";
import { TreeInfo } from "./treeInfoPage";
import { Tree } from "./tree";

export class TreesPage {
  page: Page;
  treeInfo: TreeInfo;

  constructor(page: Page) {
    this.page = page;
    this.treeInfo = new TreeInfo(page);
  }

  async goto() {
    await this.page.goto("/trees");
  }

  async allTreesAreLoaded(...trees: Tree[]) {
    await this.page.getByText(greekLabels.MARK_AS_READ).click();

    for (const tree of trees) {
      await this.treeInfo.expectTreeInfo(tree);
    }
    await expect(this.page.getByLabel("Go to map location")).toHaveCount(
      trees.length
    );
  }
}
