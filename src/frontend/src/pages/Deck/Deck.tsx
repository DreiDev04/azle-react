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
import { useParams } from "react-router-dom";
import { TDeck } from "@/types/types";

const sampleDecks: TDeck[] = [
  {
    id: 1,
    name: "JavaScript Basics",
    description: "Fundamental concepts of JavaScript",
    createdAt: "test",
    cardCount: 30,
    userOwner: {
      id: 1,
      username: "test",
      email: "test@test.com",
      password: "test",
      salt: "test",
      createdAt: "test"
    }
  },
  {
    id: 2,
    name: "React Hooks",
    description: "Understanding and using React Hooks",
    createdAt: "test",
    cardCount: 30,
    userOwner: {
      id: 1,
      username: "test",
      email: "test@test.com",
      password: "test",
      salt: "test",
      createdAt: "test"
    }
  },
  {
    id: 3,
    name: "CSS Flexbox",
    cardCount: 20,
    description: "Mastering CSS Flexbox layout",
    createdAt: "test",
    userOwner: {
      id: 1,
      username: "test",
      email: "test@test.com",
      password: "test",
      salt: "test",
      createdAt: "test"
    }
  },
  {
    id: 4,
    name: "Python Data Structures",
    cardCount: 35,
    description: "Common data structures in Python",
    createdAt: "test",
    userOwner: {
      id: 1,
      username: "test",
      email: "test@test.com",
      password: "test",
      salt: "test",
      createdAt: "test"
    }
  },
  {
    id: 5,
    name: "SQL Queries",
    cardCount: 40,
    description: "Essential SQL queries for database management",
    createdAt: "test",
    userOwner: {
      id: 1,
      username: "test",
      email: "test@test.com",
      password: "test",
      salt: "test",
      createdAt: "test"
    }
  },
  {
    id: 6,
    name: "Git Commands",
    cardCount: 15,
    description: "Frequently used Git commands",
    createdAt: "test",
    userOwner: {
      id: 1,
      username: "test",
      email: "test@test.com",
      password: "test",
      salt: "test",
      createdAt: "test"
    }
  },
];

export default function FlashcardDecks() {
  const [searchTerm, setSearchTerm] = useState("");
  const [decks, setDecks] = useState<TDeck[]>(sampleDecks);
  const [error, setError] = useState<string | null>(null);

  const { id } = useParams();

  useEffect(() => {
      const fetchDecks = async () => {
        try {
          console.log(id);
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
          if (data && data.payload) {
            const mappedDecks = data.payload.map((item: any) => ({
              id: item.deck_id,
              name: item.deck_name,
              description: item.deck_description,
              createdAt: item.deck_createdAt,
              cardCount: item.deck_cardCount,
              userOwner: {
                id: item.deck_userOwner.user_id,
                username: item.deck_userOwner.user_username,
                email: item.deck_userOwner.user_email,
                password: item.deck_userOwner.user_password,
                salt: item.deck_userOwner.user_salt,
                createdAt: item.deck_userOwner.user_createdAt
              }
            }));
            setDecks(mappedDecks);
          } else {
            throw new Error("Data format unexpected");
          }
        } catch (error) {
          console.error("Failed to fetch decks:", error);
          setError("Failed to fetch decks. Please try again later.");
          setDecks(sampleDecks); // Fall back to sample data
        }
      };
      fetchDecks();
  }, []);

  const filteredDecks = decks.filter((deck) =>
    deck.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-page">
      <h1 className="text-2xl font-bold py-6 px-4">Programming 101</h1>

      <div className="relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search decks..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredDecks.length === 0 ? (
        <p className="text-center text-gray-500 mt-6">
          No decks found. Try a different search term.
        </p>
      ) : (
        <div className="grid grid-cols-1 mt-6 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDecks.map((deck) => (
            <Card key={deck.id} className="flex flex-col">
              <CardHeader className="flex">
                <CardTitle>{deck.name}</CardTitle>
                <Badge className="px-2 py-1" variant="secondary">
                  {deck.cardCount} cards
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">{deck.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between mt-auto">
                <Link to={`edit`}>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                <Link to="/flashcards">
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
