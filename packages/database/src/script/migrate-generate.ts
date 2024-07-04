import { exec } from "child_process";
import { join } from "path";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter the file name: ", (fileName) => {
  rl.close();

  const command = `pnpm typeorm-ts-node-commonjs migration:generate -d ./src/index.ts ./src/migration/${fileName}`;
  const projectRoot = join(__dirname, "..");
  exec(command, { cwd: projectRoot }, (error, stdout, stderr) => {
    if (error) {
      console.log(error)
      return;
    }

    if (stderr) {
      console.error(`Command error: ${stderr}`);
      return;
    }

    console.log(`Command executed successfully:\n${stdout}`);
  });
});
