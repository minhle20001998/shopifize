const fs = require("fs");
const path = require("path");

const appsDir = "./apps";
const packagesDir = "./packages";
const configDir = "/config";

const listDirs = [appsDir, packagesDir];

function createConfigFolders(dirs) {
  try {
    dirs.forEach((dir) => {
      fs.readdirSync(dir, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name)
        .forEach((dirName) => {
          const pathDir = path.join(dir, dirName);
          const configPathDir = pathDir + configDir;
          /**
           * if config folders exist in apps and packages directories -> replace with new one
           * else create new config folders
           */
          if (fs.existsSync(configPathDir)) {
            fs.rm(configPathDir, { recursive: true }, (error) => {
              if (error) {
                console.error(error);
              } else {
                fs.mkdirSync(configPathDir);
              }
            });
          } else {
            fs.mkdirSync(configPathDir);
          }
        });
    });
  } catch (e) {
    console.log("Failed to create config folders", e);
  }
}

function linkGlobal(dirs, configDir) {
  const globalConfigFileDir = "/global.json";
  try {
    dirs.forEach((dir) => {
      fs.readdirSync(dir, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name)
        .forEach((dirName) => {
          const symlinkPath = path.join(
            dir,
            dirName,
            configDir + globalConfigFileDir
          );
          const originalPath = path.resolve(configDir + globalConfigFileDir);
          if (!fs.existsSync(symlinkPath)) {
            fs.symlinkSync(originalPath, symlinkPath, "file");
          }
        });
    });
    console.log("Symlinks global configs created successfully!");
  } catch (e) {
    console.log("Failed to create global configs symlinks", e);
  }
}

function linkLocals(dirs, configDir) {
  const localConfigDir = configDir + "/locals";
  const localConfigFileName = "/local.json";
  function getServiceFromFileName(filename) {
    return filename.split(".")[0];
  }
  try {
    const localConfigFolder = localConfigDir;
    fs.readdir(localConfigFolder, (err, files) => {
      const mapFiles = {};
      files.forEach((file) => {
        mapFiles[getServiceFromFileName(file)] = file;
      });
      dirs.forEach((dir) => {
        fs.readdirSync(dir, { withFileTypes: true })
          .filter((dirent) => dirent.isDirectory())
          .map((dirent) => dirent.name)
          .forEach((dirName) => {
            if (mapFiles[dirName]) {
              const symlinkPath = path.join(
                dir,
                dirName,
                configDir + localConfigFileName
              );
              const originalPath = path.resolve(
                localConfigDir + withFilePath(mapFiles[dirName])
              );
              if (!fs.existsSync(symlinkPath)) {
                fs.symlinkSync(originalPath, symlinkPath, "file");
              }
            }
          });
      });
    });
  } catch (e) {
    console.log("Failed to created local configs symlinks");
  }
}

function withRelativePath(path) {
  return "." + path;
}

function withFilePath(fileName) {
  return "/" + fileName;
}

createConfigFolders(listDirs);

// dont know why, but linking only work after amount of time createConfigFolders runs
setTimeout(() => {
  linkGlobal(listDirs, "." + configDir);
  linkLocals(listDirs, withRelativePath(configDir));
}, 100);
