import React, { useState, useEffect } from 'react';
import './hangman.css';
import { blockchainWordList } from './wordList';

export default function HangmanGame() {
  const [word, setWord] = useState([]);  // Removed type annotation
  const [hint, setHint] = useState('');  // Removed type annotation
  const [currentWord, setCurrentWord] = useState('');  // Removed type annotation
  const [wrongGuessCount, setWrongGuessCount] = useState(0);  // Removed type annotation
  const [maxGuesses, setMaxGuesses] = useState(6);  // Removed type annotation
  const [revealedLetters, setRevealedLetters] = useState([]);  // Removed type annotation
  const [correctLetters, setCorrectLetters] = useState([]);  // Removed type annotation

  // Function to fetch a random word and hint
  const getRandomWord = () => {
    const { word, hint } = blockchainWordList[Math.floor(Math.random() * blockchainWordList.length)];
    setHint(hint);
    setCurrentWord(word);
    setRevealedLetters(Array(word.length).fill(''));
  };

  const handleButtonClick = (button, clickedLetter) => {
    button.disabled = true; // Disable the button after it is clicked

    if (currentWord.includes(clickedLetter)) {
      // Update revealed letters
      const updatedRevealedLetters = revealedLetters.map((char, index) =>
        currentWord[index] === clickedLetter ? clickedLetter : char
      );
      setRevealedLetters(updatedRevealedLetters);

      // Update correct letters
      setCorrectLetters((prev) => Array.from(new Set([...prev, clickedLetter])));
    } else {
      // Increment wrong guesses
      setWrongGuessCount((prev) => prev + 1);
    }
  };

  const refreshPage = () => {
    window.location.reload();
  };

  useEffect(() => {
    getRandomWord();
  }, []);

  return (
    <div className="flex items-center justify-center mt-20">
      {wrongGuessCount === maxGuesses || revealedLetters.join('') === currentWord ? (
        <div className="game-modal fixed bg-opacity-60 bg-black left-0 top-0 w-full h-full flex items-center justify-center z-10 pointer-events-auto">
          <div className="content bg-white max-w-[420px] w-[420px] text-center rounded-lg p-8">
            <img
              src={`/${
                revealedLetters.join('') === currentWord
                  ? 'Game_images/victory.gif'
                  : 'Game_images/lost.gif'
              }`}
              alt="Game result"
              className="max-w-32 mb-5 mx-auto"
            />
            {revealedLetters.join('') === currentWord ? (
              <h4 className="text-2xl">You win!</h4>
            ) : (
              <div>
                <h4 className="text-2xl">Game Over!</h4>
                <p className="text-lg">
                  The correct word was: <b>{currentWord}</b>
                </p>
              </div>
            )}
            <button className="play-again py-3 px-6" onClick={refreshPage}>
              Play Again
            </button>
          </div>
        </div>
      ) : null}

      <div className="w-[1000px] bg-white flex py-14 px-10 rounded-xl gap-16 items-end">
        <div>
          <img
            src={`/Game_images/hangman-${wrongGuessCount}.svg`}
            alt="Hangman"
            className="max-w-72"
          />
          <h1 className="text-2xl mt-5 text-center uppercase">Hashman Game</h1>
        </div>
        <div className="game-box">
          <ul className="word-display flex list-none gap-3 items-center justify-center">
            {revealedLetters.map((char, index) => (
              <li key={index} className={`letter ${char ? 'guessed' : ''}`}>
                {char || ''}
              </li>
            ))}
          </ul>
          <h4 className="hint-text">
            Hint: <b>{hint}</b>
          </h4>
          <h4 className="guesses-text text-red-600">
            Incorrect guesses: <b>{wrongGuessCount}/{maxGuesses}</b>
          </h4>
          <div className="keyboard flex gap-1 flex-wrap justify-center mt-10">
            {Array.from({ length: 26 }, (_, i) => {
              const letter = String.fromCharCode(97 + i); // Generate letters 'a' to 'z'
              return (
                <button
                  key={letter}
                  onClick={(e) => handleButtonClick(e.target, letter)}
                  className="keyboard-button"
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
