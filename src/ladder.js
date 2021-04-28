import Queue from "./queue.js";

function WordLadder(word) {
    /* This is a linked list; initially the prev pointer is null. */
    this.prev = null;

    /* The word stored here is given by the input word. */
    this.word = word;
}

/**
 * Returns the last word in the word ladder.
 */
WordLadder.prototype.lastWord = function () {
    return this.word;
};

/**
 * Creates and returns a new word ladder formed by adding a new word onto the
 * end of this ladder.
 */
WordLadder.prototype.extendLadder = function (word) {
    /* Construct a new linked list cell and chain it onto the end. */
    var result = new WordLadder(word);
    result.prev = this;
    return result;
};

/**
 * Converts a word ladder into a standard array.
 */
WordLadder.prototype.toArray = function () {
    /* Begin with the empty array. */
    var result = [];

    /* Walk back to the start of the linked list, appending each word to the
     * result array.
     */
    for (var curr = this; curr !== null; curr = curr.prev) result.push(curr.word);

    /* Reverse and return the array. */
    result.reverse();
    return result;
};

function findSuccessors(word, words) {
    /* For each letter, try replacing that letter with something adjacent to
     * it and add it to the result list if this change yields a word.
     */
    var result = [];
    var msg = "";

    for (var i = 0; i < word.length; ++i) {
        for (var ch = "a".charCodeAt(0); ch <= "z".charCodeAt(0); ++ch) {
            /* Build the new word. */
            var candidate = word.substring(0, i) + String.fromCharCode(ch) + word.substring(i + 1);

            /* See if it's a word. */
            if (word != candidate && words[candidate] !== undefined) result.push(candidate);
        }
    }
    return result;
}

export function findWordLadder(startWord, endWord, words) {
    /* Maintain a work list of partial ladders, seeded with the start word. */
    var workList = new Queue();
    workList.enqueue(new WordLadder(startWord));

    /* Also maintain a list of words that we have already processed; initially
     * this is empty.
     */
    var usedWords = {};

    /* While the worklist isn't empty, process elements from it. */
    while (workList.length() !== 0) {
        /* Obtain the current ladder. */
        var ladder = workList.dequeue();

        /* Look at the last word in the ladder.  If we've already seen it, skip
         * this word.
         */
        if (usedWords[ladder.lastWord()] !== undefined) continue;

        /* Otherwise, add that to the used word list. */
        usedWords[ladder.lastWord()] = null;

        /* If the last word is the destination word, hand back this word
         * ladder.
         */
        if (ladder.lastWord() == endWord) return ladder.toArray();

        /* Now, find all possible successor words for this word, and for each
         * of them extend the word ladder.
         */
        var successors = findSuccessors(ladder.lastWord(), words);

        /* For each successor, chain it onto the current word ladder and put
         * it back into the queue.
         */
        for (var i = 0; i < successors.length; ++i)
            workList.enqueue(ladder.extendLadder(successors[i]));
    }

    return [];
}
