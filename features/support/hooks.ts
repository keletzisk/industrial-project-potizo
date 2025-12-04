import { After, AfterAll, Before, BeforeAll, setDefaultTimeout } from "@cucumber/cucumber";
import { Browser, chromium } from "@playwright/test";
import { CustomWorld } from "./world";

setDefaultTimeout(30000);

export let browser: Browser;

BeforeAll(async function () {
  browser = await chromium.launch({
    headless: process.env.HEADLESS !== "false"
  });
});

Before(async function (this: CustomWorld) {
  await this.before();
});

After(async function (this: CustomWorld) {
  await this.after();
});

AfterAll(async function () {
  await browser.close();
});
