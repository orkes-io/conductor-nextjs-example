module.exports = {
  publicRuntimeConfig: {
    conductor: {
      keyId: process.env.KEY,
      keySecret:process.env.SECRET,
      serverUrl: "http://localhost:3000/api",
    },
    workflows:{
      checkout: "MyCheckout2",
      
    }
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",

        destination: `${process.env.SERVER_URL}/api/:path*`,
      },
    ];
  },
};
