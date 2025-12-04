import { DBFixture } from "../backend/test/freshDatabase";
import { createUser, createTree, createUserTree, createNotification } from "../backend/test/factory";

/** @type DBFixture */
export let databaseFixture;

const user = createUser(1);
const otherUser = createUser(2);
export const adopted = createTree(1);
export const availableTree = createTree(2);
export const adopted2 = createTree(3);
export const oldTree = createTree(4);
export const adoptedByOtherTree = createTree(5);
export const availableTree2 = createTree(6);

const adoption = createUserTree(1, 1);
const adoption2 = createUserTree(1, 3);
const adoption3 = createUserTree(2, 5);

adopted2.type = "Ακακία";
availableTree.type = "Δάφνη";
availableTree2.type = "Κέλτις";

const offset = 0.0005;
availableTree.latitude = adopted.latitude + offset;
availableTree2.latitude = availableTree.latitude + offset;
adoptedByOtherTree.latitude = availableTree.latitude + offset / 20;

adopted2.longitude = adopted.longitude + offset;

oldTree.latitude = adopted.latitude + offset;
oldTree.longitude = adopted.longitude + offset;
oldTree.createdAt = "2022-12-31";

const notification = createNotification(1);

export async function initDatabase() {
  databaseFixture = new DBFixture();

  await databaseFixture.populate({
    users: [user, otherUser],
    notifications: [notification],
    trees: [adopted, availableTree, adopted2, oldTree, adoptedByOtherTree, availableTree2],
    userTrees: [adoption, adoption2, adoption3],
  });
}

export function getUser(userString) {
  if (userString === "Bob") {
    return user;
  }
  throw new Error("User not found: " + userString);
}
