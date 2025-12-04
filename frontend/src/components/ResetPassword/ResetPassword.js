import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { greekLabels } from "util/language";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useSearchParams } from "react-router-dom";
import { finishResetPassword } from "services/api";
import { AuthContext } from "context/auth-context";
import { prettifyErrorMessage } from "util/helpers";

const FormSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(8, greekLabels.USE_PROPER_PASSWORD)
    .max(32, greekLabels.USE_PROPER_PASSWORD)
    .required(greekLabels.REQUIRED_FIELD),
  newRepeatPassword: Yup.string().oneOf(
    [Yup.ref("newPassword"), null],
    greekLabels.PASSWORDS_MUST_MATCH
  ),
});

const ResetPassword = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [sentReset, setSentReset] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isResetComplete, setIsResetComplete] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const submitHandler = async (data) => {
    const token = searchParams.get("token");
    if (!token) return;

    setLoading(true);
    setSentReset(true);
    const { newPassword } = data;
    finishResetPassword(newPassword, token)
      .then(() => {
        setLoading(false);
        setIsResetComplete(true);
        auth.logout();
        setTimeout(() => {
          navigate("/auth");
        }, 5000);
      })
      .catch((error) => {
        setLoading(false);
        setIsResetComplete(false);
        setErrorMessage(`Σφάλμα: ${prettifyErrorMessage(error)}`);
      });
  };

  return loading ? (
    <Flex justify="center" align="center" mt={20}>
      <Spinner speed="0.6s" thickness="4px" colorScheme="green" size="xl" />
    </Flex>
  ) : sentReset ? (
    <Alert
      status={isResetComplete ? "success" : "error"}
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
        {isResetComplete
          ? greekLabels.SUCCESSFUL_PASSWORD_CHANGE
          : greekLabels.FAILED_PASSWORD_CHANGE}
      </AlertTitle>
      <AlertDescription maxWidth="sm">
        {isResetComplete
          ? greekLabels.YOU_WILL_BE_REDIRECTED_SHORTLY
          : errorMessage}
      </AlertDescription>
    </Alert>
  ) : (
    <Flex
      boxShadow="lg"
      alignSelf="center"
      mt={5}
      p={5}
      maxW="25rem"
      w="90%"
      direction="column"
      rounded="md"
    >
      <Formik
        initialValues={{
          newPassword: "",
          newRepeatPassword: "",
        }}
        validationSchema={FormSchema}
        onSubmit={submitHandler}
      >
        {(props) => {
          return (
            <Form>
              <Flex direction="column">
                <Flex direction="column">
                  <Field name="newPassword">
                    {({ field, form }) => (
                      <FormControl
                        isRequired
                        isInvalid={
                          form.errors.newPassword && form.touched.newPassword
                        }
                        mb={5}
                      >
                        <FormLabel>{greekLabels.NEW_PASSWORD}</FormLabel>
                        <Input {...field} type="password" />
                        <FormErrorMessage
                          pos="absolute"
                          top="100%"
                          fontSize="xs"
                          mt={1}
                        >
                          {form.errors.newPassword}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="newRepeatPassword">
                    {({ field, form }) => (
                      <FormControl
                        isRequired
                        isInvalid={
                          form.errors.newRepeatPassword &&
                          form.touched.newRepeatPassword
                        }
                        mb={5}
                      >
                        <FormLabel>{greekLabels.REPEAT_NEW_PASSWORD}</FormLabel>
                        <Input {...field} type="password" />
                        <FormErrorMessage
                          pos="absolute"
                          top="100%"
                          fontSize="xs"
                          mt={1}
                        >
                          {form.errors.newRepeatPassword}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Button
                    isDisabled={!props.dirty || !props.isValid}
                    isLoading={props.isSubmitting}
                    colorScheme="green"
                    type="submit"
                    mt={2}
                  >
                    {greekLabels.CONFIRM}
                  </Button>
                </Flex>
              </Flex>
            </Form>
          );
        }}
      </Formik>
    </Flex>
  );
};

export default ResetPassword;
