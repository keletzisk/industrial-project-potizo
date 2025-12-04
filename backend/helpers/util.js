const { OAuth2Client } = require("google-auth-library");
const logger = require("../util/pino");
const querystring = require("node:querystring");
const fetch = require("node-fetch");

async function authorizeWithGoogleOAuth(code) {
  if (
    !process.env.FRONTEND_GOOGLE_LOGIN_CLIENT_ID ||
    !process.env.FRONTEND_GOOGLE_LOGIN_CLIENT_SECRET
  )
    logger.info("No google login env vars set.");
  const oAuth2Client = new OAuth2Client(
    process.env.FRONTEND_GOOGLE_LOGIN_CLIENT_ID,
    process.env.FRONTEND_GOOGLE_LOGIN_CLIENT_SECRET,
    "postmessage"
  );
  const { tokens } = await oAuth2Client.getToken(code);
  const userInfo = await sendRequest(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    }
  );
  return {
    id: userInfo.sub,
    email: userInfo.email,
  };
}

function transformResponse(response) {
  const contentLength = response.headers.get("Content-Length");
  const contentType = response.headers.get("Content-Type");
  return contentLength !== "0" &&
    contentType &&
    contentType.includes("application/json")
    ? response.json()
    : response.text();
}

function sendRequest(
  url,
  {
    method = "GET",
    useCredentials = false,
    body,
    headers = {},
    queryParams: queryParameters = {},
  }
) {
  const options = {
    method,
    headers: new fetch.Headers({
      "content-type": "application/json",
      ...headers,
    }),
    body: body ? JSON.stringify(body) : null,
  };
  if (useCredentials) options.credentials = "include";
  if (Object.keys(queryParameters).length > 0) {
    url = `${url}?${querystring.stringify(queryParameters)}`;
  }

  return fetch(url, options)
    .then((response) => {
      const transformedResponse = transformResponse(response);

      return response.ok
        ? transformedResponse
        : transformedResponse.then(function (response) {
            return typeof response === "string"
              ? Promise.reject({
                  status: response.status,
                  ok: false,
                  message: response,
                })
              : Promise.reject({
                  status: response.status,
                  ok: false,
                  message: response.message,
                  body: response,
                });
          });
    })
    .catch((error) => {
      throw {
        status: error.status,
        ok: false,
        message: error.message,
        body: error.nody,
      };
    });
}

module.exports = {
  authorizeWithGoogleOAuth,
};
