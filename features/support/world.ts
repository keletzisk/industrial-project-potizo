import { setWorldConstructor, setDefaultTimeout } from "@cucumber/cucumber";
import { databaseFixture, initDatabase } from "../../e2e/database";
import { LoginPage } from "../../e2e/pom/loginPage";
import { browser } from "./hooks";
import { createTree, createUser, createUserTree, getNextNumber } from "../../backend/test/factory";
import { MapPage } from "../../e2e/pom/mapPage";
import { BrowserContext, Page } from "@playwright/test";
import { TreesPage } from "../../e2e/pom/treesPage";

setDefaultTimeout(60 * 1000);

export class CustomWorld {
  mapPage: MapPage;
  loginPage: LoginPage;
  treesPage: TreesPage;
  context: BrowserContext;
  page: Page;
  users: Map<string, any>;
  trees: Map<string, any>;

  async before() {
    this.context = await browser.newContext({
      permissions: ['geolocation'],
      baseURL: "http://localhost:3000",
    });

    this.page = await this.context.newPage();
    this.loginPage = new LoginPage(this.page);
    this.mapPage = new MapPage(this.page);
    this.treesPage = new TreesPage(this.page);

    await initDatabase();
    this.users = new Map();
    this.trees = new Map();
  }

  async after() {
    await this.page.close();
    await this.context.close();
  }

  async loginAs(userString: string) {
    const user = this.getUser(userString);
    await this.loginPage.login(user);
  }

  async loginSucceded(userString: string) {
    await this.loginPage.expectLoginSucceded(this.users.get(userString));
  }

  async addUserNamed(userString: string) {
    const user = createUser(getNextNumber());
    await databaseFixture.addUser(user);
    this.users.set(userString, user);
  }

  async addTreeAndAdoptionForUserNamed(userString: string) {
    const user = this.getUser(userString);
    const tree = createTree(getNextNumber());
    await databaseFixture.addTree(tree);
    await databaseFixture.addUserTree(createUserTree(user.id, tree.id));
  }

  async addAvailableTreeNamed(treeString: string) {
    const tree = createTree(getNextNumber());
    tree.latitude += 0.0007;
    tree.longitude += 0.0007;
    tree.name = "To be adopted"
    await databaseFixture.addTree(tree);
    this.trees.set(treeString, tree);

    // treeData is already loaded at App start
    // so we need to delete it before loading the map
    // so that the new tree appears on the map
    await this.page.evaluate(() =>
      localStorage.removeItem("treeData")
    );
  }

  async attemptsToAdoptTree(userString: string, treeString: string) {
    const user = this.getUser(userString);
    const tree = this.getTree(treeString);

    await this.context.setGeolocation({ longitude: tree.longitude, latitude: tree.latitude });
    await this.mapPage.goto();
    await this.mapPage.expectMapToLoad();
    await this.mapPage.gotoCurrentLocation();
    await this.mapPage.clickOnCenter();
    await this.mapPage.treeInfo.expectTreeInfo(tree);

    await this.mapPage.adopt();
  }

  async adoptionSucceded(treeString: string, userString: string) {
    await this.mapPage.expectAdopted();
    await this.treesPage.goto();
    await this.treesPage.treeInfo.expectTreeName(this.getTree(treeString));
  }

  getUser(userString: string) {
    const user = this.users.get(userString);
    if (!user) throw new Error("User with name:" + userString + " not found!")
    return user;
  }

  getTree(treeString: string) {
    const tree = this.trees.get(treeString);
    if (!tree) throw new Error("Tree with name:" + treeString + " not found!")
    return tree;
  }

}

setWorldConstructor(CustomWorld);

