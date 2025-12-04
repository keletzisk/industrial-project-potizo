# Project Trees for Municipality of Thessaloniki

## Website links

#### Production

https://potizo.thessaloniki.gr

#### Staging

https://potizo-staging.whvecyjdau.paas4.infalia.com/

## Project Setup

The MoT project uses a MySQL database which must be installed on your local machine. The file can be found in the "database backup" folder, inside "docs". Using a solution stack such as AMPPS, import the database and start both MySQL and Apache.

#### Downloading dependencies

After downloading the project, run `npm install` on both the frontend and backend directories.

#### .nvmrc

https://github.com/nvm-sh/nvm

If you have nvm installed, you can use `nvm install` and `nvm use` to install and use the node that is required for this project.

```
cd backend
nvm use
```

#### Docker-compose

Navigate to the backend/ directory.

You can run `docker compose up -d` to start a mysql database and adminer container. The mysql data is stored at /docs/database_backup but it is advised to not mess with these if you don't know what you are doing.

You can run `docker compose down` to stop and remove the containers.
You can run `docker compose down -v` to stop, remove the containers and delete the mysql data volume.

#### Migrations and seeders

https://sequelize.org/docs/v6/other-topics/migrations/

Navigate to the backend/ directory.

Run all migrations and seeders with these commands (the first migration will get your database schemas setup and the first seeder will populate the tables):

1. `npm run db:migrate`
2. `npm run db:seed`

#### Enironment files

In both the `frontend` and `backend` directories there are two example enironment files called `.env.example`. Copy these into `.env files`.

```
cd backend
cp .env.example .env
cd ../frontend
cp .env.example .env
```

## Run Instructions

- Steps:
  - In the first terminal, navigate to the backend and run `npm run dev`.
  - In the second terminal, navigate to the frontend and run `npm run start`.
  - You can now access the project by calling `http://localhost:3000/`.

More detailed instructions can be found in the documentation, section 7.4.

## Testing

### End to end testing (with playwright)

#### How to use localstorage

```
    const userData = await this.page.evaluate(() =>
      JSON.parse(localStorage["userData"]));
```

https://playwright.dev/docs/api/class-page#page-viewport-size

### Visual testing (with playwright)

Any playwright page test will save a snapshot of the current page with the command:

```
    await expect(page).toHaveScreenshot();
```

The first time the test will fail because there is no snapshot.
Evey other time the page will be compared with the snapshot.

It is important to visually inspect all snapshots. If a snapshot is wrong delete it so that it gets regenerated.

#### Generate base snapshots for linux in docker

```
docker run --rm --network host -v $(pwd):/work/ -w /work/ -it mcr.microsoft.com/playwright:v1.37.0-jammy /bin/bash
```

Within the shell execute:

```
npm install
npx playwright test --update-snapshots
```

After the execution, you might need to change the rights of directories created by the docker execution (change with your username and groupname):

```
sudo chown -R dimitris:dimitris .
```

### Frontend testing

Unit testing is performed for services and components. The backend API is being mocked.

Additionally we have mocked

- the toast messages (useToast)
- the navigate (useNavigate)

When mocking it is important to be careful about the order of imports. Mocked elements should be imported before the element under test.

Test files contain `.test.` in their names. Test files are located next to the files that they test.

Framework used:

```
npm install --save-dev @testing-library/react
npm install --save-dev @testing-library/jest-dom
npm install --save-dev @testing-library/user-event
```

The backend API is mocked using

```
npm install --save-dev msw
```

Run the tests with:

```
npm test
```

Generate coverage report with

```
npm test -- --coverage --watchAll
```

#### Instructions for testing

##### First test

Start with a minimal test for a component. The first test should just render the component. For a component named `Comp`, create a `Comp.test.js` file with the code:

```
import { render, screen } from "@testing-library/react";

import Comp from "./Comp";
describe("Comp", () => {
    it("renders", () => {
        render(<Comp />);
        // screen.debug();
    });
});
```

If you want to see the DOM produced add a `screen.debug()` after the render.

##### Possible errors and its resolution

- `... may be used only in the context of a <Router> component.`
  - wrap in a `MemoryRouter` component from `"react-router"`.
- `TypeError: Cannot use 'in' operator to search for ...`
  - Wrap in a `ChakraProvider` component.

##### Check for existence of text in the DOM

Add the import:

```
import "@testing-library/jest-dom";
```

Use the following assertion:

```
expect(screen.getByText("some text").toBeInTheDocument();

```

##### API interactions

For any interactions of the component with the backend API add a handler in the `src/mocks/handlers.js` file.

### Backend testing

Uses a in-memory database. Google auth, emailing and cronjobs are stubbed.

The test invokes the app: `app = require("../app");` at a different port if the `NODE_ENV` is set to `testing`.

`supertest` is used to send the HTTP requests to the app.

Tests are written in `mocha` with `sinon` for stubbing.

```
npm test
```

### Testing times

The following figures depend on the number of tests and the machine.

- Backend: 77 tests take 45 secs.
- Frontend: 49 tests take 40 secs
- e2e: 20 passed, 1 flaky: 3 mins (with a running server tests on chromium and mobile-chrome)

## Technologies Used

- MERN Stack:
  - MySQL + Sequelize (Database)
  - Express.js (Back-end Framework)
  - React (Front-end)
  - Node.js (Back-end)

## Developers

- Team 1: Antonios Antoniadis, Evangelos Barmpas, Vijon Baraku, Rei Manusi, Lorik Korca (Winter 2021).
- Team 2: Nikolaos Lintas, Phillipos Kalatzis, George Tamvakas, Ioannis Chaidemenos (Spring 2022).
- Team 3: Tron Baraku, Chase Burton Taylor, Marino Osmanllari, Yusuf Demirhan. (Winter 2022).
