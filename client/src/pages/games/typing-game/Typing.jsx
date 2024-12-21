import React, { useEffect, useRef, useState } from 'react';
import './typing-game.css';
import { paragraphs } from './paragraphs';

export default function TypingGame() {
  const [typingText, setTypingText] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [cpyUserInput, setCpyUserInput] = useState('');
  const [time, setTime] = useState(60);
  const [isTyping, setIsTyping] = useState(false);
  const [cpm, setCPM] = useState(0);
  const [wpm, setWPM] = useState(0);
  const timerRef = useRef(null);
  const inputRef = useRef(null);

  const randomParagraph = () => {
    const randIndex = Math.floor(Math.random() * paragraphs.length);
    const cpyTypingText = paragraphs[randIndex].split('').map((char, index) => (
      <span key={index}>{char}</span>
    ));
    setTypingText(cpyTypingText);
  };

  const initTyping = () => {
    const cpyTypingText = [...typingText];
    const charactersLetters = typingText.map((char) => char.props.children);
    const typedChar = userInput[charIndex];

    if (charIndex < charactersLetters.length && time > 0) {
      if (!isTyping && userInput) {
        setIsTyping(true);
        if (!timerRef.current) {
          timerRef.current = setInterval(() => {
            setTime((prevTime) => {
              if (prevTime <= 1) {
                clearInterval(timerRef.current);
                timerRef.current = null;
                setIsTyping(false);
                return 0;
              }
              return prevTime - 1;
            });
          }, 1000);
        }
      }

      if (typedChar == null) {
        if (
          charactersLetters[charIndex - 1] !== cpyUserInput[charIndex - 1] &&
          userInput
        ) {
          setMistakes((prevMistakes) => prevMistakes - 1);
        }
        if (
          charactersLetters[charIndex - 1] === cpyUserInput[charIndex - 1]
        ) {
          setCPM(charIndex - 1 - mistakes);
        }
        setCharIndex((prevCharIndex) => prevCharIndex - 1);
        cpyTypingText[charIndex] = (
          <span key={charIndex}>{charactersLetters[charIndex]}</span>
        );

        cpyTypingText[charIndex - 1] = (
          <span key={charIndex - 1} className="active">
            {charactersLetters[charIndex - 1]}
          </span>
        );
        setTypingText(cpyTypingText);
        return;
      } else {
        if (charactersLetters[charIndex] === typedChar) {
          cpyTypingText[charIndex] = (
            <span key={charIndex} className="correct">
              {charactersLetters[charIndex]}
            </span>
          );
          setCPM(charIndex + 1 - mistakes);
        } else if (charactersLetters[charIndex] !== typedChar && userInput) {
          setMistakes((prevMistakes) => prevMistakes + 1);
          cpyTypingText[charIndex] = (
            <span key={charIndex} className="incorrect">
              {charactersLetters[charIndex]}
            </span>
          );
        }
      }

      setCharIndex((prevCharIndex) => prevCharIndex + 1);
      cpyTypingText[charIndex + 1] = (
        <span key={charIndex + 1} className="active">
          {charactersLetters[charIndex + 1]}
        </span>
      );
      const cpyWPM = Math.round(((charIndex - mistakes) / 5 / (60 - time)) * 60);
      setTypingText(cpyTypingText);
      setCpyUserInput(userInput);
      setWPM(cpyWPM < 0 || !cpyWPM || cpyWPM === Infinity ? 0 : cpyWPM);
    } else {
      setUserInput('');
    }
  };

  const resetGame = () => {
    randomParagraph();
    setTime(60);
    setUserInput('');
    setCharIndex(0);
    setMistakes(0);
    setCPM(0);
    setWPM(0);
    setIsTyping(false);
    clearInterval(timerRef.current);
    timerRef.current = null;
  };

  useEffect(() => {
    randomParagraph();
    const handleKeyDown = () => {
      inputRef.current?.focus();
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    initTyping();
  }, [userInput]);

  return (
    <div className="flex items-center justify-center mt-20">
      <div className="wrapper w-[770px] p-9 bg-white rounded-xl">
        <input
          type="text"
          className="input-field absolute -z-10 opacity-0"
          ref={inputRef}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <div className="content-box rounded-xl">
          <div className="typing-text max-h-[255px] overflow-y-auto">
            <p className="text-xl text-justify" key={1}>
              {typingText}
            </p>
          </div>
          <div className="content flex justify-between py-3 px-0 items-center">
            <ul className="result-details flex justify-between">
              <li className="time">
                <p>Time Left:</p>
                <span>
                  <b className="font-medium">{time}</b>s
                </span>
              </li>
              <li className="mistake">
                <p>Mistakes:</p>
                <span>{mistakes}</span>
              </li>
              <li className="wpm">
                <p>WPM:</p>
                <span>{wpm}</span>
              </li>
              <li className="cpm">
                <p>CPM:</p>
                <span>{cpm}</span>
              </li>
            </ul>
            <button
              className="border-none outline-none w-[105px] bg-sky-500 py-2 px-0 cursor-pointer text-base rounded-md text-white"
              onClick={resetGame}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
