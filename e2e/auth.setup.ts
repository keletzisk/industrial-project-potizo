import { test as setup, expect } from "@playwright/test";
import { initDatabase, getUser } from "./database.js";
import { LoginPage } from "./pom/loginPage.js";

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
  await initDatabase();

  const loginPage = new LoginPage(page);
  await loginPage.login(getUser("Bob"));
  await loginPage.expectLoginSucceded(getUser("Bob"));

  // Save the authentication context
  await page.context().storageState({ path: authFile });
});
