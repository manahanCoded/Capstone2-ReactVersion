import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import Footer from '@/components/Footer';

export const games = [
  {
    title: 'Guessing Quest',
    description: 'Test your intuition by guessing items. A fun and interactive game inspired by blockchain randomization!',
    img: "/Game_images/frontPage/guess.png",
    img_2: "/Game_images/frontPage/guess2.png",
    path: '/games/guessing-game'
  },
  {
    title: 'Hashman',
    description: 'Dive into the world of Web3 and try to guess the correct word before time runs out. Each word relates to blockchain technology and crypto concepts!',
    img: "/Game_images/frontPage/hangman.png",
    img_2: "/Game_images/frontPage/hangman2.png",
    path: '/games/hangman'
  },
  {
    title: 'Blockchain Unscramble',
    description: 'Unjumble the letters to form words related to cryptocurrency, NFTs, and the blockchain ecosystem. A perfect way to learn Web3 lingo!',
    img: "/Game_images/frontPage/scramble.png",
    img_2: "/Game_images/frontPage/scramble2.png",
    path: '/games/scramble'
  },
  {
    title: 'Hash Sprint',
    description: 'Test your typing speed while mastering key blockchain and crypto terminologies. Can you keep up with the fast-paced world of Web3?',
    img: "/Game_images/frontPage/typing.png",
    img_2: "/Game_images/frontPage/typing2.png",
    path: '/games/typing-game'
  }
];


export default function Games() {
  const navigate = useNavigate();


  return (
    <div>
    <MaxWidthWrapper className="flex flex-col items-center justify-center mt-20 lg:mx-20">
      <h1 className="text-3xl font-semibold mb-4">Challenge Yourself</h1>
      <section className="lg:h-20 h-fit w-full py-2 flex lg:flex-row flex-col justify-between items-center  gap-6 text-xs border-b-[1px] bg-white">
        <p className="text-xl font-medium mb-4">🌟 Games 🌟</p>
        <div className="lg:w-1/3 w-full flex flex-row items-center border-[1px] rounded-lg overflow-hidden bg-slate-100">
          <input
            placeholder="Search Module"
            type="text"
            value=""
            className="h-9 w-full py-2 pl-4 outline-none bg-slate-100"
          />
          <SearchOutlinedIcon className="mr-2" />
        </div>
      </section>
      <MaxWidthWrapper className="max-w-screen-2xl h-screen m-auto py-8">
        <div className="w-full flex flex-wrap  mt-4 flex-row gap-8 m-auto">
          {games.map((game, index) => (
            <div
              key={index}
              className="lg:w-[48%] w-full rounded-lg h-64 relative overflow-hidden group bg-gray-800 shadow-lg transition-transform duration-300 hover:scale-105"
            >
              <section
                className="flex flex-row justify-between h-full cursor-pointer transition-shadow duration-200 hover:shadow-2xl"
                onClick={() => navigate(game.path)}
              >
                {/* Image Section */}
                <div className="relative w-[45%] h-full">
                  <img
                    src={game.img}
                    alt={game.title}
                    className="w-full h-full object-cover rounded-l-lg transition-all duration-300 "
                  />
                  {/* Dark Overlay */}

                </div>

                {/* Content Section */}
                <div className="w-[60%] flex flex-col justify-center border-l border-gray-700 p-6 bg-[#230000] bg-opacity-90 group-hover:bg-opacity-100 transition-all">
                  <h2 className="w-fit text-2xl font-semibold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                    {game.title}
                  </h2>
                  <p className="text-sm text-gray-300 line-clamp-3">
                    {game.description}
                  </p>
                  <p className="mt-4 text-sm text-yellow-400 font-medium group-hover:underline">
                    Click to Start
                  </p>
                </div>
              </section>
            </div>
          ))}
        </div>
      </MaxWidthWrapper>
    </MaxWidthWrapper>
      <Footer/>
    </div>
  );
}
