const MinifiedTreeResponse = require("./minifiedTreeResponse");

class MinifiedTreeWithUsersResponse extends MinifiedTreeResponse {
  u = [];

  constructor(tree, users) {
    super(tree);

    if (!users) return;
    const amountOfUsers = users.usersCol.length;
    for (let index = 0; index < amountOfUsers; index++) {
      this.u.push(users.usersCol[index]);
    }
  }
}

module.exports = MinifiedTreeWithUsersResponse;
