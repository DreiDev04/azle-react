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
import { PlusCircle, Save, Trash2 } from "lucide-react";

const flashcardSchema = z.object({
  deck_name: z.string().min(1, "Deck name is required"),
  deck_description: z.string().min(1, "Deck description is required"),
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  hint: z.string().optional(),
});

const formSchema = z.object({
  flashcards: z
    .array(flashcardSchema)
    .min(1, "At least one flashcard is required"),
  deckName: z.string().min(1, "Deck name is required"),
  deckDescription: z.string().min(1, "Deck description is required"),

});

type FlashcardType = z.infer<typeof flashcardSchema> & { date: string };

export default function Create() {
  const [createdFlashcards, setCreatedFlashcards] = useState<FlashcardType[]>(
    []
  );
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      flashcards: [{ question: "", answer: "", hint: "" }],
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
    const { deckName, deckDescription } = values;

    const currentDate = formatDate(new Date());
    const newFlashcards = values.flashcards.map((flashcard) => ({
      ...flashcard,
      date: currentDate,
    }));
    setCreatedFlashcards(newFlashcards);
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
            <CardTitle>Create Tokki Deck</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="deckName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deck Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter the deck name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="deckDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deck Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter the deck description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />


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
                <div className="z-50 sticky bottom-4 flex justify-end pr-5 gap-4">
          <Button
            type="button"
            size="sm"
            onClick={() => append({ deck_name: "", deck_description: "", question: "", answer: "", hint: "" })}
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
              </form>
            </Form>
          </CardContent>
        </Card>
      </ResizablePanel>
      <ResizableHandle withHandle />

      <ResizablePanel defaultSize={25}>
        <Card className="w-full mx-auto">
          <CardHeader className="flex flex-col gap-0 items-start">
            <CardTitle>Flashcards ( {createdFlashcards.length} )</CardTitle>
            <p className="text-[.8rem] text-gray-500">
              Created on: {new Date().toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {createdFlashcards.map((flashcard, index) => (
                <Card
                  key={index}
                  className="p-4"
                >
                  <CardHeader className="p-0 mb-2">
                    <CardTitle className="text-lg">
                      Flashcard {index + 1}
                    </CardTitle>
                    <CardDescription>
                      Created on: {flashcard.date}
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
