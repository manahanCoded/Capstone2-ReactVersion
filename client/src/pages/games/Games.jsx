import React from 'react';
import { Card, CardContent } from '@/components/ui/card'; // Assuming you have Card components
import { useNavigate } from 'react-router-dom'; // useNavigate is used for navigation in React Router

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
  const navigate = useNavigate(); // Use navigate from react-router-dom


  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <h1 className="text-3xl font-semibold mb-6">Challenge Yourself</h1>
      <div className="max-w-screen-2xl h-auto">
        <div className="flex flex-wrap justify-center gap-8">
          {games.map((game, index) => (
            <div key={index} className="p-4 w-full sm:w-1/2 lg:w-1/3">
              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onClick={() => navigate(game.path)} // Use navigate to redirect
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <h2 className="text-2xl font-semibold mb-4">{game.title}</h2>
                  <img src={game.img} alt={game.title} className="mb-4 border-y-[1px] w-full h-48 object-cover" />
                  <p className="text-center text-lg">{game.description}</p>
                  <p className="mt-4 text-sm">Click to Start</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
