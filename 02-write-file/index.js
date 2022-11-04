const fs = require("fs");
const path = require("path");
const { stdin, stdout } = process;

const filePath = path.join(__dirname, "text.txt");
const finishProcess = () => {
  stdout.write("Thank you, bye!");
  process.exit();
};

fs.writeFile(filePath, "", () => {});
stdout.write("Hi, enter some text.\n");
stdin.on("data", (data) => {
  const dataString = data.toString();
  if (dataString.trim() === "exit") {
    finishProcess();
  }
  fs.appendFile(filePath, dataString, () => {});
});

process.on("SIGINT", finishProcess);