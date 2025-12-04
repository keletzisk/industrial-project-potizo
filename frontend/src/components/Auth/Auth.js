import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/auth-context";
import { useNavigate } from "react-router";
import jwt from "jwt-decode";
import { greekLabels } from "../../util/language";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { login, requestResetPassword, signup } from "services/api";
import { ForgotPasswordModal } from "components/Auth/ForgotPasswordModal";
import { CustomGoogleLogin } from "components/Auth/CustomGoogleLogin";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";

import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { toastError } from "util/helpers";

let EMAIL_REGX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .matches(EMAIL_REGX, greekLabels.INVALID_EMAIL_ADDRESS)
    .required(greekLabels.REQUIRED_FIELD),
  password: Yup.string()
    .min(8, greekLabels.USE_PROPER_PASSWORD)
    .max(32, greekLabels.USE_PROPER_PASSWORD)
    .required(greekLabels.REQUIRED_FIELD),
});

const SignupSchema = Yup.object().shape({
  email: Yup.string()
    .matches(EMAIL_REGX, greekLabels.INVALID_EMAIL_ADDRESS)
    .required(greekLabels.REQUIRED_FIELD),
  password: Yup.string()
    .min(8, greekLabels.USE_PROPER_PASSWORD)
    .max(32, greekLabels.USE_PROPER_PASSWORD)
    .required(greekLabels.REQUIRED_FIELD),
  terms: Yup.bool()
    .oneOf([true], greekLabels.REQUIRED_FIELD)
    .required(greekLabels.REQUIRED_FIELD),
});

