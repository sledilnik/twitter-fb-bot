const { run } = require("./test");

if (require.main === module) {
  console.log(
    "this module was run directly from the command line as in node lab.js"
  );
  run("LAB_W", "tw");
} else {
  console.log(
    "this module was not run directly from the command line and probably loaded by something else"
  );
}
