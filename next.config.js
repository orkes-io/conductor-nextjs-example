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
        /* destination: "https://pg-staging.orkesconductor.com/api/:path*", */
        /* destination: "https://tmo-poc.orkesconductor.io/api/:path*", */
        /* destination:"https://play.orkes.io/api/:path*" */
      },
    ];
  },
};
