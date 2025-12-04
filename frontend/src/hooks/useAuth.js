import { useCallback, useEffect, useState } from "react";
import { isBefore } from "date-fns";

// Increment this to invalidate users' local storage
const USER_DATA_SCHEMA_VERSION = 1;

export function checkIfLoggedIn() {
  const storedData = JSON.parse(localStorage.getItem("userData"));
  if (storedData?.userDataSchemaVersion !== USER_DATA_SCHEMA_VERSION) {
    localStorage.removeItem("userData");
    return false;
  }

  return (
    storedData &&
    storedData.token &&
    isBefore(new Date(), new Date(storedData.expiration))
  );
}

const JWT_EXPIRES_IN = 60 * 60;

export const useAuth = () => {
  const [token, setToken] = useState();
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(checkIfLoggedIn());
  const [email, setEmail] = useState();
  const [isLinkedAccount, setIsLinkedAccount] = useState(false);

  const login = useCallback(
    ({ userId, token, email, isLinkedAccount, expirationDate }) => {
      const tokenExpirationDate =
        expirationDate ||
        new Date(new Date().getTime() + 1000 * JWT_EXPIRES_IN);

      setTokenExpirationDate(tokenExpirationDate);
      setToken(token);
      setUserId(userId);
      setEmail(email);
      setIsLinkedAccount(isLinkedAccount);

      localStorage.setItem(
        "userData",
        JSON.stringify({
          userId,
          token,
          email,
          isLinkedAccount,
          expiration: tokenExpirationDate.toISOString(),
          userDataSchemaVersion: USER_DATA_SCHEMA_VERSION,
        })
      );
    },
    []
  );

  const logout = useCallback(() => {
    setToken();
    setTokenExpirationDate();
    setUserId();
    setEmail();
    setIsLinkedAccount(false);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    let logoutTimer;

    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, email, isLinkedAccount, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData?.userDataSchemaVersion !== USER_DATA_SCHEMA_VERSION) {
      localStorage.removeItem("userData");
      logout();
      return;
    }

    if (
      storedData &&
      storedData.token &&
      storedData.expiration &&
      isBefore(new Date(), new Date(storedData.expiration))
    ) {
      login({
        userId: storedData.userId,
        token: storedData.token,
        email: storedData.email,
        isLinkedAccount: storedData.isLinkedAccount,
        expirationDate: new Date(storedData.expiration),
      });
    }
  }, [login, logout]);

  // Returns all current data values
  return { token, login, logout, userId, email, isLinkedAccount };
};
