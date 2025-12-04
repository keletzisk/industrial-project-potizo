import { render } from "@testing-library/react";
import { AuthContext } from "context/auth-context";
import { existingEmail } from "mocks/handlers";
import { MemoryRouter } from "react-router-dom";

export const mockLogout = jest.fn();

export function renderWithAuthRouterWithUserId(
  ui,
  userId = null,
  initialEntries = null
) {
  expect(ui).toBeTruthy();
  render(
    <AuthContext.Provider
      value={{
        token: null,
        userId: userId,
        login: null,
        logout: mockLogout,
        email: existingEmail,
        isLinkedAccount: false,
      }}
    >
      {!initialEntries ? (
        <MemoryRouter>{ui}</MemoryRouter>
      ) : (
        <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
      )}
    </AuthContext.Provider>
  );
}

export async function enterText(user, elementQuery, text) {
  const element = elementQuery;
  await user.clear(element);
  await user.type(element, text);
  return element;
}
