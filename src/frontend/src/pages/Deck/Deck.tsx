import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import { useParams, useLocation } from "react-router-dom";
import { TDeck } from "@/types/types";
import DialogAddDeck from "./_components/DialogAddDeck";
import useStore from "@/store/useStore";


export default function FlashcardDecks() {
  const [searchTerm, setSearchTerm] = useState("");
  // const [decks, setDecks] = useState<TDeck[]>([]);
  const { decks, setDecks } = useStore();
  const [error, setError] = useState<string | null>(null);

  const { id } = useParams();
  const location = useLocation();
  const { class_name } = location.state || {};

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const url = `${import.meta.env.VITE_CANISTER_URL}/app/class_decks/${id}`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          console.log("Network response was not ok");
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("Fetched Decks:", data); // Debug: Log fetched data
        setDecks(data.payload);

      } catch (error) {
        console.error("Failed to fetch decks:", error);
        setError("Failed to fetch decks. Please try again later.");
      }
    };
    fetchDecks();
  }, []);

  const filteredDecks = decks.filter((deck) =>
    deck.deck_name && deck.deck_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-page">
      <h1 className="text-2xl font-bold py-6 px-4">{class_name}</h1>
      <div className="relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <div className="flex gap-5">

          <Input
            type="text"
            placeholder="Search decks..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <DialogAddDeck />
        </div>
      </div>

      {filteredDecks.length === 0 ? (
        <p className="text-center text-gray-500 mt-6">
          No decks found. Try a different search term.
        </p>
      ) : (
        <div className="grid grid-cols-1 mt-6 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDecks.map((deck) => (
            <Card key={deck.deck_id} className="flex flex-col">
              <CardHeader className="flex">
                <CardTitle>{deck.deck_name}</CardTitle>
                <Badge className="px-2 py-1" variant="secondary">
                  {deck.deck_cardCount} cards
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">{deck.deck_description}</p>
              </CardContent>
              <CardFooter className="flex justify-between mt-auto">
                <Link to={`edit`}>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                <Link to={`flashcard/2`}>
                  <Button className="font-bold" size="sm">
                    <BookOpen className=" w-4 h-4 mr-2" />
                    Study
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
