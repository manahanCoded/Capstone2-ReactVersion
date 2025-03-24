import { useEffect, useState, useRef } from 'react'
import './guessing-game.css'
import { blockchainGuess, cryptoGuess, nftGuess } from './wordGuess'
import { useLocation } from 'react-router-dom'
export default function GuessingGame() {
  const [guessWord, setGuessWord] = useState('')
  const [category, setCategory] = useState('blockchain')
  const [guessWordLength, setGuessWordLength] = useState([])
  const [hint, setHint] = useState('')
  const [displayedLetters, setDisplayedLetters] = useState([])
  const [incorrectLetters, setIncorrectLetters] = useState([])
  const [correctLetters, setCorrectLetters] = useState([])
  const [guessCount, setGuessCount] = useState(8)
  const [isPickingCategory, setIsPickingCategory] = useState(true)
  const [tries, setTries] = useState(3)
  const [score, setScore] = useState(0)

  const location = useLocation()
  const inputRef = useRef(null)

  function randomWord() {
    let currentCategory = blockchainGuess

    if (category === 'blockchain') currentCategory = blockchainGuess
    if (category === 'cryptocurrency') currentCategory = cryptoGuess
    if (category === 'nft') currentCategory = nftGuess

    console.log('This is the selected category: ', currentCategory)
    let ranObj =
      currentCategory[Math.floor(Math.random() * currentCategory.length)]
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

  console.log('This is the Hint: ', hint)
  const uniqueSet = new Set(guessWord)
  const uniqueArray = Array.from(uniqueSet)

  setTimeout(() => {
    if (guessCount < 1) {
      setTries(tries - 1)
      randomWord()
    }
  }, 3000)

  setTimeout(() => {
    if (guessWord && correctLetters.length === uniqueArray.length) {
      setScore(score + 10)
      randomWord()
    }
  }, 3000)

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
  }, [category])

  return (
    <div
      className={`${category === 'blockchain' ? 'bg-blue-900' : ''} 
      ${
        category === 'nft' &&
        guessCount >= 1 &&
        guessWord &&
        correctLetters.length !== uniqueArray.length
          ? 'bg-purple-900'
          : ''
      } 
      ${
        category === 'cryptocurrency' &&
        guessCount >= 1 &&
        guessWord &&
        correctLetters.length !== uniqueArray.length
          ? 'bg-yellow-900'
          : ''
      }  
      ${
        guessWord && correctLetters.length === uniqueArray.length
          ? 'bg-green-900'
          : ''
      }  
      ${guessCount < 1 ? 'bg-red-900' : ''}  
      flex items-center justify-center min-h-screen h-screen w-screen`}
    >
      {isPickingCategory ? (
        <div className="picking-bg fixed  bg-black left-0 top-40 w-[100%] h-[110%]  flex items-center justify-center -mt-28 z-10 pointer-events-auto font-pxltd motion-preset-shrink">
          <div className="game-modal content bg-[url('/Game_images/guessing-word.png')]  max-w-[1000px] w-full max-h-[570px] h-full text-center rounded-lg p-8 mb-24 flex flex-col justify-center items-center">
            <h4 className="text-5xl font-bold text-white">Choose category: </h4>
            <div className="title-buttons flex flex-col justify-around items-center">
              <div className="flex flex-col justify-between items-center gap-4 h-[250px] mt-10">
                <button
                  className="category-btn bg-blue-900 text-white w-[180%] text-4xl h-16 hover:bg-blue-300 hover:text-blue-900"
                  onClick={() => {
                    setCategory('blockchain')
                    setIsPickingCategory(false)
                  }}
                >
                  Blockchain
                </button>
                <button
                  className="category-btn bg-purple-700 text-white w-[180%] text-4xl h-16 hover:bg-purple-300 hover:text-purple-900"
                  onClick={() => {
                    setCategory('nft')
                    setIsPickingCategory(false)
                  }}
                >
                  NFT
                </button>
                <button
                  className="category-btn bg-yellow-700 text-white w-[180%] text-4xl h-16 hover:bg-yellow-300 hover:text-yellow-900"
                  onClick={() => {
                    setCategory('cryptocurrency')
                    setIsPickingCategory(false)
                  }}
                >
                  Cryptocurrency
                </button>
                <button className="category-btn bg-black text-white w-[180%] text-4xl h-16 hover:bg-white hover:text-black">
                  <a href="https://capstone2-react-version.vercel.app/games">
                    Go back
                  </a>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
      {tries === 0 ? (
        <div className="picking-bg fixed  bg-black left-0 top- w-[100%] h-[110%]  flex items-center justify-center mt-32 z-10 pointer-events-auto font-pxltd motion-preset-fade">
          <div className="game-modal content bg-[url('/Game_images/guessing-word.png')] max-w-[1000px] w-full max-h-[540px] h-full text-center rounded-lg p-8 mb-24 flex flex-col justify-center items-center gap-10">
            <h4 className="text-3xl font-bold text-white">
              Total Score:
              <span className="font-sans text-3xl font-bold">: </span>
              {score}
            </h4>
            <h4 className="text-4xl font-bold text-white ">
              Number of guessed words
              <span className="text-3xl font-sans font-bold"> : </span>
              {score / 10 < 0 ? 0 : score / 10}
            </h4>
            <button
              className="category-btn bg-black  text-white w-[50%] text-4xl h-16 hover:bg-white hover:text-black"
              onClick={() => {
                setTries(3)
                setScore(0)
                setIsPickingCategory(true)
              }}
            >
              Play Again
            </button>
            <button className="category-btn bg-black text-white w-[50%] text-4xl h-16 hover:bg-white hover:text-black">
              <a href="https://capstone2-react-version.vercel.app/games">
                Go back
              </a>
            </button>
          </div>
        </div>
      ) : (
        ''
      )}

      {(guessWord && correctLetters.length === uniqueArray.length) ||
      guessCount < 1 ? (
        <div
          className={`fixed left-50 top-0  flex flex-col  items-center justify-center mt-20 z-50 pointer-events-auto p-1 font-pxltd`}
        >
          <div
            className={`content ${
              guessCount < 1 ? 'bg-red-600 animate-shake ' : ''
            } ${
              guessWord && correctLetters.length === uniqueArray.length
                ? 'bg-green-600 motion-preset-confetti'
                : ''
            } max-w-[400px] w-full max-h-[120px] h-full text-center rounded-lg p-8 mb-24 flex justify-center items-center gap-10 z-10`}
          >
            <h4
              className={`text-4xl font-bold text-white ${
                guessCount < 1 ? 'animate-shake' : 'motion-preset-confetti'
              }`}
            >
              {guessCount < 1 ? 'No more guesses' : ''}
              {guessWord && correctLetters.length === uniqueArray.length
                ? 'Correct Word'
                : ''}
            </h4>
          </div>
          {guessCount < 1 ? (
            <img
              src={`/Game_images/full-heart.png`}
              alt="lives-img"
              className=" w-13 max-h-32 h-13 relative z-20 -mt-56 animate-fall"
            />
          ) : (
            ''
          )}
          {guessWord && correctLetters.length === uniqueArray.length ? (
            <img
              src={`/Game_images/score.png`}
              alt="lives-img"
              className=" w-13 max-h-32 h-13 relative z-20 -mt-56 -mr-72 motion-preset-confetti"
            />
          ) : (
            ''
          )}
        </div>
      ) : (
        ''
      )}

      <div className="wrapper w-[1200px] h-[450px] bg-white rounded-xl fixed z-0 font-pxltd pb-4">
        <div className="flex items-center justify-between">
          <h1
            className={`text-4xl font-medium py-5 px-6   ${
              category === 'blockchain' ? 'text-blue-900' : ''
            }
                  ${category === 'nft' ? 'text-purple-900' : ''}
                  ${category === 'cryptocurrency' ? 'text-yellow-900' : ''}
                  `}
          >
            Guessing Quest
          </h1>
          <div className="flex justify-between items-center gap-5 mr-7">
            <img
              src={`/Game_images/lives${tries}.png`}
              alt="lives-img"
              className={`w-40 max-h-32 h-16 ${
                tries <= 1 ? 'animate-pulse' : ''
              }`}
            />
            <h2 className="text-3xl ">
              score
              <span className="font-sans text-4xl font-bold">: </span>
              {score}
            </h2>
          </div>
        </div>

        <div className={`content `}>
          <input
            ref={inputRef}
            type="text"
            className="typing-input -z-30 absolute opacity-0"
            onChange={(e) => initGame(e)}
            maxLength={guessWord.length}
            disabled={
              guessCount < 1 ||
              (guessWord && correctLetters.length === uniqueArray.length)
                ? true
                : false
            }
          />
          <div
            className={`inputs flex justify-center items-center mt-12 text-3xl font-bold`}
          >
            {guessWordLength.map((_, index) => (
              <input
                className={`max-w-20 max-h-20 w-full h-full border-4 
                  ${category === 'blockchain' ? 'border-blue-900' : ''}
                  ${category === 'nft' ? 'border-purple-900' : ''}
                  ${category === 'cryptocurrency' ? 'border-yellow-900' : ''}
                  
                  `}
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
            <p className="hint mt-16 mb-4">
              <span className="text-3xl">Hint</span>
              <span className="font-sans text-4xl font-bold">: </span>
              <span className="text-3xl font-sans font-bold">{hint}</span>
            </p>
            <p className="guess-left text-2xl mb-4">
              <span className="text-3xl">Remaining Guesses</span>
              <span className="font-sans text-4xl font-bold">: </span>
              <span
                className={`text-3xl font-bold ${
                  guessCount > 5 ? 'text-green-900' : ''
                } 
                ${guessCount > 3 && guessCount <= 5 ? 'text-yellow-900' : ''}
                ${
                  guessCount >= 0 && guessCount <= 3
                    ? 'text-red-900 animate-pulse'
                    : ''
                }
                `}
              >
                {guessCount}
              </span>
            </p>
            <p className="wrong-letter text-2xl mb-4">
              <span className="text-3xl">Wrong letters:</span>
              <span className="font-sans text-2xl font-bold">:</span>
              <span className="text-red-900 font-bold text-2xl">
                {' '}
                {incorrectLetters}
              </span>
            </p>
          </div>
          {/* <button
            className="reset-btn w-[100%] text-xl py-4 px-0 outline-none border-none cursor-pointer text-white bg-sky-400 rounded-md"
            onClick={() => {
              setTries(3)
              setIsPickingCategory(true)
            }}
          >
            Reset Game
          </button> */}
        </div>
      </div>
    </div>
  )
}
