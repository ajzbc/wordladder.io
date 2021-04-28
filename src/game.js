import { findWordLadder } from "./ladder.js";

export function generateGame(words) {
    let keys = Object.keys(words);

    const randomWord = () => {
        return keys[(keys.length * Math.random()) << 0];
    };

    let startWord = randomWord();
    let endWord = randomWord();

    while (findWordLadder(startWord, endWord, words).length < 4) {
        startWord = randomWord();
        endWord = randomWord();
    }

    // hopefully an easier way to do this
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve([startWord, endWord]);
        }, 0);
    });

    // return [startWord, endWord];
}

export function getWordDifs(currentWord, inputWord, endWord) {
    let currentDifs = 0;
    let endDifs = 0;
    let difIndex;

    for (let i = 0; i < currentWord.length; i++) {
        if (currentWord[i] != inputWord[i]) {
            currentDifs++;
            difIndex = i;
        }
        if (endWord[i] != inputWord[i]) endDifs++;
    }

    return { currentDifs, endDifs, difIndex };
}
