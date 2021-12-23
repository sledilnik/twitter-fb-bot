const { run } = require("./test");

if (require.main === module) {
  console.log(
    "this module was run directly from the command line as in node epi.js"
  );
  run("EPI", "tw");
} else {
  console.log(`require: ${module.id}`);
}
