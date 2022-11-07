const { readdir, readFile, writeFile } = require("fs/promises");
const { join, extname } = require("path");

const stylesDir = join(__dirname, "styles");
const bundleFilePath = join(__dirname, "project-dist", "bundle.css");

readdir(stylesDir, { withFileTypes: true }).then((files) => {
  let styles = "";
  files.forEach((file) => {
    const fileExt = extname(file.name);
    if (fileExt === ".css" && file.isFile()) {
      readFile(join(stylesDir, file.name), "utf-8").then((data) => {
        styles += data;
        writeFile(bundleFilePath, styles);
      });
    }
  });
});
