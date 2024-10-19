import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import useStore from '@/store/useStore';
import { TClass } from "@/types/types";



const formSchemaCreteGroup = z.object({
  deck_name: z.string().min(3, {
    message: "Class name must be at least 3 characters.",
  }),
  deck_description: z.string().min(3, {
    message: "Description must be at least 3 characters.",
  }),
});


const DialogAddDeck = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();
  const { decks, setDecks } = useStore();

  const navigate = useNavigate();
  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  const form = useForm<z.infer<typeof formSchemaCreteGroup>>({
    resolver: zodResolver(formSchemaCreteGroup),
    defaultValues: {
      deck_name: "",
      deck_description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchemaCreteGroup>) {
    setLoading(true);
    const { deck_name, deck_description } = values;

    const url = `${import.meta.env.VITE_CANISTER_URL}/app/create_deck`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deck_name: deck_name,
          deck_description: deck_description,
          class_ownerId: user?.user_id,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        // TODO: add toast
        console.log("Class created successfully");
        closeDialog();
        // setDeck([...deck, data.payload as TDeck]);
        // navigate(`/classes/${data.payload.class_id}`);
      } else {
        throw new Error(data.message || "Class creation failed");
      }
    } catch (error) {
      console.error(`Error: ${error}`);
      // TODO: add error toast or feedback to the user
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal>
      <DialogTrigger asChild>
        <Button variant="default" onClick={openDialog}>
          Add Deck
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Class</DialogTitle>
          <DialogDescription>
            Enter the details for the new deck below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="deck_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deck Name</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="off" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deck_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="off" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading}>Submit</Button>
          </form>
        </Form>
      </DialogContent>

    </Dialog>
  );
};

export default DialogAddDeck;