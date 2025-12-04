import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import { AuthContext } from "context/auth-context";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyEmail } from "services/api";
import { greekLabels } from "util/language";
import jwtDecode from "jwt-decode";
import { prettifyErrorMessage } from "util/helpers";

export function VerifyEmail() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [isVerificationComplete, setIsVerificationComplete] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const hasVerifiedOnceRef = useRef(false);

  useEffect(() => {
    const token = searchParams.get("token");
    if (hasVerifiedOnceRef.current || !token || auth.token) return;

    setLoading(true);
    hasVerifiedOnceRef.current = true;
    verifyEmail(token)
      .then((response) => {
        const decodedToken = jwtDecode(response.token);
        setLoading(false);
        setIsVerificationComplete(true);
        auth.login({
          userId: decodedToken.userId,
          token: response.token,
          email: decodedToken.email,
          isLinkedAccount: decodedToken.isLinkedAccount,
        });
        setTimeout(() => {
          navigate("/map");
        }, 5000);
      })
      .catch((error) => {
        setIsVerificationComplete(false);
        setLoading(false);
        setErrorMessage(`Σφάλμα: ${prettifyErrorMessage(error)}`);
      });
  }, [auth, navigate, searchParams]);

  return loading ? (
    <Flex justify="center" align="center" mt={20}>
      <Spinner speed="0.6s" thickness="4px" colorScheme="green" size="xl" />
    </Flex>
  ) : (
    <Alert
      status={isVerificationComplete ? "success" : "error"}
      variant="subtle"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      height="200px"
      maxW="50rem"
      w="90%"
      borderRadius="1rem"
      boxShadow="lg"
      border="2px"
      borderColor="rgb(0, 0, 0, 0.1)"
      my={10}
      mx="auto"
    >
      <AlertIcon boxSize="40px" mr={0} />
      <AlertTitle mt={4} mb={1} fontSize="lg">
        {isVerificationComplete
          ? greekLabels.SUCCESSFUL_EMAIL_VERIFICATION
          : greekLabels.FAILED_EMAIL_VERIFICATION}
      </AlertTitle>
      <AlertDescription maxWidth="sm">
        {isVerificationComplete
          ? greekLabels.YOU_WILL_BE_REDIRECTED_SHORTLY
          : errorMessage}
      </AlertDescription>
    </Alert>
  );
}
