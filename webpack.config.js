const path = require("path");

module.exports = {
  entry: "/JekyllTRIpeux/assets/scripts/index.js", // path to main JavaScript file
  output: {
    filename: "bundle.js", // output bundle file name
    path: path.resolve(__dirname, "JekyllTRIpeux/dist"), // output directory
  },
  mode: "development",
};
