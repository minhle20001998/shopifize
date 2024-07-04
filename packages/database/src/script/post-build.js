// const fs = require("fs-extra");

// const postBuild = async () => {
//   const distScriptDir = "./dist/script";
//   const istThisBuiltDir = "./dist/is-this-build.js";

//   //post-build

//   fs.remove(distScriptDir, (err) => {
//     if (err) return console.error(err);
//     console.log("successfully remove script in dist folder");
//   });

//   const fileContent = fs.readFileSync(istThisBuiltDir, "utf-8");
//   const updatedContent = fileContent.replace(/= false;/, "= true;");
//   fs.writeFileSync(istThisBuiltDir, updatedContent, "utf-8");
// };

// postBuild();
