module.exports = {
  publicRuntimeConfig: {
    conductor: {
      keyId: process.env.KEY,
      keySecret: process.env.SECRET,
      serverUrl: "http://localhost:3456/api",
    },
    workflows: {
      checkout: `${process.env.CHECKOUT_WF_NAME || "MyCheckout2"}`,
      correlationId: "aCorrelationId",
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
