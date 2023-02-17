const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve("./dist"),
    filename: "main.js",
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve("./index.html"),
          to: path.resolve("./dist/index.html"),
          force: true,
        },
      ],
    }),
  ],
};
