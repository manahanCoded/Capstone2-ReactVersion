import { useEffect, useRef, useState } from 'react'
import './typing-game.css'
import {
  blockchainParagraphs,
  cryptocurrencyParagraphs,
  nftParagraphs,
} from './paragraphs'

export default function TypingGame() {
  const maxTime = 60
  const [timeLeft, setTimeLeft] = useState(maxTime)
  const [mistakes, setMistakes] = useState(0)
  const [pIndex, setPIndex] = useState(0)
  const [category, setCategory] = useState('blockchain')
  const [paragraph, setParagraph] = useState(blockchainParagraphs)
  const [charIndex, setCharIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [WPM, setWPM] = useState(0)
  const [CPM, setCPM] = useState(0)
  const [isPickingCategory, setIsPickingCategory] = useState(true)
  const inputRef = useRef()
  const charRefs = useRef([])
  const [correctWrong, setCorrectWrong] = useState([])

  useEffect(() => {
    inputRef.current.focus()
    setCorrectWrong(Array(charRefs.current.length).fill(''))
  }, [])

  useEffect(() => {
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

  useEffect(() => {
    let interval
    if (isTyping && timeLeft > 0 && charIndex !== paragraphLength) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1)
        let correctChars = charIndex - mistakes
        let totalTime = maxTime - timeLeft

        let cpm = correctChars * (60 / totalTime)
        cpm = cpm < 0 || !cpm || cpm === Infinity ? 0 : cpm
        setCPM(parseInt(cpm, 10))

        let wpm = Math.round((correctChars / 5 / totalTime) * 60)
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm
        setWPM(wpm)
      }, 1000)
    } else if (timeLeft === 0) {
      clearInterval(interval)
      setIsTyping(false)
    }
    return () => {
      clearInterval(interval)
    }
  }, [isTyping, timeLeft])

  useEffect(() => {
    let currentCategory

    if (category === 'blockchain') setParagraph(blockchainParagraphs)
    if (category === 'cryptocurrency') setParagraph(cryptocurrencyParagraphs)
    if (category === 'nft') setParagraph(nftParagraphs)

    console.log('This is the current category', currentCategory)

    resetGame()
  }, [category])

  const resetGame = () => {
    setIsTyping(false)
    setTimeLeft(maxTime)
    setCharIndex(0)
    setMistakes(0)
    setCPM(0)
    setWPM(0)
    setCorrectWrong(Array(charRefs.current.length).fill(''))
    inputRef.current.focus()
    setPIndex(Math.floor(Math.random() * blockchainParagraphs.length))
  }

  const handleChange = (e) => {
    const characters = charRefs.current
    let currentChar = charRefs.current[charIndex]
    let typedChar = e.target.value.slice(-1)
    console.log(typedChar)
    if (charIndex < characters.length && timeLeft > 0) {
      if (!isTyping) {
        setIsTyping(true)
      }

      if (typedChar === currentChar.textContent) {
        setCharIndex(charIndex + 1)
        correctWrong[charIndex] = ' correct '
      } else {
        setCharIndex(charIndex + 1)
        setMistakes(mistakes + 1)
        correctWrong[charIndex] = ' wrong '
      }
      if (charIndex === characters.length - 1) {
        setIsTyping(false)
      }
    } else {
      setIsTyping(false)
    }
  }

  const paragraphLength = paragraph[pIndex].split('').length
  if (charIndex === paragraphLength) {
    // alert(
    //   `Congrats, in ${timeLeft} seconds you have a record of WPM: ${WPM} CPM: ${CPM}`
    // )
    // resetGame()
  }

  console.log('This is the length of the paragraph', paragraphLength)
  console.log('P index: ', pIndex)
  return (
    <div
      className={`
      ${
        category === 'blockchain' && charIndex !== paragraphLength
          ? 'bg-blue-900'
          : ''
      } 
      ${
        category === 'nft' && charIndex !== paragraphLength
          ? 'bg-purple-900'
          : ''
      } 
      ${
        category === 'cryptocurrency' && charIndex !== paragraphLength
          ? 'bg-yellow-900'
          : ''
      }  
      ${timeLeft === 0 ? 'bg-red-900' : ''}  
      ${charIndex === paragraphLength ? 'bg-green-900' : ''}  
      flex items-center justify-center min-h-screen h-screen w-screen font-pxltd`}
    >
      {isPickingCategory ? (
        <div className="picking-bg fixed  bg-black left-0 top-40 w-[100%] h-[110%]  flex items-center justify-center -mt-40 z-10 pointer-events-auto">
          <div className="game-modal content bg-[url('/Game_images/typing-game.png')]  max-w-[1000px] w-full max-h-[570px] h-full text-center rounded-lg p-8 mb-24 flex flex-col justify-center items-center">
            <h4 className="text-5xl font-bold text-white">Choose category: </h4>
            <div className="title-buttons flex flex-col justify-around items-center">
              <div className="flex flex-col justify-between items-center gap-4 h-[250px] mt-10">
                <button
                  className="category-btn bg-blue-900 text-white w-[180%] text-4xl h-16 hover:bg-blue-300 hover:text-blue-900"
                  onClick={() => {
                    setCategory('blockchain')
                    setIsPickingCategory(false)
                    if (category === 'blockchain') {
                      resetGame()
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
                    if (category === 'nft') {
                      resetGame()
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
                    if (category === 'cryptocurrency') {
                      resetGame()
                    }
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

      {timeLeft === 0 || charIndex === paragraphLength ? (
        <div
          className={`fixed left-50 top-0  flex flex-col  justify-center mt-20 z-30 pointer-events-auto p-1 font-pxltd`}
        >
          <div
            className={`content ${
              timeLeft === 0 ? 'bg-red-600 animate-shake' : ''
            } ${
              charIndex === paragraphLength
                ? 'bg-green-600 motion-preset-confetti'
                : ''
            } max-w-[400px] w-full max-h-[120px] h-full text-center rounded-lg p-8 mb-24 flex  justify-center items-center gap-10 z-10`}
          >
            <h4
              className={`text-4xl font-bold text-white ${
                timeLeft === 0 ? 'animate-shake' : 'motion-preset-confetti'
              }`}
            >
              {charIndex === paragraphLength ? 'Congrats' : ''}
              {timeLeft === 0 ? 'Times Up' : ''}
            </h4>
          </div>
        </div>
      ) : (
        ''
      )}

      <div className="container max-w-[950px] w-full m-1 p-8 rounded-xl background-white">
        <div className="test font-sans">
          <input
            type="text"
            className="opacity-0 -z-50 absolute"
            ref={inputRef}
            onChange={handleChange}
            disabled={charIndex === paragraphLength ? true : false}
          />
          {paragraph[pIndex].split('').map((char, index) => (
            <span
              className={`char ${index === charIndex ? ' active' : ''} ${
                correctWrong[index]
              } text-2xl `}
              ref={(e) => (charRefs.current[index] = e)}
              key={index}
            >
              {char}
            </span>
          ))}
        </div>
        <div className="result">
          <p>
            Time Left
            <span className="font-sans text-2xl font-bold"> : </span>
            <strong>{timeLeft}</strong>
          </p>
          <p>
            Mistakes
            <span className="font-sans text-2xl font-bold"> : </span>{' '}
            <strong>{mistakes}</strong>
          </p>
          <p>
            WPM
            <span className="font-sans text-2xl font-bold"> : </span>{' '}
            <strong>{WPM}</strong>
          </p>
          <p>
            CPM
            <span className="font-sans text-2xl font-bold"> : </span>{' '}
            <strong>{CPM}</strong>
          </p>
          <button
            className="btn w-[140px] h-12 text-xl text-white"
            onClick={() => {
              setIsPickingCategory(true)
              resetGame()
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  )
}
