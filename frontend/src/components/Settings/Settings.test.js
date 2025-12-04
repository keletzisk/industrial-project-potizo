import {
  fireEvent,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { mockLogout, renderWithAuthRouterWithUserId } from "test/utils";
import { greekLabels } from "util/language";
import { expectMockToastMessage } from "mocks/toast";

import Settings from "./Settings";

describe("Settings", () => {
  it("renders", () => {
    renderWithAuthRouterWithUserId(<Settings />);
  });

  it("logout", async () => {
    renderWithAuthRouterWithUserId(<Settings />);

    const logout = screen.getByText(greekLabels.DISCONNECT);
    fireEvent.click(logout);

    // log outs the user
    expect(mockLogout).toHaveBeenCalled();
  });

  it("delete account and logout", async () => {
    renderWithAuthRouterWithUserId(<Settings />);

    const deleteAccount = screen.getByText(greekLabels.DELETE_ACCOUNT);
    fireEvent.click(deleteAccount);

    // await for confirmation in modal
    const confirmButton = await screen.findByText(greekLabels.CONFIRM_DELETE);
    fireEvent.click(confirmButton);

    await waitForElementToBeRemoved(() =>
      screen.queryByText(greekLabels.CONFIRM_DELETE)
    );

    expectMockToastMessage(greekLabels.SUCCESSFUL_ACCOUNT_DELETION);

    // log outs the user
    expect(mockLogout).toHaveBeenCalled();
  });

  it("reset password", async () => {
    renderWithAuthRouterWithUserId(<Settings />);

    const resetPassword = screen.getByText(greekLabels.RESET_PASSWORD);
    fireEvent.click(resetPassword);

    // await for confirmation in modal
    const confirmButton = await screen.findByText(greekLabels.CONFIRM_RESET);
    fireEvent.click(confirmButton);

    await waitForElementToBeRemoved(() =>
      screen.queryByText(greekLabels.CONFIRM_RESET)
    );

    expectMockToastMessage(greekLabels.SUCCESSFUL_REQUEST_RESET_PASSWORD);
  });
});
