import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { greekLabels } from "util/language";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import * as servicesApi from "services/api";
import { expectMockToastMessage } from "mocks/toast";
import {
  existingEmail,
  existingPassword,
  notExistingEmail,
} from "mocks/handlers";
import greekTranslations from "../../../../backend/util/language";
import { enterText } from "test/utils";

import Auth from "./Auth";

describe("Auth", () => {
  it("Renders login screen", () => {
    renderOAuthRouter();
  });

  it("logins with email and password", async () => {
    const spiedLogin = jest.spyOn(servicesApi, "login");

    const user = renderOAuthRouter();

    await enterEmail(user, existingEmail);
    await enterPassword(user, existingPassword);
    await login(user);

    await waitFor(() => expect(spiedLogin).toHaveBeenCalledTimes(1));
    expect(window.location.pathname).toEqual("/trees");
  });

  it("does not login with email and invalid password", async () => {
    const spiedLogin = jest.spyOn(servicesApi, "login");

    const user = renderOAuthRouter();

    await enterEmail(user, existingEmail);
    await enterPassword(user, existingPassword + "x");
    await login(user);

    await waitFor(() => expect(spiedLogin).toHaveBeenCalledTimes(1));

    expectMockToastMessage(greekTranslations.INVALID_PASSWORD, "error");
  });

  it("signs up with new email and password", async () => {
    const spiedSignup = jest.spyOn(servicesApi, "signup");

    const user = renderOAuthRouter();

    const signup = screen.getByText(greekLabels.SIGNUP);
    user.click(signup);

    // wait for the registration form
    const signupButon = await screen.findByRole("button", {
      name: greekLabels.CREATE_NEW_ACCOUNT,
    });

    await enterEmail(user, notExistingEmail);
    await enterPassword(user, existingPassword);
    await user.click(screen.getByRole("checkbox"));
    await user.click(signupButon);

    await waitFor(() => expect(spiedSignup).toHaveBeenCalledTimes(1));

    expectMockToastMessage(greekLabels.VERIFICATION_CODE_SENT);
  });

  it("does not sign up if email already exists", async () => {
    const spiedSignup = jest.spyOn(servicesApi, "signup");

    const user = renderOAuthRouter();

    const signup = screen.getByText(greekLabels.SIGNUP);
    user.click(signup);

    // wait for the registration form
    const signupButon = await screen.findByRole("button", {
      name: greekLabels.CREATE_NEW_ACCOUNT,
    });

    await enterEmail(user, existingEmail);
    await enterPassword(user, "XXXXXXXXXXXX");
    await user.click(screen.getByRole("checkbox"));
    await user.click(signupButon);

    await waitFor(() => expect(spiedSignup).toHaveBeenCalledTimes(1));

    expectMockToastMessage(greekTranslations.THIS_USER_EXISTS, "error");
  });

  it("forgot password", async () => {
    const spiedRequestResetPassword = jest.spyOn(
      servicesApi,
      "requestResetPassword"
    );

    const user = renderOAuthRouter();

    const forgotPassword = screen.getByText(greekLabels.FORGOT_PASSWORD);
    await user.click(forgotPassword);

    await enterText(
      user,
      await screen.getByPlaceholderText(greekLabels.WRITE_YOUR_EMAIL),
      existingEmail
    );
    await user.click(screen.getByText(greekLabels.CONFIRM));

    await waitFor(() =>
      expect(spiedRequestResetPassword).toHaveBeenCalledTimes(1)
    );
    expectMockToastMessage(greekLabels.RECEIVE_EMAIL_FOR_PASSWORD_RESET);
  });

  it("forgot password (not found)", async () => {
    const spiedRequestResetPassword = jest.spyOn(
      servicesApi,
      "requestResetPassword"
    );

    const user = renderOAuthRouter();

    const forgotPassword = screen.getByText(greekLabels.FORGOT_PASSWORD);
    await user.click(forgotPassword);

    await enterText(
      user,
      await screen.getByPlaceholderText(greekLabels.WRITE_YOUR_EMAIL),
      notExistingEmail
    );
    await user.click(screen.getByText(greekLabels.CONFIRM));

    await waitFor(() =>
      expect(spiedRequestResetPassword).toHaveBeenCalledTimes(1)
    );
    expectMockToastMessage(greekTranslations.USER_NOT_EXISTS, "error");
  });
});

async function login(user) {
  const loginButton = screen.getByRole("button", { name: greekLabels.LOGIN });
  await user.click(loginButton);
}

async function enterEmail(user, email) {
  await enterText(
    user,
    screen.getByLabelText(greekLabels.EMAIL_ADDRESS, {
      exact: false,
    }),
    email
  );
}

async function enterPassword(user, password) {
  await enterText(
    user,
    screen.getByLabelText(greekLabels.PASSWORD, {
      exact: false,
    }),
    password
  );
}

function renderOAuthRouter() {
  const user = userEvent.setup();
  render(
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Auth />
      </BrowserRouter>
    </GoogleOAuthProvider>
  );

  return user;
}
