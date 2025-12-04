const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/api";

// returns a Promise
function transformToJsonOrTextPromise(response) {
  const contentLength = response.headers.get("Content-Length");
  const contentType = response.headers.get("Content-Type");
  if (
    contentLength !== "0" &&
    contentType &&
    contentType.includes("application/json")
  ) {
    return response.json();
  } else {
    return response.text();
  }
}

async function sendRequest(url, { method = "GET", body, headers = {} }) {
  const options = {
    method,
    headers: new Headers({ "content-type": "application/json", ...headers }),
    body: body ? JSON.stringify(body) : null,
  };

  return fetch(url, options).then((res) => {
    const jsonOrTextPromise = transformToJsonOrTextPromise(res);

    if (res.ok) {
      return jsonOrTextPromise;
    } else {
      return jsonOrTextPromise.then(function (response) {
        const responseObject = {
          status: res.status,
          ok: false,
          message: typeof response === "string" ? response : response.message,
        };

        return Promise.reject(responseObject);
      });
    }
  });
}

export async function adopt(token, treeId) {
  return sendRequest(BACKEND_URL + `/trees/${treeId}/adopt`, {
    method: "PATCH",
    headers: {
      Authorization: "JWT " + token,
    },
  });
}

export async function water(token, treeId) {
  return sendRequest(BACKEND_URL + `/trees/${treeId}/water`, {
    method: "PATCH",
    headers: {
      Authorization: "JWT " + token,
    },
  });
}

export async function renameTree(token, treeId, name) {
  return sendRequest(BACKEND_URL + `/trees/${treeId}/rename`, {
    method: "PATCH",
    body: {
      name,
    },
    headers: {
      Authorization: "JWT " + token,
    },
  });
}

export async function deleteTree(token, treeId) {
  return sendRequest(BACKEND_URL + `/trees/${treeId}/abandon`, {
    method: "PATCH",
    headers: {
      Authorization: "JWT " + token,
    },
  });
}

export async function zipCodeSearch(token, zip) {
  return sendRequest(BACKEND_URL + `/trees/getTreeByZip/${zip}`, {
    headers: {
      Authorization: "JWT " + token,
    },
  });
}

export async function fetchTrees(token) {
  return sendRequest(BACKEND_URL + `/trees`, {
    headers: {
      Authorization: "JWT " + token,
    },
  }).then((response) => response.data);
}

export async function fetchTreesOfUser(token) {
  return sendRequest(BACKEND_URL + `/trees/user`, {
    headers: {
      Authorization: "JWT " + token,
    },
  }).then((response) => response.data.trees);
}

export async function fetchUserTreeData(token) {
  return sendRequest(BACKEND_URL + `/trees/getUserData`, {
    headers: {
      Authorization: "JWT " + token,
    },
  }).then((response) => response.data);
}

export async function getTreeInfo(token, treeId) {
  return sendRequest(BACKEND_URL + `/trees/${treeId}/getTreeInfo`, {
    headers: {
      Authorization: "JWT " + token,
    },
  }).then((response) => response.data);
}

export async function getTreeNickName(token, treeId) {
  return sendRequest(BACKEND_URL + `/trees/${treeId}/treenickname`, {
    headers: {
      Authorization: "JWT " + token,
    },
  }).then((response) => response.data.treeNickname);
}

export async function deleteUser(token) {
  return sendRequest(BACKEND_URL + `/users/delete/`, {
    method: "DELETE",
    headers: {
      Authorization: "JWT " + token,
    },
  });
}

export async function requestResetPassword(email) {
  return sendRequest(BACKEND_URL + "/users/reset-password", {
    method: "POST",
    body: {
      email,
    },
  });
}

export async function finishResetPassword(newPassword, resetPasswordToken) {
  return sendRequest(BACKEND_URL + "/users/reset-password/finish", {
    method: "POST",
    body: {
      newPassword,
      resetPasswordToken,
    },
  });
}

export async function login(email, password) {
  return sendRequest(BACKEND_URL + "/users/login", {
    method: "POST",
    body: {
      email,
      password,
    },
  });
}

export async function googleLogin(code) {
  return sendRequest(BACKEND_URL + "/users/google-login", {
    method: "POST",
    body: {
      code,
    },
  });
}

export async function signup(email, password) {
  return sendRequest(BACKEND_URL + "/users/signup", {
    method: "POST",
    body: {
      email,
      password,
    },
  });
}

export async function verifyEmail(token) {
  return sendRequest(BACKEND_URL + "/users/verify-email", {
    method: "POST",
    body: {
      token,
    },
  });
}

export async function getTreesVersion(token) {
  return sendRequest(BACKEND_URL + `/trees/version`, {
    headers: {
      Authorization: "JWT " + token,
    },
  }).then((response) => response.data);
}

export async function getNotSeenNotifications(token) {
  return sendRequest(BACKEND_URL + `/users/notifications/not-seen`, {
    headers: {
      Authorization: "JWT " + token,
    },
  }).then((response) => response.data);
}

export async function setAllNotificationsToSeen(token) {
  return sendRequest(BACKEND_URL + `/users/notification/see`, {
    method: "PATCH",
    headers: {
      Authorization: "JWT " + token,
    },
  }).then((response) => response.data);
}
