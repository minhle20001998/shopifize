const globalJson = require("./config/global.json");
const fs = require("fs");

function generateEnv() {
  const content = `
  POSTGRESQL_ROOT_USERNAME=${globalJson.postgres.username}
  POSTGRESQL_PASSWORD=${globalJson.postgres.password}
  POSTGRESQL_DB=${globalJson.postgres.db}
  `;
  function createEnvFile() {
    fs.writeFileSync(".env", content);
  }
  if (fs.existsSync(".env")) {
    fs.rm(".env", () => {});
  }
  createEnvFile();
}

generateEnv();
