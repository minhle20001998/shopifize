const { exec } = require("child_process");
const { join } = require("path");
const fs = require("fs-extra");

const build = async () => {
  const projectRoot = join(__dirname, "..");
  const distMigrationDir = "./dist/migration";

  // pre-build

  fs.remove(distMigrationDir, (err) => {
    if (err) return console.error(err);
    console.log("successfully remove migration in dist folder");
  });

  // Run the build command using child_process and ts-node

  console.log("Running tcs ....");

  exec("pnpm run tsc", { cwd: projectRoot }, (error, stdout, stderr) => {
    if (error) {
      console.error(error);
    } else {
      console.log(stdout);
    }
  });

  console.log("Build success");
};

build();
