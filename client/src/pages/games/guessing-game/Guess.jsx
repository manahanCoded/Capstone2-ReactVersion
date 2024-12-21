'use client'

import { useEffect, useState, useRef } from 'react'
import './guessing-game.css'
import { guessWordList } from './wordGuess'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
export default function GuessingGame() {
  const [guessWord, setGuessWord] = useState('')
  const [guessWordLength, setGuessWordLength] = useState([])
  const [hint, setHint] = useState('')
  const [displayedLetters, setDisplayedLetters] = useState([])
  const [incorrectLetters, setIncorrectLetters] = useState([])
  const [correctLetters, setCorrectLetters] = useState([])
  const [guessCount, setGuessCount] = useState(8)

  const inputRef = useRef(null)

  function randomWord() {
    let ranObj = guessWordList[Math.floor(Math.random() * guessWordList.length)]
    setCorrectLetters([])
    setIncorrectLetters([])
    setGuessCount(8)
    setGuessWord(ranObj.word)
    setHint(ranObj.hint)
    const arrayLength = Array.from(
      { length: ranObj.word.length },
      (_, index) => index
    )
    setDisplayedLetters(Array(ranObj.word.length).fill(''))
    console.log(ranObj.word)
    setGuessWordLength(arrayLength)
  }

  function initGame(e) {
    let key = e.target.value
    if (
      key.match(/^[A-Za-z]+$/) &&
      !incorrectLetters.includes(`${key}, `) &&
      !correctLetters.includes(key)
    ) {
      if (guessWord.includes(key)) {
        console.log('This is the guessed word: ', guessWord)
        console.log('This is the key pressed: ', key)
        console.log('This is the guessCount: ', guessCount)

        const updatedLetters = [...displayedLetters]
        let cpyCorrectLetters = [...correctLetters]

        cpyCorrectLetters.push(key)
        setCorrectLetters(cpyCorrectLetters)
        for (let i = 0; i < guessWord.length; i++) {
          if (guessWord[i] === key) {
            updatedLetters[i] = key // Update the correct position
          }
        }
        setDisplayedLetters(updatedLetters)
      } else {
        console.log('This means it else is executed: ', key)
        console.log('This is the guessCount: ', guessCount)
        let cpyIncorrectLetters = [...incorrectLetters]
        cpyIncorrectLetters.push(`${key}, `)
        setIncorrectLetters(cpyIncorrectLetters)
        setGuessCount((prevCount) => {
          return prevCount - 1
        })
      }
    }
    e.target.value = ''
  }

  console.log('This is the correct letters length', correctLetters.length)
  console.log('This is the guess word length: ', guessWord.length)
  console.log('This is the correct letters array: ', correctLetters)
  console.log('This is the guess word: ', guessWord)

  const uniqueSet = new Set(guessWord)
  const uniqueArray = Array.from(uniqueSet)

  setTimeout(() => {
    if (guessWord && correctLetters.length === uniqueArray.length) {
      alert(`Congrats! You found the word: ${guessWord.toUpperCase()}`)
      randomWord()
    } else if (guessCount < 1) {
      alert("Game over! You don't have remaining guesses")
      randomWord()
    }
  })

  useEffect(() => {
    randomWord()

    const handleKeyDown = () => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <MaxWidthWrapper className="w-full flex items-center justify-center">
    <div className="wrapper m-auto w-[580px]  rounded-xl ">
    <h1 className="text-2xl font-medium py-5 px-6">Guess the Word</h1>
    <div className="content-mayn">
      <input
        ref={inputRef}
        type="text"
        className="typing-input -z-30 absolute opacity-0"
        onChange={(e) => initGame(e)}
        maxLength={guessWord.length}
      />
      <div className="inputs flex  flex-row justify-center">
        {guessWordLength.map((_, index) => (
          <input
            key={index}
            type="text"
            value={
              guessCount < 1 ? guessWord[index] : displayedLetters[index]
            }
            disabled
          />
        ))}
      </div>
      <div className="details">
        <p className="hint">
          Hint: <span>{hint}</span>
        </p>
        <p className="guess-left">
          Remaining Guess: <span>{guessCount}</span>
        </p>
        <p className="wrong-letter ">
          Wrong letters: <span>{incorrectLetters}</span>
        </p>
      </div>
      <button
        className="reset-btn w-[100%] text-xl py-4 px-0 outline-none border-none cursor-pointer text-white bg-sky-400 rounded-md"
        onClick={randomWord}
      >
        Reset Game
      </button>
    </div>
  </div>
  </MaxWidthWrapper>
  )
}
