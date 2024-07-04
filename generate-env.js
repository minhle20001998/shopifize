const globalJson = require("./config/global.json");
const fs = require("fs");

function generateEnv() {
  const content = `
  NODE_ENV=${globalJson.node_env}
  POSTGRESQL_ROOT_USERNAME=${globalJson.postgres.username}
  POSTGRESQL_PASSWORD=${globalJson.postgres.password}
  POSTGRESQL_DB=${globalJson.postgres.db}
  JWT_SECRET=${globalJson.secret.jwt_secret}
  REFRESH_JWT_SECRET=${globalJson.secret.refresh_jwt_secret}
  `;
  function createEnvFile() {
    fs.writeFileSync(".env", content);
  }
  if (fs.existsSync(".env")) {
    fs.rm(".env", () => {});
  }
  setTimeout(() => {
    createEnvFile();
  }, 100);
}

generateEnv();
