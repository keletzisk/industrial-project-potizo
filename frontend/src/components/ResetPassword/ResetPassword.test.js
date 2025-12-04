import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { enterText, mockLogout } from "test/utils";
import { greekLabels } from "util/language";
import { existingPassword, resetPasswordToken } from "mocks/handlers";
import * as servicesApi from "services/api";
import { AuthContext } from "context/auth-context";

import ResetPassword from "./ResetPassword";

describe("ResetPassword", () => {
  it("Renders", () => {
    renderResetPassword();
  });

  it("enters new code twice and confirms", async () => {
    const spiedFinishResetPassword = jest.spyOn(
      servicesApi,
      "finishResetPassword"
    );

    const user = renderResetPassword();

    const newPassword = existingPassword + "new";
    await enterText(
      user,
      screen.getByLabelText(greekLabels.NEW_PASSWORD, {
        exact: false,
      }),
      newPassword
    );
    await enterText(
      user,
      screen.getByLabelText(greekLabels.REPEAT_NEW_PASSWORD, {
        exact: false,
      }),
      newPassword
    );
    await user.click(screen.getByText(greekLabels.CONFIRM));

    await waitFor(() =>
      expect(spiedFinishResetPassword).toHaveBeenCalledTimes(1)
    );

    expect(
      await screen.findByText(greekLabels.SUCCESSFUL_PASSWORD_CHANGE)
    ).toBeInTheDocument();

    expect(mockLogout).toHaveBeenCalled();
  });
});

function renderResetPassword() {
  const user = userEvent.setup();
  render(
    <AuthContext.Provider
      value={{
        token: null,
        userId: null,
        login: null,
        logout: mockLogout,
        email: null,
        isLinkedAccount: false,
      }}
    >
      <MemoryRouter initialEntries={["?token=" + resetPasswordToken]}>
        <ResetPassword />
      </MemoryRouter>
    </AuthContext.Provider>
  );
  return user;
}
