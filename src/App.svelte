<script>
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";

    import { generateGame, getWordDifs } from "./game.js";
    import { findWordLadder } from "./ladder.js";

    import "./global.scss";

    let [startWord, endWord] = ["-", "-"];

    let words = {}; // word lists
    let letters = 4; // defualt to 3 letter words

    let ladder = []; // current game words

    $: currentWord = ladder.length > 0 ? ladder[ladder.length - 1].word : startWord;

    let inputWord;

    let score = 0;
    let isDone = false;

    let errorMessage = "";

    onMount(async () => {
        await loadWords();
        newGame();
    });

    async function loadWords() {
        const response = await fetch(`../words/letters_${letters}.json`);
        words[letters] = await response.json();
    }

    async function newGame(newLetters) {
        if (newLetters) letters = newLetters;

        if (words[letters] == undefined) {
            await loadWords();
        }

        [startWord, endWord] = await generateGame(words[letters]);
        ladder = [];
        score = 0;
        isDone = false;
        errorMessage = "";

        // probably a better way to do this
        // bug occurs when game is over and input isn't rendered
        setTimeout(function () {
            inputWord.value = "";
            inputWord.focus();
            inputWord.maxLength = letters;
        }, 0);
    }

    function handleSubmit() {
        let tempWord = inputWord.value.toLowerCase();
        inputWord.value = "";

        if (tempWord.length != startWord.length) {
            errorMessage = "incorrect word length";
            return;
        }
        if (words[letters][tempWord] === undefined) {
            errorMessage = "not a word";
            return;
        }

        let { currentDifs, endDifs, difIndex } = getWordDifs(currentWord, tempWord, endWord);

        if (currentDifs != 1) {
            errorMessage = currentDifs > 1 ? "too many differences" : "needs one difference";
            return;
        }

        ladder.push({ word: tempWord, i: difIndex });
        ladder = ladder;

        score++;

        if (endDifs == 1) isDone = true;
    }

    function back() {
        inputWord.value = "";
        inputWord.focus();
        errorMessage = "";

        ladder.pop();
        ladder = ladder;

        score--;
    }

    function hint() {
        inputWord.value = "";
        inputWord.focus();
        errorMessage = "";

        let solution = findWordLadder(currentWord, endWord, words[letters]);

        let { endDifs, difIndex } = getWordDifs(currentWord, solution[1], endWord);

        ladder.push({ word: solution[1], i: difIndex });
        ladder = ladder;

        score += 2;

        if (endDifs == 1) isDone = true;
    }
</script>

<main>
    <button on:click={() => newGame(letters)}>🔄</button>
    <button on:click={() => newGame(3)}>3️⃣</button>
    <button on:click={() => newGame(4)}>4️⃣</button>
    <button on:click={() => newGame(5)}>5️⃣</button>

    {#if isDone == true}
        <p style="font-weight: 600;">score = {score}</p>
    {/if}

    <p class="bold">{startWord}</p>

    {#each ladder as { word, i }}
        <p>
            {word.substring(0, i)}<span>{word[i]}</span>{word.substring(i + 1)}
        </p>
    {/each}

    {#if isDone != true}
        <div>
            <button disabled={ladder.length < 1} on:click={back}>⬅️</button>
            <form on:submit|preventDefault={handleSubmit}>
                <label for="word">word</label>
                <input
                    id="word"
                    type="text"
                    placeholder="word"
                    class:shake={errorMessage != ""}
                    bind:this={inputWord}
                    on:keypress={() => (errorMessage = "")}
                />
            </form>
            <button on:click={hint}>💡</button>
        </div>
    {/if}

    {#if errorMessage != ""}
        <p class="error" in:fly={{ y: -20, duration: 75 }} out:fly={{ y: -20, duration: 75 }}>
            {errorMessage}
        </p>
    {/if}

    <p class="bold">{endWord}</p>
</main>

<style lang="scss">
    button {
        margin-bottom: 1.5rem;
        padding: 0.2rem;

        font-size: 2rem;
        font-weight: 500;
    }

    div {
        display: flex;
        justify-content: center;

        button {
            width: 3.5rem;
            font-size: 2.2rem;
            margin-bottom: 0;
        }

        button:disabled {
            opacity: 0.5;
        }
    }

    form {
        input {
            margin: 0 0.75rem;
            padding: 0.25rem 0.5rem;
            width: 6.5rem;

            border-radius: 0.5rem;
            border: 0.2rem solid;

            text-transform: lowercase;
            text-align: center;

            font-family: inherit;
            font-size: 2.5rem;
            font-weight: 500;
        }

        input:focus {
            outline: none;
        }

        label {
            position: absolute;
            overflow: hidden;
            clip: rect(0 0 0 0);
            height: 1px;
            width: 1px;
            margin: -1px;
            padding: 0;
            border: 0;
        }
    }

    .shake {
        animation: shake 0.15s ease-in-out 0s 2;
    }

    @keyframes shake {
        0% {
            margin-left: 1rem;
            margin-right: 1rem;
        }
        25% {
            margin-left: 0.5rem;
            margin-right: 1.5rem;
        }
        75% {
            margin-left: 1.5rem;
            margin-right: 0.5rem;
        }
        100% {
            margin-left: 1rem;
            margin-right: 1rem;
        }
    }

    p {
        margin: 0.2rem 0;
        font-size: 2.5rem;

        span {
            color: rgb(0, 100, 200);
            font-weight: 500;
        }
    }

    .bold {
        font-weight: 600;
    }

    .error {
        color: red;
        font-size: 1.5rem;
        font-weight: 500;
    }
</style>
