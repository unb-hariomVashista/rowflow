module.exports = {
  apps: [
    {
      name: "row-flow",
      script: "pnpm",
      args: "run start",
      env: {
        NODE_ENV: "production",
        PORT: 3003,
      },
    },
  ],
};
