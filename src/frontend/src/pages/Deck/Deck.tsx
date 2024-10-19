import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import DeckCard from './_components/DeckCards'; // Import the DeckCard component
import { TDeck } from '@/types/types';



export default function FlashcardDecks() {
  const [searchTerm, setSearchTerm] = useState('');
  const [decks, setDecks] = useState<TDeck[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { id } = useParams();
  const location = useLocation();
  const { class_name } = location.state || {};

  useEffect(() => {
    console.log('Location State:', location.state); // Debug: Log location state
    console.log('Class Name:', class_name); // Debug: Log class_name
    const fetchDecks = async () => {
      try {
        const url = `${import.meta.env.VITE_CANISTER_URL}/app/class_decks/${id}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          console.log('Network response was not ok');
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched Decks:', data); // Debug: Log fetched data
        setDecks(data.payload);
      } catch (error) {
        console.error('Failed to fetch decks:', error);
        setError('Failed to fetch decks. Please try again later.');
      }
    };
    fetchDecks();
  }, [id, location.state]);

  const filteredDecks = decks.filter((deck) =>
    deck.deck_name && deck.deck_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-page">
      <h1 className="text-2xl font-bold py-6 px-4">{class_name || 'Class Name'}</h1>

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
        <p className="text-center text-gray-500 mt-6">No decks found. Try a different search term.</p>
      ) : (
        <div className="grid grid-cols-1 mt-6 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDecks.map((deck) => (
            <DeckCard
              key={deck.deck_id}
              deck_id={deck.deck_id}
              deck_name={deck.deck_name}
              deck_cardCount={deck.deck_cardCount}
              deck_description={deck.deck_description}
            />
          ))}
        </div>
      )}
    </div>
  );
}
