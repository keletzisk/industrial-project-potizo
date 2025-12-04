import {
  fetchTrees,
  fetchUserTreeData,
  getTreeInfo,
  getTreeNickName,
  getTreesVersion,
} from "services/api";
import { prettifyErrorMessage } from "util/helpers";

function storeTreeDataToLocalStorage(data, version) {
  if (!data || !version) return;
  localStorage.setItem("treeData", JSON.stringify(data));
  localStorage.setItem("treeDataVersion", version);
}

function getTreeDataFromLocalStorage() {
  if (!localStorage.getItem("treeData")) return;
  return JSON.parse(localStorage.getItem("treeData"));
}

function treeDataMapper(tree) {
  return {
    type: "Feature",
    properties: {
      id: tree.t,
      date: tree.d,
      owner: null,
      type: tree.type,
    },
    geometry: {
      type: "Point",
      coordinates: [tree.x, tree.y],
    },
  };
}

async function populateLSWithTrees(token) {
  const treesVersion = await getTreesVersion(token);
  if (
    localStorage.getItem("treeDataVersion") === treesVersion &&
    localStorage.getItem("treeData")
  )
  return;

  const fetchedTrees = await fetchTrees(token);

  storeTreeDataToLocalStorage(fetchedTrees, treesVersion);
}

export async function populateTreesAtLocalStorage(token) {
  try {
    await populateLSWithTrees(token);
  } catch (error) {
    console.error(error);
  }
}

function combineData(treeData, userData) {
  let combinedData = treeData;
  for (const tree of treeData) {
    for (const user of userData) {
      if (tree.properties.id === user.treeId) {
        tree.properties.owner = user.userId;
      }
    }
  }
  return combinedData;
}

export async function getCombinedUserTreeDataFromLSorAPI(auth, toast) {
  try {
    await populateLSWithTrees(auth.token);

    let fetchedTrees = getTreeDataFromLocalStorage();
    fetchedTrees = fetchedTrees?.map(treeDataMapper) || [];

    const userData = await fetchUserTreeData(auth.token);

    return combineData(fetchedTrees, userData);
  } catch (error) {
    prettifyErrorMessage(toast, error);
  }
}

export function orderedTreeData(sourceData, auth) {
  const reorderedData = [...sourceData];
  const userTrees = [];
  const availableTrees = [];
  const adoptedTrees = [];

  // Separate user's trees and other trees
  reorderedData.forEach((tree) => {
    if (!tree.properties.owner) {
      availableTrees.push(tree);
    } else if (tree.properties.owner === auth.userId) {
      userTrees.push(tree);
    } else {
      adoptedTrees.push(tree);
    }
  });

  return [...adoptedTrees, ...availableTrees, ...userTrees];
}

export async function fetchTreeInfoAndNickname(treeId, auth) {
  const treeInfoData = await getTreeInfo(auth.token, treeId);
  const treeName = await getTreeNickName(auth.token, treeId);

  return { info: treeInfoData, nickname: treeName };
}
