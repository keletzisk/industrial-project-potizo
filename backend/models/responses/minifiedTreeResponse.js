class MinifiedTreeResponse {
  t; // tree id
  y; // tree latitude
  x; // tree longitude
  d; // tree createdAt
  type; // tree type

  constructor(tree) {
    if (!tree) return;

    this.t = tree.id;
    const precision = 1e6;
    this.x = Math.round(tree.longitude * precision) / precision;
    this.y = Math.round(tree.latitude * precision) / precision;
    this.d = tree.createdAt;
    this.type = tree.type;
  }
}

module.exports = MinifiedTreeResponse;
