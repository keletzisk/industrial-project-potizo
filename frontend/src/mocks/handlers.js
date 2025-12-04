import { rest } from "msw";
import greekTranslations from "../../../backend/util/language";
import { add } from "date-fns";

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/api";

export const treeIdWithNickname = 1;
export const treeIdWithNullNickName = 2;
export const treeIdOfAvailableTree = 3;
const treeIdOfUserWithTwoTrees1 = 4;
const treeIdOfUserWithTwoTrees2 = 5;

export const userIdWithANamedTree = 1;
export const userIdWithANoNameTree = 2;
export const userIdWithNoTrees = 3;
export const userIdWithTwoTrees = 4;

export const mockAPInickname = "treeNickName";
export const treesVersion = 1;

const x = 22.961;
const y = 40.596;
const newTreesDate = "2023-01-01";

export const treeOfUserWithTwoTrees1 = {
  t: treeIdOfUserWithTwoTrees1,
  y: y,
  x: x + 2,
  d: newTreesDate,
};
export const treeOfUserWithTwoTrees2 = {
  t: treeIdOfUserWithTwoTrees1,
  y: y,
  x: x + 3,
  d: newTreesDate,
};

export const fetchedTreeData = [
  {
    t: treeIdWithNickname,
    y: y,
    x: x,
    d: newTreesDate,
  },
  {
    t: treeIdWithNullNickName,
    y: y + 1,
    x: x,
    d: newTreesDate,
  },
  {
    t: treeIdOfAvailableTree,
    y: y,
    x: x + 1,
    d: newTreesDate,
  },
  treeOfUserWithTwoTrees1,
  treeOfUserWithTwoTrees2,
];
export const storedTreeData = [
  {
    t: treeIdWithNickname,
    y: y,
    x: x,
    d: newTreesDate,
  },
  {
    t: treeIdWithNullNickName,
    y: y + 1,
    x: x,
    d: newTreesDate,
  },
];

export const userTrees = {
  data: {
    trees: [
      {
        needsWatering: true,
        id: 1691618218687,
        name: "Tree41859",
        type: "ΙΒΙΣΚΟΣ",
        address: "ΠΤΕΡΑΡΧΟΥ ΘΕΜΕΛΗ 13",
        latitude: 40.596717947777,
        longitude: 22.961785197258,
        zip: "54248",
        createdAt: newTreesDate,
        lastWateredDate: add(new Date(), { days: -5 }),
        UserTree: {
          id: 1691618218688,
          userId: 1,
          treeId: 1691618218687,
          treeNickname: null,
          createdAt: "2023-08-09T21:57:28.917Z",
          updatedAt: "2023-08-09T21:57:28.917Z",
        },
      },
      {
        needsWatering: false,
        id: 1691618218689,
        name: "Tree41859",
        type: "ΙΒΙΣΚΟΣ",
        address: "ΠΤΕΡΑΡΧΟΥ ΘΕΜΕΛΗ 13",
        latitude: 40.596717947777,
        longitude: 22.961785197258,
        zip: "54248",
        createdAt: newTreesDate,
        lastWateredDate: add(new Date(), { days: -1 }),
        UserTree: {
          id: 1691618218690,
          userId: 1,
          treeId: 1691618218689,
          treeNickname: null,
          createdAt: "2023-08-09T21:57:28.917Z",
          updatedAt: "2023-08-09T21:57:28.917Z",
        },
      },
    ],
  },
};

// this is a valid token
// with userId = 1
// email = email1@gmail.com

export const existingEmail = "email1@gmail.com";
export const existingPassword = "password1";
export const notExistingEmail = "some@some.com";

export const expiredVerificationToken = "EXPIRED";

export const resetPasswordToken = "XXX";
export const loginToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiZW1haWwxQGdtYWlsLmNvbSIsImlzTGlua2VkQWNjb3VudCI6ZmFsc2UsImlhdCI6MTY5MTQ4NTk3MywiZXhwIjoxNjkxNDg5NTczfQ.fzbm9sc-WNDHg8lRJp4HIVMW9DS9e1LaaFaabm30RPY";

export const firstTreeFoundWithZip = { x: 22.345, y: 40.596718 };
let notifications = [];

