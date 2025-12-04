import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import { setMatches } from "./matchMedia.mock.js"; // Must be imported before the tested file
import * as auth from "hooks/useAuth.js";
import * as reactRouter from "react-router";
import {
  existingEmail,
  fetchedTreeData,
  loginToken,
  setNotifications,
  treesVersion,
  userIdWithANamedTree,
} from "mocks/handlers.js";
import * as servicesApi from "./services/api.js";
import { add } from "date-fns";

import App from "./App";
import { greekLabels } from "util/language.js";

if (process.env.CI) {
  console.log("Will retry tests 3 times");
  jest.retryTimes(3);
}

describe("App", () => {
  beforeAll(() => {
    setMatches(false);
  });

  it("populates local storage with trees if authorized", async () => {
    const functionToWaitFor = jest.spyOn(servicesApi, "fetchTrees");

    jest.spyOn(auth, "useAuth").mockReturnValue({
      token: loginToken,
      userId: 1,
      login: null,
      logout: null,
      email: existingEmail,
      isLinkedAccount: false,
    });

    render(<App />);

    await waitFor(() => expect(functionToWaitFor).toHaveBeenCalled(), {
      timeout: 30000,
    });

    await waitFor(() =>
      expect(localStorage.getItem("treeData")).toEqual(
        JSON.stringify(fetchedTreeData)
      )
    );

    await waitFor(() =>
      expect(localStorage.getItem("treeDataVersion")).toEqual(treesVersion)
    );
  });

  it("shows notifications", async () => {
    const functionToWaitFor = jest.spyOn(
      servicesApi,
      "setAllNotificationsToSeen"
    );

    setNotifications([
      {
        id: 1691791745280,
        userId: 1,
        category: "category",
        header: "1691791745281",
        message: "1691791745282",
        seen: false,
        sentAt: "2023-08-11T22:09:06.774Z",
        createdAt: "2023-08-11T22:09:06.774Z",
        updatedAt: "2023-08-11T22:09:06.774Z",
      },
    ]);

    jest.spyOn(auth, "useAuth").mockReturnValue({
      token: loginToken,
      userId: 1,
      login: null,
      logout: null,
      email: existingEmail,
      isLinkedAccount: false,
    });

    render(<App />);

    expect(await screen.findByText("Ειδοποιήσεις")).toBeInTheDocument();

    const readButton = screen.getByText("Σημείωσε ως διαβασμένα");
    fireEvent.click(readButton);
    await waitFor(() => expect(functionToWaitFor).toHaveBeenCalled());

    await localStorageToBeWrittenWithTreeVersion();
    setNotifications([]);
  });

  it("collapses notifications when clicking on a message", async () => {
    setNotifications([
      {
        id: 1691791745280,
        userId: 1,
        category: "category",
        header: "Header",
        message: "Message",
        seen: false,
        sentAt: "2023-08-11T22:09:06.774Z",
        createdAt: "2023-08-11T22:09:06.774Z",
        updatedAt: "2023-08-11T22:09:06.774Z",
      },
      {
        id: 1691791745281,
        userId: 1,
        category: "unwateredTrees",
        header: "Header",
        message: "Message",
        seen: false,
        sentAt: "2023-08-11T22:09:06.774Z",
        createdAt: "2023-08-11T22:09:06.774Z",
        updatedAt: "2023-08-11T22:09:06.774Z",
      },
    ]);

    jest.spyOn(auth, "useAuth").mockReturnValue({
      token: loginToken,
      userId: 1,
      login: null,
      logout: null,
      email: existingEmail,
      isLinkedAccount: false,
    });

    render(<App />);

    await screen.findByText(greekLabels.notifications.unwateredTrees.message);
    const element = await screen.findByText("Message");
    expect(element).toBeInTheDocument();

    fireEvent.click(element);

    await localStorageToBeWrittenWithTreeVersion();

    setNotifications([]);
  });

  describe("Mobile", () => {
    it("renders", () => {
      render(<App />);
    });

    it("renders with existing not-expired userData logins the user", async () => {
      const functionToWaitFor = jest.spyOn(servicesApi, "fetchTrees");

      localStorage.setItem(
        "userData",
        JSON.stringify({
          userId: userIdWithANamedTree,
          token: loginToken,
          email: existingEmail,
          isLinkedAccount: false,
          expiration: add(new Date(), {
            minutes: 30,
          }),
          userDataSchemaVersion: 1,
        })
      );
      render(<App />);

      expect(screen.getByRole("link", { name: "homeIcon" })).toHaveAttribute(
        "href",
        "/"
      );
      expect(screen.getByRole("link", { name: "treesIcon" })).toHaveAttribute(
        "href",
        "/trees"
      );
      expect(screen.getByRole("link", { name: "mapIcon" })).toHaveAttribute(
        "href",
        "/map"
      );
      expect(
        screen.getByRole("link", { name: "settingsIcon" })
      ).toHaveAttribute("href", "/settings");

      await waitFor(() => expect(functionToWaitFor).toHaveBeenCalled(), {
        timeout: 30000,
      });

      await localStorageToBeWrittenWithTreeVersion();
    });
  });

  describe("Desktop", () => {
    beforeAll(() => {
      setMatches(true);
    });

    it("renders", () => {
      render(<App />);
    });

    it("renders with existing not-expired userData logins the user", async () => {
      const functionToWaitFor = jest.spyOn(servicesApi, "fetchTrees");
      const mockNavigate = jest.fn();
      jest
        .spyOn(reactRouter, "useNavigate")
        .mockImplementation(() => mockNavigate);

      localStorage.setItem(
        "userData",
        JSON.stringify({
          userId: userIdWithANamedTree,
          token: loginToken,
          email: existingEmail,
          isLinkedAccount: false,
          expiration: add(new Date(), {
            minutes: 30,
          }),
          userDataSchemaVersion: 1,
        })
      );
      render(<App />);

      expect(
        screen.getByRole("link", { name: "Application logo" })
      ).toHaveAttribute("href", "/");
      expect(
        screen.getByRole("link", { name: "Τα δέντρα μου" })
      ).toHaveAttribute("href", "/trees");
      expect(
        screen.getByRole("link", { name: "Χάρτης δέντρων" })
      ).toHaveAttribute("href", "/map");
      expect(
        screen.getByRole("link", {
          name: existingEmail.substring(0, existingEmail.indexOf("@")),
        })
      ).toHaveAttribute("href", "/settings");

      const logoutButton = screen.getByLabelText("logout");
      fireEvent.click(logoutButton);

      await waitFor(() => expect(mockNavigate).toHaveBeenCalled());
      expect(window.location.pathname).toEqual("/");

      // To avoid test error:
      // Cannot log after tests are done. Did you forget to wait for something async in your test?
      // Attempted to log "{
      //   status: undefined,
      //   ok: false,
      //   message: "Cannot read properties of null (reading '_location')",
      //   body: undefined
      // }".
      await waitFor(() => expect(functionToWaitFor).toHaveBeenCalled());

      await localStorageToBeWrittenWithTreeVersion();
    });
  });
});

async function localStorageToBeWrittenWithTreeVersion() {
  await waitFor(() =>
    expect(localStorage.getItem("treeDataVersion")).toEqual(treesVersion)
  );
}
