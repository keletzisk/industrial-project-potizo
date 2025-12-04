const build = require("pino-abstract-transport");
const SonicBoom = require("sonic-boom");
const { once } = require("node:events");

module.exports = async function (_options) {
  const destination = new SonicBoom({
    dest: 1,
    sync: false,
  });
  await once(destination, "ready");

  return build(
    async function (source) {
      for await (const object of source) {
        const toDrain = !destination.write(JSON.stringify(object) + "\n");
        // This block will handle backpressure
        if (toDrain) {
          await once(destination, "drain");
        }
      }
    },
    {
      async close(_error) {
        destination.end();
        await once(destination, "close");
      },
    }
  );
};
