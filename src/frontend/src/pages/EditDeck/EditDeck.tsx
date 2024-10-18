// import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { toast } from "@/hooks/use-toast";
import { PlusCircle, Trash2 } from "lucide-react";

const flashcardSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  hint: z.string().optional(),
});

const formSchema = z.object({
  flashcards: z
    .array(flashcardSchema)
    .min(1, "At least one flashcard is required"),
});

const cards = [
  {
    question: "What is React?",
    answer: "A library for managing user interfaces",
    recalledForCount: 1,
    id: 1,
    hint: "A ______ for managing ______",
    deckId: 1,
    createdAt: "2023-10-01T00:00:00Z",
  },
  {
    question: "Where do you make Ajax requests in React?",
    answer: "The componentDidMount lifecycle event",
    recalledForCount: 0,
    id: 2,
    hint: "The ______ event",
    deckId: 1,
    createdAt: "2023-10-01T00:00:00Z",
  },
  {
    question: "What is JSX?",
    answer: "A syntax extension for JavaScript",
    recalledForCount: 4,
    id: 3,
    hint: "A ______ JavaScript",
    deckId: 1,
    createdAt: "2023-10-01T00:00:00Z",
  },
  {
    question: "What is a component in React?",
    answer: "A reusable piece of UI",
    recalledForCount: 1,
    id: 4,
    hint: "A ______ UI",
    deckId: 1,
    createdAt: "2023-10-01T00:00:00Z",
  },
  {
    question: "What is state in React?",
    answer: "An object that determines how that component renders & behaves",
    recalledForCount: 0,
    id: 5,
    hint: "No hint available",
    deckId: 1,
    createdAt: "2023-10-01T00:00:00Z",
  },
  {
    question: "What are props in React?",
    answer:
      "Inputs to a React component that allow data to be passed from one component to another",
    recalledForCount: 0,
    id: 6,
    hint: "No hint available",
    deckId: 1,
    createdAt: "2023-10-01T00:00:00Z",
  },
];

type FlashcardType = z.infer<typeof flashcardSchema> & { createdAt: string };

function EditDeck() {
  // const { id } = useParams<{ id: string }>();

  const [flashcards, setFlashcards] = useState<FlashcardType[]>(cards);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      flashcards: cards.map(({ question, answer, hint }) => ({
        question,
        answer,
        hint,
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "flashcards",
  });

  function formatDate(date: Date): string {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    const currentDate = formatDate(new Date());
    const newFlashcards = values.flashcards.map((flashcard) => ({
      ...flashcard,
      createdAt: currentDate,
    }));
    setFlashcards(newFlashcards);
    toast({
      title: "Flashcards created",
      description: `${newFlashcards.length} flashcard(s) have been successfully created.`,
    });
    // Here you would typically save the flashcards to your database or state management
    console.log(newFlashcards);
  }

  const [resizableDirection, setDirection] = useState<
    "horizontal" | "vertical"
  >("horizontal");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 950) {
        setDirection("vertical");
      } else {
        setDirection("horizontal");
      }
    };

    handleResize(); // Set initial direction
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <ResizablePanelGroup direction={resizableDirection}>
      <ResizablePanel>
        <Card>
          <CardHeader>
            <CardTitle>Edit [Deck Name]</CardTitle>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {fields.map((field, index) => (
                  <Card
                    key={field.id}
                    className="p-4"
                  >
                    <CardHeader className="p-0 mb-4">
                      <CardTitle className="text-lg">
                        Tokki Card {index + 1}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`flashcards.${index}.question`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Question (Front)</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Enter the question"
                                  {...field}
                                  className="min-h-[100px]"
                                />
                              </FormControl>
                              <FormDescription>
                                This will appear on the front of the flashcard.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`flashcards.${index}.answer`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Answer (Back)</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Enter the answer"
                                  {...field}
                                  className="min-h-[100px]"
                                />
                              </FormControl>
                              <FormDescription>
                                This will appear on the back of the flashcard.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name={`flashcards.${index}.hint`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hint (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter a hint (optional)"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              A hint to help remember the answer (optional).
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter className="p-0 mt-4">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove Flashcard
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </form>
            </Form>
          </CardContent>
        </Card>
        <div className="z-50 sticky bottom-4 flex justify-end pr-5 gap-4">
          <Button
            type="button"
            size="sm"
            onClick={() => append({ question: "", answer: "", hint: "" })}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Flashcard
          </Button>
          <Button
            type="submit"
            size="sm"
          >
            Save Flashcards
          </Button>
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel defaultSize={40}>
        <Card className="w-full mx-auto">
          <CardHeader className="flex flex-col gap-0 items-start">
            <CardTitle>Flashcards ( {flashcards.length} )</CardTitle>
            <p className="text-[.8rem] text-gray-500">
              Created on: {new Date().toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {flashcards.map((flashcard, index) => (
                <Card
                  key={index}
                  className="p-4"
                >
                  <CardHeader className="p-0 mb-2">
                    <CardTitle className="text-lg">
                      Flashcard {index + 1}
                    </CardTitle>
                    <CardDescription>
                      {formatDate(new Date(flashcard.createdAt))}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="text-sm">
                        <p>Question:</p>
                        <p className="border-b-2 border-spacing-1">
                          {flashcard.question}
                        </p>
                      </div>
                      <div className="text-sm">
                        <p>Answer:</p>
                        <p className="border-b-2 border-spacing-1">
                          {flashcard.answer}
                        </p>
                      </div>
                    </div>
                    {flashcard.hint && (
                      <div className="mt-2">
                        <p className="text-sm">Hint:</p>
                        <p className="border-b-2 border-spacing-1">
                          {flashcard.hint}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
          {/* <CardFooter>
            <Button>
              <Save className="w-4 h-4 mr-2" />
              Save Flashcards
            </Button>
          </CardFooter> */}
        </Card>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export default EditDeck;
