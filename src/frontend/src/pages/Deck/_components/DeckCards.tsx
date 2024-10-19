import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, BookOpen } from 'lucide-react';

interface DeckCardProps {
  deck_id: number;
  deck_name: string;
  deck_cardCount: number;
  deck_description: string | null;
}

const DeckCard: React.FC<DeckCardProps> = ({ deck_id, deck_name, deck_cardCount, deck_description }) => {
  return (
    <Card key={deck_id} className="flex flex-col">
      <CardHeader className="flex">
        <CardTitle>{deck_name}</CardTitle>
        <Badge className="px-2 py-1" variant="secondary">
          {deck_cardCount} cards
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">{deck_description}</p>
      </CardContent>
      <CardFooter className="flex justify-between mt-auto">
        <Link to={`edit`}>
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </Link>
        <Link to={`flashcard/${deck_id}`}>
          <Button className="font-bold" size="sm">
            <BookOpen className="w-4 h-4 mr-2" />
            Study
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default DeckCard;