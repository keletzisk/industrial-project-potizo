import { Given, When, Then } from "@cucumber/cucumber";
import { CustomWorld } from "./world";

// LOGIN

Given('{string} is already a verified user', async function (this: CustomWorld, userString: string) {
  await this.addUserNamed(userString);
});

When('{string} logins', async function (this: CustomWorld, userString: string) {
  await this.loginAs(userString);
});

Then('{string} should be authenticated', async function (this: CustomWorld, userString: string) {
  await this.loginSucceded(userString);
});

// ADOPT

Given('{string} is authenticated', async function (this: CustomWorld, userString: string) {
  await this.addUserNamed(userString);
  await this.loginAs(userString);
  await this.loginSucceded(userString);
});

Given('{string} has adopted {int} trees', async function (this: CustomWorld, userString: string, times: number) {
  for (let index = 0; index < times; index++) {
    await this.addTreeAndAdoptionForUserNamed(userString);
  }
});

Given('{string} is an available tree', async function (treeString: any) {
  await this.addAvailableTreeNamed(treeString);
});

When('{string} attempts to adopt {string}', async function (this: CustomWorld, userString: string, treeString: string) {
  await this.attemptsToAdoptTree(userString, treeString);
});

Then('{string} should become adopted by {string}', async function (this: CustomWorld, treeString: string, userString: string) {
  await this.adoptionSucceded(treeString, userString);
});

