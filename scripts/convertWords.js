const fs = require("fs");
const path = require("path");
const { argv } = require("process");
const projectRoot = argv[2] || path.join(__dirname, "..");

let outputs = [3, 4, 5];

const data = fs.readFileSync(path.join(projectRoot, "scripts", "words_alpha.txt"), "UTF-8");
const words = data.split(/\r?\n/);

outputs.forEach((length) => {
    let dictionary = {};
    words.forEach((word) => {
        if (word.length == length) {
            dictionary[word] = 1;
        }
    });

    let json = JSON.stringify(dictionary);
    fs.writeFileSync(path.join(projectRoot, "public", "words", `letters_${length}.json`), json);
});
