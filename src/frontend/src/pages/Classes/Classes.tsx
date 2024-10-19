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
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";
import DialogEditDeck from "./_components/DialogEditDeck";
import DialogDeleteDeck from "./_components/DialogDeleteDeck";
import { TClass } from "@/types/types";
import { useAuth } from "@/context/AuthContext";
import DialogCreate from "./_components/DialogCreate";
import useStore from '@/store/useStore';



export default function Classes() {
  // const [classes, setClasses] = useState<TClass[]>([]); // Use sample data initially
  const [isGridLayout, setIsGridLayout] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const { classes, setClasses } = useStore();


  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const user = localStorage.getItem("user");
        if (!user) {
          throw new Error("User not found.");
        }
        const user_id = JSON.parse(user).user_id;
        const url = `${import.meta.env.VITE_CANISTER_URL}/app/${user_id}/classes`;
        // console.log("Fetching classes from:", url);
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
        // console.log("Fetched Data:", data);
        setClasses(data.payload);

      } catch (error) {
        console.error("Failed to fetch classes:", error);
        setError("Failed to fetch classes. Please try again later.");
      }
    };

    fetchClasses();
  }, [user?.user_id, setClasses]);

  const handleDelete = async (id: number) => {
    const url = `${import.meta.env.VITE_CANISTER_URL}/app/delete_class/${id}`;
    console.log("Deleting class:", url);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
  
      console.log("Deleted Data:", data);
      setClasses([...classes.filter((c) => c.class_id !== id)]);
    } catch (error) {
      console.error("Error deleting class:", error);
    }
  };

  const handleLike = (id: number) => {
    // setClasses((prevClasses) =>
    //   prevClasses.map((c) => {
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


  const formatDate = (dateString: Date) => {
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
        <h1 className="text-2xl font-bold py-6 px-4">Your Classes </h1>
        <div className="flex gap-2">
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
          <DialogCreate />
        </div>
      </div>
      {error && <div className="text-destrcutive">{error}</div>}
      <div
        className={`grid gap-4 ${isGridLayout ? "md:grid-cols-2" : "grid-cols-1"}`}
      >
        {classes.length === 0 ? (
          <div>No classes available.</div>
        ) : (
          classes.map((classItem: TClass) => (
            <Card
              key={classItem.class_id}
              className="overflow-hidden border-b border-border hover:bg-accent transition-colors"
            >
              <CardHeader className="flex flex-row items-start gap-4 p-4">
                <Avatar className="w-10 h-10">
                  <AvatarFallback>{classItem.class_icon}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">{classItem.class_name}</h2>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {/* <DialogEditDeck
                          name={classItem.class_name}
                          description={classItem.class_description}
                        >
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        </DialogEditDeck> */}
                        <DialogDeleteDeck
                          handleDelete={() => handleDelete(classItem.class_id)}
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
                    {formatDate(classItem.class_createdAt)}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm mb-2">{classItem.class_description}</p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <BookOpen className="mr-1 h-4 w-4" />
                  {classItem.class_deckCount}{" "}
                  {classItem.class_deckCount === 1 ? "deck" : "decks"}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between items-center">
                {/* <Button
                  variant="ghost"
                  size="sm"
                  className={`p-0 h-auto font-normal ${classItem.isLiked ? "text-destructive" : ""}`}
                  onClick={() => handleLike(classItem.id)}
                >
                  <Heart
                    className={`mr-1 h-4 w-4 ${classItem.isLiked ? "fill-current" : ""}`}
                  />
                  {classItem.likes}
                </Button> */}
                <Button variant="ghost" size="sm" className="ml-auto">
                  <Link
                    to={`/classes/${classItem.class_id}/decks`}
                    className="flex items-center"
                  >
                    See Decks
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        )}

      </div>
    </div>
  );
}