const Auth = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const toast = useToast();
  const {
    isOpen: isResetOpen,
    onOpen: onResetOpen,
    onClose: onResetClose,
  } = useDisclosure();

  const handleEmailInputChange = (event) => setEmailInput(event.target.value);

  const requestResetPasswordHandler = async () => {
    requestResetPassword(emailInput)
      .then((res) => {
        setEmailInput("");
        onResetClose();
        toast({
          title: greekLabels.RECEIVE_EMAIL_FOR_PASSWORD_RESET,
          status: "success",
          isClosable: true,
        });
      })
      .catch((error) => {
        toastError(toast, error);
      });
  };

  const authSubmitHandler = async (data) => {
    const { email, password } = data;
    if (mode === "login") {
      login(email, password)
        .then((response) => {
          const decodedToken = jwt(response.token);
          auth.login({
            userId: decodedToken.userId,
            token: response.token,
            email: decodedToken.email,
            isLinkedAccount: decodedToken.isLinkedAccount,
          });
          navigate("/trees");
        })
        .catch((error) => {
          toastError(toast, error);
        });
    } else if (mode === "registration") {
      signup(email, password)
        .then((response) => {
          toast({
            title: greekLabels.VERIFICATION_CODE_SENT,
            status: "success",
            isClosable: true,
            duration: 10000,
          });
        })
        .catch((error) => {
          toastError(toast, error);
        });
    }
  };

  return (
    <Container maxW="md" p={5}>
      <ForgotPasswordModal
        isResetOpen={isResetOpen}
        onResetClose={onResetClose}
        handleEmailInputChange={handleEmailInputChange}
        confirmResetPasswordHandler={requestResetPasswordHandler}
      />

      <Flex
        boxShadow="lg"
        alignSelf="center"
        mt={5}
        px={5}
        py={3}
        maxW="25rem"
        direction="column"
        rounded="md"
      >
        {mode !== "verification" && (
          <>
            <Formik
              initialValues={
                mode === "login"
                  ? {
                      email: "",
                      password: "",
                    }
                  : {
                      email: "",
                      password: "",
                      terms: false,
                    }
              }
              validationSchema={mode === "login" ? LoginSchema : SignupSchema}
              onSubmit={authSubmitHandler}
            >
              {(props) => {
                return (
                  <Form>
                    <Flex direction="column">
                      <Flex direction="column">
                        <Field name="email">
                          {({ field, form }) => (
                            <FormControl
                              isRequired
                              isInvalid={
                                form.errors.email && form.touched.email
                              }
                              mb={5}
                            >
                              <FormLabel>{greekLabels.EMAIL_ADDRESS}</FormLabel>
                              <Input {...field} />
                              <FormErrorMessage
                                pos="absolute"
                                top="100%"
                                fontSize="xs"
                                mt={1}
                              >
                                {form.errors.email}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                        <Field name="password">
                          {({ field, form }) => (
                            <FormControl
                              isRequired
                              isInvalid={
                                form.errors.password && form.touched.password
                              }
                              mb={5}
                            >
                              <FormLabel>{greekLabels.PASSWORD}</FormLabel>
                              <InputGroup>
                                <Input
                                  {...field}
                                  type={showPassword ? "text" : "password"}
                                />
                                <InputRightElement>
                                  <Icon
                                    onClick={() =>
                                      setShowPassword((prev) => !prev)
                                    }
                                    cursor="pointer"
                                    as={showPassword ? FaEyeSlash : FaEye}
                                    color="gray"
                                  />
                                </InputRightElement>
                              </InputGroup>
                              <FormErrorMessage
                                pos="absolute"
                                top="100%"
                                fontSize="xs"
                                mt={1}
                              >
                                {form.errors.password}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                        {mode === "registration" && (
                          <Flex direction="column">
                            <Text fontSize="xs">
                              Πριν προχωρήσεις στην εγγραφή και τη χρήση της
                              εφαρμογής «ΠοτίΖΩ», διάβασε προσεκτικά τους{" "}
                              <Link as={RouterLink} color="blue" to="/terms">
                                Όρους Χρήσης
                              </Link>{" "}
                              και την{" "}
                              <Link
                                as={RouterLink}
                                color="blue"
                                to="/data-protection"
                              >
                                {" "}
                                Πολιτική Προστασίας Προσωπικών Δεδομένων{" "}
                              </Link>{" "}
                              που διέπουν τη χρήση της και τις υπηρεσίες που
                              παρέχονται μέσω αυτής. Για να συνεχίσεις, πρέπει
                              να αποδεχθείς τους όρους και τις προϋποθέσεις
                            </Text>

                            <Field name="terms">
                              {({ field, form }) => (
                                <FormControl
                                  isRequired
                                  isInvalid={
                                    form.errors.terms && form.touched.terms
                                  }
                                  mb={5}
                                >
                                  <Checkbox {...field} mt={3}>
                                    <Text ml={1} fontSize="sm">
                                      Αποδέχομαι τους όρους χρήσης και την
                                      πολιτική προστασίας προσωπικών δεδομένων.
                                    </Text>
                                  </Checkbox>
                                  <FormErrorMessage
                                    pos="absolute"
                                    top="100%"
                                    fontSize="xs"
                                    mt={1}
                                  >
                                    {form.errors.terms}
                                  </FormErrorMessage>
                                </FormControl>
                              )}
                            </Field>
                          </Flex>
                        )}
                        {mode === "login" && (
                          <Box ml="auto" mb={2}>
                            <Text
                              cursor="pointer"
                              align="center"
                              fontSize="xs"
                              onClick={onResetOpen}
                            >
                              {greekLabels.FORGOT_PASSWORD}
                            </Text>
                          </Box>
                        )}
                        <Button
                          isDisabled={!props.dirty || !props.isValid}
                          isLoading={props.isSubmitting}
                          colorScheme="green"
                          type="submit"
                        >
                          {mode === "login"
                            ? greekLabels.LOGIN
                            : greekLabels.CREATE_NEW_ACCOUNT}
                        </Button>
                      </Flex>

                      {mode !== "verification" && (
                        <Text fontSize="xs" mt={2} alignSelf="center">
                          {mode === "registration"
                            ? greekLabels.GO_TO_LOGIN
                            : greekLabels.GO_TO_SIGNUP}
                          <Text
                            as="span"
                            cursor="pointer"
                            display="inline"
                            color="blue"
                            onClick={() => {
                              setMode((prev) =>
                                prev === "login" ? "registration" : "login"
                              );
                              props.resetForm();
                            }}
                          >
                            {" "}
                            {mode === "registration"
                              ? greekLabels.LOGIN
                              : greekLabels.SIGNUP}
                          </Text>
                        </Text>
                      )}

                      <Divider my={2} />
                      <CustomGoogleLogin />
                    </Flex>
                  </Form>
                );
              }}
            </Formik>
          </>
        )}
      </Flex>
    </Container>
  );
};

export default Auth;
