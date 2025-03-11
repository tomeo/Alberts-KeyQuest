import { wordsWithIcons } from "./wordData.js";

export default class WordManager {
    constructor() {
        this.wordsWithIcons = wordsWithIcons;
    }

    getRandomWord() {
        return this.wordsWithIcons[Math.floor(Math.random() * this.wordsWithIcons.length)];
    }

    getRandomWordByLength(length) {
        const filteredWords = this.wordsWithIcons.filter(wordObj => wordObj.word.length === length);
        return filteredWords.length > 0 ? filteredWords[Math.floor(Math.random() * filteredWords.length)] : null;
    }
}
