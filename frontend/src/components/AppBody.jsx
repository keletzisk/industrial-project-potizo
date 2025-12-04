import React, { Suspense, useContext } from "react";
import { Route, Navigate, Routes, useMatch } from "react-router-dom";
import { Flex, Spinner } from "@chakra-ui/react";
import { VerifyEmail } from "components/VerifyEmail/VerifyEmail";
import { NotificationsModal } from "components/Notifications/NotificationsModal";
import { ProtectedRoute } from "components/ProtectedRoute";
import { AuthContext } from "context/auth-context";
import { InfoPages } from "components/InfoPages";
import { MotTerms } from "components/Legal/MotTerms";
import { MotDataProtection } from "components/Legal/MotDataProtection";

const UserTrees = React.lazy(() =>
  import("components/Trees/UserTrees/UserTrees")
);
const MapDeckGl = React.lazy(() => import("components/Map/MapDeckGl"));
const Auth = React.lazy(() => import("components/Auth/Auth"));
const LandingPage = React.lazy(() =>
  import("components/LandingPage/LandingPage")
);
const Settings = React.lazy(() => import("components/Settings/Settings"));
const ResetPassword = React.lazy(() =>
  import("components/ResetPassword/ResetPassword")
);

export function AppBody() {
  const { userId } = useContext(AuthContext);
  const isAtIndexRoute = useMatch("/");

  return (
    <Flex
      id="app-body"
      maxW={!isAtIndexRoute && "1280px"}
      w="100%"
      pos="relative"
      flex="1"
      direction="column"
      align="center"
      alignSelf="center"
    >
      <NotificationsModal />
      <Suspense
        fallback={
          <Flex justify="center" align="center" mt={20}>
            <Spinner
              speed="0.6s"
              thickness="4px"
              colorScheme="green"
              size="xl"
            />
          </Flex>
        }
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/info-pages" element={<InfoPages />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/terms" element={<MotTerms />} />
          <Route path="/data-protection" element={<MotDataProtection />} />
          <Route element={<ProtectedRoute isAllowed={userId} />}>
            <Route path="/trees" element={<UserTrees />} />
            <Route path="/map" element={<MapDeckGl />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </Flex>
  );
}
