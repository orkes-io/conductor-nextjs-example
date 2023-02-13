const {
  TaskManager,
  orkesConductorClient,
} = require("@io-orkes/conductor-javascript");

const sendEmailWorker = () => {
  return {
    taskDefName: "send_email",
    execute: async ({ inputData }) => {
      /* const email = inputData?.email; */
      console.log("SENDING EMAIL TO ",inputData);
      return {
        status: "COMPLETED",
      };
    },
  };
};

const nextConfig = {
  publicRuntimeConfig: {
    conductor: {
      keyId: process.env.KEY,
      keySecret: process.env.SECRET,
      serverUrl: "http://localhost:3456/api",
    },
    workflows: {
      checkout: `${process.env.CHECKOUT_WF_NAME || "MyCheckout2"}`,
    },
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",

        destination: `${process.env.SERVER_URL}/:path*`,
      },
    ];
  },
};

module.exports = (phase) => {
  const playConfig = {
    keyId: process.env.KEY,
    keySecret: process.env.SECRET,
    serverUrl: `${process.env.SERVER_URL}`,
  };

  (async () => {
    const clientPromise = orkesConductorClient(playConfig);
    const client = await clientPromise;
    const runner = new TaskManager(client, [sendEmailWorker()]);
    runner.startPolling();
  })();

  console.log("Starting up ", phase);
  return nextConfig;
};
