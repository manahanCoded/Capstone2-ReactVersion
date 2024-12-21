import React from 'react';
import { Card, CardContent } from '@/components/ui/card'; // Assuming you have Card components
import { useNavigate } from 'react-router-dom'; // useNavigate is used for navigation in React Router

export default function Games() {
  const navigate = useNavigate(); // Use navigate from react-router-dom

  const games = [
    {
      title: 'Guessing Game',
      description: 'Guess the number or item!',
      img: "/Game_images/frontPage/guess.png",
      path: '/games/guessing-game',
    },
    {
      title: 'Hangman',
      description: 'Can you guess the word before time runs out?',
      img: "/Game_images/frontPage/hangman.png",
      path: '/games/hangman',
    },
    {
      title: 'Scramble',
      description: 'Unjumble the letters to form a word.',
      img: "/Game_images/frontPage/scramble.png",
      path: '/games/scramble',
    },
    {
      title: 'Typing Game',
      description: 'Type as fast as you can!',
      img: "/Game_images/frontPage/typing.png",
      path: '/games/typing-game',
    },
  ];

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
