import { useEffect, useState, useRef } from 'react'
import './scramble.css'
import { blockchainWords, cryptoWords, nftWords } from './scrambleWords'
import { Link } from 'react-router-dom'

export default function Scramble() {
  const [randomWord, setRandomWord] = useState([])
  const [category, setCategory] = useState('')
  const [correctWord, setCorrectWord] = useState('')
  const [hint, setHint] = useState('')
  const [userInput, setUserInput] = useState('')
  const [time, setTime] = useState(15)
  const [isPickingCategory, setIsPickingCategory] = useState(true)
  const [isTimesUp, setIsTimesUp] = useState(false)
  const [tries, setTries] = useState(3)
  const [score, setScore] = useState(0)
  const [showGameOverModal, setShowGameOverModal] = useState(false)
  const [isIncorrect, setIsIncorrect] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const timerRef = useRef(null)
  const correctWordRef = useRef(correctWord)

  const initTimer = () => {
    clearInterval(timerRef.current)

    if (tries <= 0 || showGameOverModal) {
      return // Stop execution if tries are 0
    }
    timerRef.current = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 0) {
          setTime(0)
          clearInterval(timerRef.current) // Stop the timer when time reaches 0

          setTries((prevTries) => {
            const newTries = prevTries - 1
            if (newTries <= 0) {
              clearInterval(timerRef.current) // Ensure timer is stopped when tries reach 0
              return 0 // Prevent negative tries
            }
            return newTries
          })
          setIsTimesUp(true)

          if (tries - 1 <= 0 || showGameOverModal) {
            clearInterval(timerRef.current) // Ensure timer is stopped when tries reach 0
            return 0
          }

          if (prevTime === time) {
            return
          }

          // console.log(
          //   'This the value of isPickingCategory: ',
          //   isPickingCategory
          // )
          // console.log('This is the number of tries: ', tries)
          if (!isPickingCategory) {
            setTimeout(() => {
              setUserInput('')
              initGame()
              return 5
            }, 2000)
          }
        }
        return prevTime - 1
      })
    }, 1000)
  }

  const initGame = () => {
    // console.log('This is executed')
    // console.log('This the value of isPickingCategory: ', isPickingCategory)

    clearInterval(timerRef.current)
    setTime(15)
    if (tries > 0) initTimer()
    setIsTimesUp(false)

    let currentCategory = blockchainWords

    if (category === 'blockchain') currentCategory = blockchainWords
    if (category === 'cryptocurrency') currentCategory = cryptoWords
    if (category === 'nft') currentCategory = nftWords

    let randomObj =
      currentCategory[Math.floor(Math.random() * currentCategory.length)]

    let wordString = shuffleWord(randomObj.word)
    setRandomWord(wordString)
    setCorrectWord(randomObj.word.toLowerCase())
    setHint(randomObj.hint)
    // console.log('The word string: ', wordString)
  }

  function shuffleWord(chosenWord) {
    let arrayWord = chosenWord.split('')
    for (let i = arrayWord.length - 1; i > 0; i--) {
      // Getting a random index
      let j = Math.floor(Math.random() * (i + 1)) // Fix applied here
      // Shuffling and swapping wordArray letters randomly
      ;[arrayWord[i], arrayWord[j]] = [arrayWord[j], arrayWord[i]]
    }
    let wordString = arrayWord.join('')
    return wordString
  }

  function checkWord() {
    let userWord = userInput.toLowerCase()
    if (userWord !== correctWord) {
      // alert(`Oops! ${userWord} is not a correct word`)
      setIsIncorrect(true)
      setTimeout(() => {
        setIsIncorrect(false)
      }, 1000)
    }
    if (userWord === correctWord) {
      // alert(`Congrats! ${userWord.toUpperCase()} is the correct word`)
      setIsCorrect(true)
      setTime(time)
      initTimer()
      setTimeout(() => {
        setIsCorrect(false)
        setScore(score + 10)
        setUserInput('')
        initGame()
      }, 1000)
    }
  }

  useEffect(() => {
    // console.log('this is executed')
    if (!isPickingCategory) {
      initGame()
    }
  }, [category])

  useEffect(() => {
    correctWordRef.current = correctWord
  }, [correctWord])

  useEffect(() => {
    if (tries <= 0) {
      setTimeout(() => {
        clearInterval(timerRef.current)
        setShowGameOverModal(true)
      }, 2000) // 1000ms = 1 second delay
    }
  }, [tries])

  useEffect(() => {
    if (isPickingCategory) {
      clearInterval(timerRef.current)
    } else {
      initTimer()
    }
  }, [isPickingCategory])

  // console.log('Tries: ', tries)
  const progress = (15 - time) / 15

  return (
    <div
      className={`${isIncorrect || isTimesUp ? 'bg-red-900' : ''} 
      ${isCorrect ? 'bg-green-900' : ''} 
      ${category === 'blockchain' ? 'bg-blue-900' : ''} 
      ${
        category === 'nft' && !isIncorrect && !isCorrect && !isTimesUp
          ? 'bg-purple-900'
          : ''
      } 
      ${
        category === 'cryptocurrency' &&
        !isIncorrect &&
        !isCorrect &&
        !isTimesUp
          ? 'bg-yellow-900'
          : ''
      }  
      flex items-center justify-center min-h-screen h-screen w-screen`}
    >
      {isPickingCategory ? (
        <div className="picking-bg fixed  bg-black left-0 top-40 w-[100%] h-[110%]  flex items-center justify-center -mt-28 z-10 pointer-events-auto font-pxltd motion-preset-shrink">
          <div className="game-modal content bg-[url('/Game_images/picking-bg.png')] max-w-[1000px] w-full max-h-[570px] h-full text-center rounded-lg p-8 mb-24 flex flex-col justify-center items-center">
            <h4 className="text-5xl font-bold text-white">Choose category: </h4>
            <div className="title-buttons flex flex-col justify-around items-center">
              <div className="flex flex-col justify-between items-center gap-4 h-[250px] mt-10">
                <button
                  className="category-btn bg-blue-900 text-white w-[180%] text-4xl h-16 hover:bg-blue-300 hover:text-blue-900"
                  onClick={() => {
                    setCategory('blockchain')
                    setIsPickingCategory(false)
                    setTries(3)
                    if (category === 'blockchain') {
                      setTime(15)
                    }
                  }}
                >
                  Blockchain
                </button>
                <button
                  className="category-btn bg-purple-700 text-white w-[180%] text-4xl h-16 hover:bg-purple-300 hover:text-purple-900"
                  onClick={() => {
                    setCategory('nft')
                    setIsPickingCategory(false)
                    setTries(3)
                    if (category === 'nft') {
                      setTime(15)
                    }
                  }}
                >
                  NFT
                </button>
                <button
                  className="category-btn bg-yellow-700 text-white w-[180%] text-4xl h-16 hover:bg-yellow-300 hover:text-yellow-900"
                  onClick={() => {
                    setCategory('cryptocurrency')
                    setIsPickingCategory(false)
                    setTries(3)
                    if (category === 'cryptocurrency') {
                      setTime(15)
                    }
                  }}
                >
                  Cryptocurrency
                </button>
                <Link
                  className="category-btn bg-black text-white w-[180%] text-4xl h-16 hover:bg-white hover:text-black"
                  to="https://cryptowarriors.netlify.app/games"
                >
                  Go back
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}

      {showGameOverModal && !isPickingCategory ? (
        <div
          className={`picking-bg fixed bg-black left-0 w-[100%] h-[110%]  flex items-center justify-center ${
            tries <= 0 ? 'mt-32' : '-mt-44'
          } z-10 pointer-events-auto p-1 font-pxltd motion-preset-fade`}
        >
          <div className="game-modal content bg-[url('/Game_images/picking-bg.png')] max-w-[1000px] w-full max-h-[540px] h-full text-center rounded-lg p-8 mb-24 flex flex-col justify-center items-center gap-10">
            <h4 className="text-4xl font-bold text-white">
              Total Score
              <span className="font-sans text-5xl font-bold"> : </span>
              {score}{' '}
            </h4>
            <h4 className="text-4xl font-bold text-white">
              Number of unscrambled words
              <span className="font-sans text-5xl font-bold"> : </span>
              {score / 10 < 0 ? 0 : score / 10}
            </h4>
            <button
              className="category-btn bg-black  text-white w-[50%] text-4xl h-16 hover:bg-white hover:text-black"
              onClick={() => {
                setTries(3)
                setScore(0)
                setIsPickingCategory(true)
                setShowGameOverModal(false)
              }}
            >
              Play Again
            </button>
            <button className="category-btn bg-black text-white w-[50%] text-4xl h-16 hover:bg-white hover:text-black">
              <a href="https://cryptowarriors.netlify.app/games">Go back</a>
            </button>
          </div>
        </div>
      ) : (
        ''
      )}

      {isIncorrect || isCorrect || isTimesUp ? (
        <div
          className={`fixed left-50 top-0  flex flex-col  justify-center mt-20 z-30 pointer-events-auto p-1 font-pxltd`}
        >
          <div
            className={`content ${
              isIncorrect || isTimesUp ? 'bg-red-600 animate-shake' : ''
            } ${
              isCorrect ? 'bg-green-600 motion-preset-confetti' : ''
            } max-w-[400px] w-full max-h-[120px] h-full text-center rounded-lg p-8 mb-24 flex  justify-center items-center gap-10 z-10`}
          >
            <h4
              className={`text-4xl font-bold text-white ${
                isIncorrect || isTimesUp
                  ? 'animate-shake'
                  : 'motion-preset-confetti'
              }`}
            >
              {isIncorrect ? 'Incorrect Word' : ''}
              {isCorrect ? 'Correct Word' : ''}
              {isTimesUp ? 'Times Up' : ''}
            </h4>
          </div>
          {isTimesUp ? (
            <img
              src={`/Game_images/full-heart.png`}
              alt="lives-img"
              className=" w-32 max-h-32 h-32  z-20 -mt-44 ml-20  animate-fall"
            />
          ) : (
            ''
          )}
          {isCorrect ? (
            <img
              src={`/Game_images/score.png`}
              alt="lives-img"
              className=" w-32 max-h-32 h-32  relative z-30 -mt-56  ml-72 motion-preset-confetti"
            />
          ) : (
            ''
          )}
        </div>
      ) : (
        ''
      )}

      <div className="container w-[950px] rounded-md bg-white font-pxltd mt-16">
        <div className="flex items-center justify-between">
          <h2
            className={`text-4xl font-medium py-4 px-6 
              ${category === 'blockchain' ? 'text-blue-900' : ''} 
              ${
                category === 'nft' && !isIncorrect && !isCorrect && !isTimesUp
                  ? 'text-purple-900'
                  : ''
              } 
              ${
                category === 'cryptocurrency' &&
                !isIncorrect &&
                !isCorrect &&
                !isTimesUp
                  ? 'text-yellow-900'
                  : ''
              }  
            `}
          >
            Web3 Mix n<span className="font-sans text-4xl font-bold">'</span>
            Match
          </h2>
          <div className="flex justify-around gap-5 mr-4 items-center">
            <img
              src={`/Game_images/lives${tries}.png`}
              alt="lives-img"
              className={`w-40 max-h-32 h-16 ${
                tries === 1 ? 'animate-pulse z-0' : ''
              }`}
            />
            <h2 className="text-3xl mr-3">
              Score
              <span className="font-sans text-4xl font-bold"> : </span>
              {score}
            </h2>
          </div>
        </div>

        <div className="content ">
          <p
            className={`word text-5xl font-medium text-center uppercase tracking-[24px] -mr-6 p-10 
              ${category === 'blockchain' ? 'text-blue-900' : ''} 
              ${
                category === 'nft' && !isIncorrect && !isCorrect && !isTimesUp
                  ? 'text-purple-900'
                  : ''
              } 
              ${
                category === 'cryptocurrency' &&
                !isIncorrect &&
                !isCorrect &&
                !isTimesUp
                  ? 'text-yellow-900'
                  : ''
              }  
            `}
          >
            {isTimesUp ? correctWord : randomWord}
          </p>
          <div className="details">
            <p className="my-8 text-5xl">
              <span className="text-2xl my-5">
                GUESS THE WORD
                <span className="font-sans text-3xl font-bold"> : </span>
                <span className="text-2xl font-sans font-bold"> {hint}</span>
              </span>
            </p>

            {tries > 0 ? (
              <div
                style={{
                  backgroundColor: '#ddd',
                  height: 60,
                  width: 910,
                  borderRadius: 10,
                  marginBottom: 20,
                  marginTop: 20,
                }}
              >
                <div
                  className={`
                    ${time >= 0 && time < 5 ? 'bg-red-600' : ''} 
                    ${time >= 5 && time < 10 ? 'bg-yellow-600' : ''} 
                    ${time >= 10 && time < 15 ? 'bg-green-600' : ''}  
                `}
                  style={{
                    width: `${progress * 100}%`,
                    height: '100%',
                    borderRadius: 10,
                  }}
                />
              </div>
            ) : (
              ''
            )}
          </div>
          <input
            type="text"
            placeholder="Enter a valid word"
            className="w-[100%] height-[60px] outline-none py-4 px-4 rounded-md border-2 border-solid border-gray-600 text-xl"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            maxLength={correctWord.length}
            disabled={time <= 0 ? true : false}
          />
          <div className="buttons flex justify-between mt-5 mb-5">
            <button
              className="refresh-word bg-gray-600 text-2xl font-bold mb-6 hover:bg-gray-900 hover:text-white "
              onClick={() => {
                let wordString = shuffleWord(randomWord)
                // console.log('These is the value of wordString', wordString)
                setRandomWord(wordString)
              }}
              disabled={time <= 0 ? true : false}
            >
              Scramble
            </button>
            <button
              className="check-word bg-blue-600 text-2xl mb-6 font-bold hover:bg-blue-900 hover:text-white"
              onClick={checkWord}
              disabled={time <= 0 ? true : false}
            >
              Check Word
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
