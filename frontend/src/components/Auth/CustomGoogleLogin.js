import { Button, HStack, Text, useToast } from "@chakra-ui/react";
import { useContext } from "react";
import { googleLogin } from "services/api";
import jwt from "jwt-decode";
import { AuthContext } from "context/auth-context";
import { useNavigate } from "react-router";
import { useGoogleLogin } from "@react-oauth/google";
import { ReactComponent as GoogleLogo } from "assets/icons/btn_google_dark_normal.svg";

export function CustomGoogleLogin() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const toast = useToast();

  const onGoogleLoginClick = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async ({ code }) => {
      try {
        const serverResponse = await googleLogin(code);
        const decodedToken = jwt(serverResponse.token);
        auth.login({
          userId: decodedToken.userId,
          token: serverResponse.token,
          email: decodedToken.email,
          isLinkedAccount: decodedToken.isLinkedAccount,
        });
        navigate("/trees");
      } catch (error) {
        toast({
          title: error.message,
          status: "error",
          isClosable: true,
        });
      }
    },
    onError: (error) =>
      toast({
        title: error?.message,
        status: "error",
        isClosable: true,
      }),
  });

  return (
    <Button
      height="42px"
      justifyContent="center"
      onClick={onGoogleLoginClick}
      bgColor="#4285F4"
      _hover={{
        bgColor: "#3d62cd",
      }}
      color="white"
    >
      <HStack>
        <GoogleLogo />
        <Text>Σύνδεση με Google</Text>
      </HStack>
    </Button>
  );
}
