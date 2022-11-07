const { stat } = require("fs");
const { readdir } = require("fs/promises");
const path = require("path");
const { stdout } = require("process");

const dir = path.join(__dirname, "secret-folder");

readdir(dir, { withFileTypes: true }).then((data) =>
  data.forEach((item) => {
    const itemName = path.join(dir, item.name);

    if (item.isFile()) {
      stat(itemName, (err, stats) => {
        if (stats) {
          const fileNme = item.name.split(".")[0];
          const fileExt = path.extname(itemName).slice(1);
          const fileSize = (stats.size / 1024).toFixed(3);
          stdout.write(`${fileNme} - ${fileExt} - ${fileSize}kb\n`);
        } else {
          stdout.write(err.message);
        }
      });
    }
  })
);
