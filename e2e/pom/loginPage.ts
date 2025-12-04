import { Page, expect } from "@playwright/test";

export class LoginPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async login(user) {
    await this.page.goto("/");
    await this.page.getByRole("link", { name: "Σύνδεση" }).click();
    await expect(this.page).toHaveURL(/.*auth/);
    await this.page.getByLabel("Διεύθυνση email").fill(user.email);
    await this.page.getByLabel("Κωδικός").fill(user.password);
    await this.page
      .getByRole("button", { name: "Σύνδεση", exact: true })
      .click();
  }

  async expectLoginSucceded(user) {
    // Wait until the trees page loads with one tree visible
    await expect(this.page).toHaveURL(/.*trees/);

    const userData = await this.page.evaluate(() =>
      JSON.parse(localStorage["userData"])
    );
    expect(userData.email).toEqual(user.email);
  }
}
