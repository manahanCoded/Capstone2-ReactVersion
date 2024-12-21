import React, { useEffect, useState, useRef } from 'react';
import './scramble.css';
import { scrambleWords } from './scrambleWords';

export default function Scramble() {
  const [randomWord, setRandomWord] = useState('');
  const [correctWord, setCorrectWord] = useState('');
  const [hint, setHint] = useState('');
  const [userInput, setUserInput] = useState('');
  const [time, setTime] = useState(30);
  const timerRef = useRef(null);

  const initTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current); // Stop the timer when time reaches 0
          alert(`Time's up! ${correctWord.toUpperCase()} was the correct word`);
          setUserInput('');
          initGame();
          return 30;
        }
        console.log('This is the time: ', prevTime);
        return prevTime - 1;
      });
    }, 1000);
  };

  const initGame = () => {
    clearInterval(timerRef.current);
    setTime(30);
    initTimer();

    const randomObj = scrambleWords[Math.floor(Math.random() * scrambleWords.length)];
    const wordArray = randomObj.word.split('');

    for (let i = wordArray.length - 1; i > 0; i--) {
      // Getting a random index
      const j = Math.floor(Math.random() * (i + 1));
      // Shuffling and swapping wordArray letters randomly
      [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
    }

    const wordString = wordArray.join('');
    setRandomWord(wordString);
    setCorrectWord(randomObj.word.toLowerCase());
    setHint(randomObj.hint);
    console.log('The word string: ', wordString);
  };

  const checkWord = () => {
    const userWord = userInput.toLowerCase();
    if (userWord !== correctWord) {
      alert(`Oops! ${userWord} is not a correct word`);
      return;
    }
    alert(`Congrats! ${userWord.toUpperCase()} is the correct word`);
    setUserInput('');
    setTime(30);
    initGame();
  };

  useEffect(() => {
    initGame();

    // Cleanup interval on component unmount
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <div className="flex items-center justify-center mt-20">
      <div className="container w-[950px] rounded-md bg-white">
        <h2 className="text-2xl font-medium py-4 px-6">Word Scramble</h2>
        <div className="content">
          <p className="word text-4xl font-medium text-center uppercase tracking-[24px] -mr-6">
            {randomWord}
          </p>
          <div className="details">
            <p className="hint mt-4">
              Hint: <span>{hint}</span>
            </p>
            <p className="hint">
              Time Left:
              <span>
                <b className="font-medium">{time}</b>s
              </span>
            </p>
          </div>
          <input
            type="text"
            placeholder="Enter a valid word"
            className="w-[100%] height-[60px] outline-none py-4 px-4 rounded-md border-2 border-solid border-gray-600 text-xl"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            maxLength={correctWord.length}
          />
          <div className="buttons flex justify-between mt-5">
            <button className="refresh-word bg-gray-600" onClick={initGame}>
              Refresh Word
            </button>
            <button className="check-word bg-blue-600" onClick={checkWord}>
              Check Word
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
