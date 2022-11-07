const { readdir, mkdir, readFile, writeFile, copyFile, rm } = require("fs/promises");
const { join, extname } = require("path");

const templateFile = join(__dirname, 'template.html');
const componentsDir = join(__dirname, 'components');
const distDir = join(__dirname, 'project-dist');
const assetsDir = join(__dirname, 'assets');
const stylesDir = join(__dirname, 'styles');

const buildHTML = async () => {
  const componentsFiles = (await readdir(componentsDir, { withFileTypes: true }))
    .filter(file => extname(join(componentsDir, file.name)) === '.html')
    .map(file => file.name);
  const filesContent = await Promise.all(componentsFiles.map(name => {return readFile(join(componentsDir, name), 'utf-8')}));

  const content = componentsFiles.reduce((acc, cur, i) => {
    const fileName = cur.replace(extname(join(componentsDir, cur)), '');
    acc[fileName] = filesContent[i];
    return acc;
  }, {});

  const templateContent = await readFile(templateFile, 'utf-8');
  let temlateCopy = templateContent;

  Object.entries(content).forEach(([key, value]) => {
    temlateCopy = temlateCopy.replace(`{{${key}}}`, value);
  });

  await mkdir(distDir, {recursive: true});

  await writeFile(join(distDir, 'index.html'), temlateCopy);
}

function mergeStyles(stylesDir, bundleFilePath) {
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
}

function copyDir(targetDir, newDir) {
  mkdir(newDir, { recursive: true });

  readdir(targetDir, { withFileTypes: true }).then(files => {
    files.forEach((file) => {
      if(file.isDirectory()) {
        copyDir(join(targetDir, file.name), join(newDir, file.name));
      } else if(file.isFile()) {
        copyFile(join(targetDir, file.name), join(newDir, file.name));
      }
    });
  });
}

buildHTML().then(() => mergeStyles(stylesDir, join(distDir, 'style.css'))).then(() => copyDir(assetsDir, join(distDir, 'assets')))