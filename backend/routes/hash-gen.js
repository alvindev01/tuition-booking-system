// hash-gen.js
const bcrypt = require("bcrypt");

const run = async () => {
  const hash = await bcrypt.hash("123456", 10);
  console.log("Your hashed password:", hash);
};

run();
