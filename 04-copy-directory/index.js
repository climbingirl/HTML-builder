const { readdir, mkdir, copyFile, rm } = require("fs/promises");
const { join } = require("path");

const targetDirName = join(__dirname, "files");
const newDirName = join(__dirname, "files-copy");

copyDir(targetDirName, newDirName);

function copyDir(targetDir, newDir) {
  mkdir(newDir, { recursive: true });

  readdir(targetDir).then(files => {
    files.forEach((file) => {
        copyFile(join(targetDir, file), join(newDir, file));
    });

    readdir(newDir).then(copiedFiles => {
      const extraFiles = copiedFiles.filter(i => !files.includes(i));
      extraFiles.forEach(file => {
        rm(join(newDir, file));
      });
    });
  });
}
