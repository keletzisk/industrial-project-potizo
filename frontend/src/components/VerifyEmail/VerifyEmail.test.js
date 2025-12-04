import { render, screen, waitFor } from "@testing-library/react";
import * as servicesApi from "services/api";
import { MemoryRouter } from "react-router";

import { VerifyEmail } from "./VerifyEmail";
import { greekLabels } from "util/language";
import { expiredVerificationToken } from "mocks/handlers";

const emailVerificationToken = "XXX";

describe("VerifyEmail", () => {
  it("renders", () => {
    render(
      <MemoryRouter
        initialEntries={[
          { pathname: "/", search: "?token=" + emailVerificationToken },
        ]}
      >
        <VerifyEmail />
      </MemoryRouter>
    );
  });

  it("no token", async () => {
    const spiedVerifyEmail = jest.spyOn(servicesApi, "verifyEmail");
    render(
      <MemoryRouter>
        <VerifyEmail />
      </MemoryRouter>
    );

    await screen.findByText(greekLabels.FAILED_EMAIL_VERIFICATION);
    expect(spiedVerifyEmail).not.toHaveBeenCalled();
  });

  it("email is successfully verified", async () => {
    const spiedVerifyEmail = jest.spyOn(servicesApi, "verifyEmail");
    render(
      <MemoryRouter
        initialEntries={[
          { pathname: "/", search: "?token=" + emailVerificationToken },
        ]}
      >
        <VerifyEmail />
      </MemoryRouter>
    );

    await waitFor(() => expect(spiedVerifyEmail).toHaveBeenCalledTimes(1));

    await screen.findByText(greekLabels.SUCCESSFUL_EMAIL_VERIFICATION);
  });

  it("token has expired", async () => {
    const spiedVerifyEmail = jest.spyOn(servicesApi, "verifyEmail");
    render(
      <MemoryRouter
        initialEntries={[
          { pathname: "/", search: "?token=" + expiredVerificationToken },
        ]}
      >
        <VerifyEmail />
      </MemoryRouter>
    );

    await waitFor(() => expect(spiedVerifyEmail).toHaveBeenCalledTimes(1));

    await screen.findByText(greekLabels.FAILED_EMAIL_VERIFICATION);
  });
});
