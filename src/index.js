var package = require("../package.json");

exports.greet = () => {
  console.log("🤵 What's the hurry?");
  console.log(`v${package.version}`.yellow);
};
