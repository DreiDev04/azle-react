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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

interface ClassItem {
  id: number;
  name: string;
  icon?: string;
  deckCount: number;
  description: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
}

const sampleClasses: ClassItem[] = [
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
];

export default function Classes() {
  const [classes, setClasses] = useState<ClassItem[]>(sampleClasses); // Use sample data initially
  const [isGridLayout, setIsGridLayout] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const userId = "1"; // Replace with actual user ID
        const url = `${import.meta.env.VITE_CANISTER_URL}/app/${userId}/classes`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        console.log("Fetched Data:", data); // Debug: Log fetched data
        if (data && data.payload) {
          const mappedClasses = data.payload.map((item: any) => ({
            id: item.class_id,
            name: item.class_name,
            description: item.class_description,
            createdAt: item.class_createdAt,
            deckCount: item.deck_count, // Set default or fetch this if available
            likes: 0, // Set default or fetch this if available
            isLiked: false, // Set default or fetch this if available
          }));
          setClasses(mappedClasses);
        } else {
          throw new Error("Data format unexpected");
        }
      } catch (error) {
        console.error("Failed to fetch classes:", error);
        setError("Failed to fetch classes. Please try again later.");
        setClasses(sampleClasses); // Fall back to sample data
      }
    };

    fetchClasses();
  }, []);

  const handleDelete = (id: number) => {
    setClasses((prevClasses) => prevClasses.filter((c) => c.id !== id));
  };

  const handleLike = (id: number) => {
    setClasses((prevClasses) =>
      prevClasses.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            likes: c.isLiked ? c.likes - 1 : c.likes + 1,
            isLiked: !c.isLiked,
          };
        }
        return c;
      })
    );
  };

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
          onClick={() => setIsGridLayout((prev) => !prev)}
        >
          {isGridLayout ? (
            <LayoutList className="h-4 w-4" />
          ) : (
            <LayoutGrid className="h-4 w-4" />
          )}
        </Button>
      </div>
      {error && <div className="text-red-500">{error}</div>}
      <div
        className={`grid gap-4 ${isGridLayout ? "md:grid-cols-2" : "grid-cols-1"}`}
      >
        {classes.length === 0 ? (
          <div>No classes available.</div>
        ) : (
          classes.map((classItem: ClassItem) => (
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
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DialogEditDeck
                          name={classItem.name}
                          description={classItem.description}
                        >
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        </DialogEditDeck>
                        <DialogDeleteDeck
                          handleDelete={() => handleDelete(classItem.id)}
                        >
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                          >
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
                <Button variant="ghost" size="sm" className="ml-auto">
                  <Link to="/deck">See Decks</Link>
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
