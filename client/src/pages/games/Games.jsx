import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import Footer from '@/components/Footer'

export const games = [
  {
    title: 'Guessing Quest',
    description:
      'Test your intuition by guessing items. A fun and interactive game inspired by blockchain randomization!',
    img: '/Game_images/frontPage/guess3.png',
    img_2: '/Game_images/frontPage/guess2.png',
    path: '/games/guessing-game',
  },
  {
    title: "Don't Fall",
    description:
      'Dive into the world of Web3 and try to guess the correct word before time runs out. Each word relates to blockchain technology and crypto concepts!',
    img: '/Game_images/frontPage/hangman3.png',
    img_2: '/Game_images/frontPage/hangman2.png',
    path: '/games/hangman',
  },
  {
    title: "Web3 Mix n' Match",
    description:
      'Unjumble the letters to form words related to cryptocurrency, NFTs, and the blockchain ecosystem. A perfect way to learn Web3 lingo!',
    img: '/Game_images/frontPage/scramble3.png',
    img_2: '/Game_images/frontPage/scramble2.png',
    path: '/games/scramble',
  },
  {
    title: 'BNC TypeMania',
    description:
      'Test your typing speed while mastering key blockchain and crypto terminologies. Can you keep up with the fast-paced world of Web3?',
    img: '/Game_images/frontPage/typing-game3.png',
    img_2: '/Game_images/frontPage/typing2.png',
    path: '/games/typing-game',
  },
]

export default function Games() {
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }


  const filteredGames = games.filter((game) =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    game.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='h-screen'>
      <div className=' flex flex-col items-center'>
        <MaxWidthWrapper className="flex flex-col items-center justify-center mt-20 lg:mx-20">
          <h1 className="text-3xl font-semibold mb-4">Challenge Yourself</h1>
          <section className="lg:h-20 h-fit w-full py-2 flex lg:flex-row flex-col justify-between items-center gap-6 text-xs border-b-[1px] bg-white">
            <p className="text-xl font-medium mb-4">🌟 Games 🌟</p>
            <div className="lg:w-1/3 w-full flex flex-row items-center border-[1px] rounded-lg overflow-hidden bg-slate-100">
              <input
                placeholder="Search Game"
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                className="h-9 w-full py-2 pl-4 outline-none bg-slate-100"
              />
              <SearchOutlinedIcon className="mr-2" />
            </div>
          </section>
          <MaxWidthWrapper className="h-fit max-w-screen-2xl  m-auto py-8">
            <div className=" w-full flex flex-wrap  gap-6">
              {filteredGames.map((game, index) => (
                <div
                  key={index}
                  className="w-full sm:w-[48%] lg:w-[30%] rounded-lg overflow-hidden shadow-lg border hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
                  onClick={() => navigate(game.path)}
                >
                  <div className="relative h-48 w-full">
                    <img
                      src={game.img}
                      alt={game.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-opacity-30 hover:bg-opacity-10 transition-all duration-300"></div>
                  </div>
                  <div className="p-6 bg-[#230000] bg-opacity-90 hover:bg-opacity-100 transition-all">
                    <h2 className="text-2xl font-semibold text-white mb-3 hover:text-yellow-400 transition-colors">
                      {game.title}
                    </h2>
                    <p className="text-sm text-gray-300 line-clamp-3">
                      {game.description}
                    </p>
                    <p className="mt-4 text-sm text-yellow-400 font-medium hover:underline">
                      Click to Start
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </MaxWidthWrapper>
        </MaxWidthWrapper>
      </div>
      <Footer />
    </div>
  )
}
