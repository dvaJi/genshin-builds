module.exports = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/comp-builder",
        permanent: true,
      },
    ];
  },
};
