"use strict";

let alphabetField = document.querySelector(".alphabet-field");
let inputField = document.querySelector(".input-field");
let inputFieldTitle = document.querySelector(".input-field-title");
let outputField = document.querySelector(".output-field");
let outputFieldTitle = document.querySelector(".output-field-title");
let keyField = document.querySelector(".key-field");
let actionButton = document.querySelector(".action-button");
let modeSelect = document.querySelector("#mode");

let mode = "encode";

actionButton.onclick = () => {
    try {
        if (mode === "encode")
            encode();
        else if (mode === "decode")
            decode();
    } catch (error) {
        console.log(error);
        alert(error.message);
    }
};

modeSelect.addEventListener('change', function() {
    if (this.value === "encode") {
        mode = "encode";
        actionButton.textContent = "Encrypt";
        inputFieldTitle.textContent = "Plaintext";
        outputFieldTitle.textContent = "Ciphertext";
        [inputField.value, outputField.value] = [outputField.value, inputField.value];
        inputField.placeholder = "e.g., Hello, world!";
    } else if (this.value === "decode") {
        mode = "decode";
        actionButton.textContent = "Decrypt";
        inputFieldTitle.textContent = "Ciphertext";
        outputFieldTitle.textContent = "Plaintext";
        [inputField.value, outputField.value] = [outputField.value, inputField.value];
        inputField.placeholder = "e.g., Hsclb, csfcd!";
    }
});

function encode() {
    checkAlphabet(alphabetField);
    let alphabet = alphabetField.value;

    checkKey(keyField, alphabet);
    let key = keyField.value;

    checkInputField(inputField);
    let plaintext = inputField.value;

    let ciphertext = encrypt(plaintext, key, alphabet);
    outputField.value = ciphertext;
}

function checkAlphabet(alphabetField) {
    let alphabet = alphabetField.value;

    if (alphabet.length < 1)
        throw Error("Alphabet should be at least one character.");

    for (let i = 0; i < alphabet.length; i++)
        for (let j = i + 1; j < alphabet.length; j++)
            if (alphabet[i] == alphabet[j])
                throw Error("Alphabet should contain unique characters.");
}

function checkKey(keyField, alphabet) {
    let key = keyField.value;

    if (key.length < 1)
        throw Error("Key should be at least one character."); 

    for (let i = 0; i < key.length; i++)
        if (!alphabet.includes(key[i]))
            throw Error("Key should not have characters that are not in the provided alphabet."); 
}

function checkInputField(inputField) {
    let input = inputField.value;

    if (input.length < 1)
        throw Error("Input should be at least one character."); 
}

function encrypt(plaintext, key, alphabet) {
    let n = key.length;
    let nSizedChunks = chunkString(plaintext, n)

    let ciphertext = "";
    let offset = 0;
    for (let chunk of nSizedChunks)
        for (let i = 0; i < chunk.length; i++)
            if (alphabet.includes(chunk[i])) {
                let indexOfChar = alphabet.indexOf(chunk[i]);
                let desiredKeyIndex = posMod(i - offset, key.length);
                let indexOfKeyChar = alphabet.indexOf(key[desiredKeyIndex]);
                let indexOfNewChar = (indexOfChar + indexOfKeyChar) % alphabet.length;
                ciphertext += alphabet[indexOfNewChar];
            } else {
                ciphertext += chunk[i];
                offset++;
            }
    
    return ciphertext;
}

function chunkString(str, length) {
    return str.match(new RegExp('(.|[\r\n]){1,' + length + '}', 'g'));
}

function posMod(n, m) {
    return ((n % m) + m) % m;
}

function decode() {
    checkAlphabet(alphabetField);
    let alphabet = alphabetField.value;

    checkKey(keyField, alphabet);
    let key = extractKey(keyField.value, alphabet);

    checkInputField(inputField);
    let ciphertext = inputField.value;

    let plaintext = encrypt(ciphertext, key, alphabet);
    outputField.value = plaintext;
}

function extractKey(encodeKey, alphabet) {
    let key = "";
    
    for (let i = 0; i < encodeKey.length; i++)
        key += alphabet[(alphabet.length - alphabet.indexOf(encodeKey.charAt(i))) % alphabet.length];

    return key;
}