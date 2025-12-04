import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthContext } from "context/auth-context";
import { useAuth } from "hooks/useAuth";
import { MainNavigation } from "components/Navigation/MainNavigation/MainNavigation";
import { ChakraProvider, Flex } from "@chakra-ui/react";
import { populateTreesAtLocalStorage } from "components/Map/mapService";
import theme from "util/theme";
import { GoogleOAuthProvider } from "@react-oauth/google";

import "@fontsource/roboto/latin.css";
import "@fontsource/roboto/greek.css";

import "./index.css";

import { AppBody } from "components/AppBody";

const App = () => {
  const { token, login, logout, userId, email, isLinkedAccount } = useAuth();

  useEffect(() => {
    if (userId && token) {
      populateTreesAtLocalStorage(token);
    }
  }, [token, userId]);

  return (
    <ChakraProvider theme={theme}>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <Flex minHeight="100vh" direction="column">
          <AuthContext.Provider
            value={{
              token: token,
              userId: userId,
              login: login,
              logout: logout,
              email: email,
              isLinkedAccount,
            }}
          >
            <Router>
              <MainNavigation />
              <AppBody />
            </Router>
          </AuthContext.Provider>
        </Flex>
      </GoogleOAuthProvider>
    </ChakraProvider>
  );
};

export default App;
