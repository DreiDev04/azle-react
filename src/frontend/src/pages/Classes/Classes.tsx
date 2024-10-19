import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BookOpen,
  MoreHorizontal,
  Heart,
  Pencil,
  Trash2,
  LayoutGrid,
  LayoutList,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import DialogEditDeck from "./_components/DialogEditDeck";
import DialogDeleteDeck from "./_components/DialogDeleteDeck";

interface Classes {
  id: number;
  name: string;
  icon?: string;
  deckCount: number;
  description: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
}

const sampleClasses: Classes[] = [
  {
    id: 1,
    name: "Mathematics",
    icon: "M",
    deckCount: 5,
    description: "Algebra, Geometry, and Calculus flashcards",
    createdAt: "2023-05-15T10:30:00Z",
    likes: 15,
    isLiked: false,
  },
  {
    id: 2,
    name: "History",
    icon: "H",
    deckCount: 3,
    description: "World History and American History flashcards",
    createdAt: "2023-06-01T14:45:00Z",
    likes: 8,
    isLiked: true,
  },

  // Add more sample classes as needed
];

export default function Classes() {
  const [classes, setClasses] = useState<Classes[]>([]);
  const [isGridLayout, setIsGridLayout] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        // TODO: Replace '1' with the actual user ID
        const userId = '1';
        const urlWithParams = `${import.meta.env.VITE_CANISTER_URL}/app/${userId}/classes`;
        const response = await fetch(urlWithParams, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setClasses(data.payload);
        console.log('Data:', data);
      } catch (error) {
        console.error('Failed to fetch classes:', error);
      }
    };
    fetchClasses();
    console.log('Classes:', classes);
  }, []);

  const handleDelete = (id: number) => {
    setClasses(classes.filter((c) => c.id !== id));
  };

  const handleLike = (id: number) => {
    // TODO: Implement like class with backend
    // setClasses(
    //   classes.map((c) => {
    //     if (c.id === id) {
    //       return {
    //         ...c,
    //         likes: c.isLiked ? c.likes - 1 : c.likes + 1,
    //         isLiked: !c.isLiked,
    //       };
    //     }
    //     return c;
    //   })
    // );
  };

  // TODO: should be moved to a utility file
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="container-page">
      <div className="flex items-center sticky top-0 bg-background z-10 py-2">
        <h1 className="text-2xl font-bold py-6 px-4">Your Classes</h1>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsGridLayout(!isGridLayout)}
        >
          {isGridLayout ? (
            <LayoutList className="h-4 w-4" />
          ) : (
            <LayoutGrid className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div
        className={`grid gap-4 ${isGridLayout ? "md:grid-cols-2" : "grid-cols-1"}`}
      >
        {classes.map((classItem) => (
          <Card
            key={classItem.id}
            className="overflow-hidden border-b border-border hover:bg-accent transition-colors"
          >
            <CardHeader className="flex flex-row items-start gap-4 p-4">
              <Avatar className="w-10 h-10">
                <AvatarFallback>{classItem.icon}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">{classItem.name}</h2>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DialogEditDeck
                        name={classItem.name}
                        description={classItem.description}
                      >
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                      </DialogEditDeck>
                      <DialogDeleteDeck
                        handleDelete={() => handleDelete(classItem.id)}
                      >
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DialogDeleteDeck>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatDate(classItem.createdAt)}
                </p>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-sm mb-2">{classItem.description}</p>
              <div className="flex items-center text-sm text-muted-foreground">
                <BookOpen className="mr-1 h-4 w-4" />
                {classItem.deckCount}{" "}
                {classItem.deckCount === 1 ? "deck" : "decks"}
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between items-center">
              <Button
                variant="ghost"
                size="sm"
                  className={`p-0 h-auto font-normal ${classItem.isLiked ? "text-destructive" : ""}`}
                  onClick={() => handleLike(classItem.id)}
                >
                  <Heart
                    className={`mr-1 h-4 w-4 ${classItem.isLiked ? "fill-current" : ""}`}
                  />
                  {classItem.likes}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto"
                >
                  <Link to="/deck">See Decks</Link>
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))
        }
      </div>
    </div>
  );
}