export function setNotifications(notSeen) {
  notifications = notSeen;
}

export const handlers = [
  rest.post(BACKEND_URL + "/users/login", async (req, res, ctx) => {
    const { email, password } = await req.json();
    if (email === existingEmail) {
      if (password === existingPassword) {
        return res(
          ctx.json({
            token: loginToken,
          })
        );
      } else {
        return res(
          ctx.status(400),
          ctx.json({
            message:
              "Αποτυχία σύνδεσης. Έλεγξε τη διεύθυνση και τον κωδικό σου.",
          })
        );
      }
    } else {
      return res(
        ctx.status(400),
        ctx.json({
          message: greekTranslations.USER_NOT_EXISTS,
        })
      );
    }
  }),

  rest.post(BACKEND_URL + "/users/signup", async (req, res, ctx) => {
    const { email } = await req.json();
    if (email !== existingEmail) {
      return res(
        ctx.json({
          token: loginToken,
        })
      );
    } else {
      return res(
        ctx.status(400),
        ctx.json({
          message: "Αυτός ο χρήστης ήδη υπάρχει",
        })
      );
    }
  }),

  rest.post(BACKEND_URL + "/users/reset-password", async (req, res, ctx) => {
    const { email } = await req.json();
    if (email === existingEmail) return res(ctx.status(200));
    else
      return res(
        ctx.status(404),
        ctx.json({ message: "Ο χρήστης δεν βρέθηκε." })
      );
  }),

  rest.post(
    BACKEND_URL + "/users/reset-password/finish",
    async (req, res, ctx) => {
      return res(ctx.status(200));
    }
  ),

  rest.delete(BACKEND_URL + "/users/delete", (req, res, ctx) => {
    return res(ctx.status(200));
  }),

  rest.post(BACKEND_URL + "/users/verify-email", async (req, res, ctx) => {
    const { token } = await req.json();
    if (token === expiredVerificationToken) {
      return res(
        ctx.status(404),
        ctx.json({
          message: greekTranslations.VERIFICATION_CODE_INVALID,
        })
      );
    } else {
      return res(
        ctx.status(200),
        ctx.json({
          token: loginToken,
        })
      );
    }
  }),

  rest.get(
    BACKEND_URL + "/users/notifications/not-seen",
    async (req, res, ctx) => {
      return res(
        ctx.json({
          data: notifications,
        })
      );
    }
  ),

  rest.patch(BACKEND_URL + "/users/notification/see", async (req, res, ctx) => {
    return res(ctx.status(204));
  }),

  rest.get(BACKEND_URL + "/trees", (req, res, ctx) => {
    return res(
      ctx.json({
        data: fetchedTreeData,
      })
    );
  }),

  rest.get(BACKEND_URL + "/trees/user", (req, res, ctx) => {
    return res(ctx.json(userTrees));
  }),

  rest.get(BACKEND_URL + "/trees/getUserData", (req, res, ctx) => {
    return res(
      ctx.json({
        data: [
          { userId: userIdWithANamedTree, treeId: treeIdWithNickname },
          { userId: userIdWithANoNameTree, treeId: treeIdWithNullNickName },
          { userId: userIdWithTwoTrees, treeId: treeIdOfUserWithTwoTrees1 },
          { userId: userIdWithTwoTrees, treeId: treeIdOfUserWithTwoTrees2 },
        ],
      })
    );
  }),

  rest.get(BACKEND_URL + "/trees/version", (req, res, ctx) => {
    return res(
      ctx.json({
        data: treesVersion,
      })
    );
  }),

  rest.get(BACKEND_URL + "/trees/:treeId/treenickname", (req, res, ctx) => {
    const { treeId } = req.params;
    return res(
      ctx.json({
        data: {
          treeNickname:
            treeId === "" + treeIdWithNickname ? mockAPInickname : null,
        },
      })
    );
  }),

  rest.get(BACKEND_URL + "/trees/getTreeByZip/:zip", (req, res, ctx) => {
    return res(ctx.json(firstTreeFoundWithZip));
  }),

  rest.patch(BACKEND_URL + "/trees/:treeId/water", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.patch(BACKEND_URL + "/trees/:treeId/abandon", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.patch(BACKEND_URL + "/trees/:treeId/rename", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
];
