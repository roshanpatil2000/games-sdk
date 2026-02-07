"use client";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'



export default function GamesPage() {
  const router = useRouter()

  // const navigate = 
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGames = async () => {
    try {
      const response = await axios.get("/api/games");
      setGames(response.data?.items || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleClick = (gameName: string) => {
    // const url = `https://play.gamepix.com/${gameName}/embed?sid=0E766`;
    // const url = `https://api.gamepix.com/v3/games/ns/${gameName}?sid=0E766`;
    router.push(`/detail/${gameName}`);

  }


  const getOne = games[0];
  console.log("getOne:", getOne);


  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <div className="flex justify-between items-center px-10 py-2 border-b-2">
        <h1>Games</h1>
        <ThemeToggle />
      </div>
      <div className="grid grid-cols-4 md:grid-cols-2 lg:grid-cols-6 gap-4 m-4">

        {games?.map((game: any) => {
          return (
            <div key={game.id} className="relative group cursor-pointer">
              <img
                src={game?.banner_image}
                alt="Event cover"
                className="rounded-lg mb-2 opacity-50 hover:opacity-90 transition-opacity duration-300"
              />

              <div onClick={() => handleClick(game.id)} className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black bg-opacity-75 rounded-lg transition-opacity duration-300 flex flex-col justify-center items-center p-4">
                <p className="text-white text-center font-semibold">{game.title}</p>
                <p className="text-gray-300 text-center text-sm">{game.category}</p>
              </div>
            </div>
          )
        })}



        {/* {getOne &&
          (
            <div key={getOne.id} className="relative group cursor-pointer">
              <img
                src={getOne?.banner_image}
                alt="Event cover"
                className="rounded-lg mb-2 opacity-50 hover:opacity-90 transition-opacity duration-300"
              />

              <div onClick={() => handleClick(getOne.namespace)} className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black bg-opacity-75 rounded-lg transition-opacity duration-300 flex flex-col justify-center items-center p-4">
                <p className="text-white text-center font-semibold">{getOne.title}</p>
                <p className="text-gray-300 text-center text-sm">{getOne.category}</p>
              </div>
            </div>
          )
        } */}

      </div>
    </div >
  );
}