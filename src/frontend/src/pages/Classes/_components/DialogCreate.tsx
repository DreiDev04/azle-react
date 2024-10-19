import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
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
  class_name: z.string().min(3, {
    message: "Class name must be at least 3 characters.",
  }),
  class_description: z.string().min(3, {
    message: "Description must be at least 3 characters.",
  }),
});


const DialogCreate = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();
  const { classes, setClasses } = useStore();

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
      class_name: "",
      class_description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchemaCreteGroup>) {
    setLoading(true);
    const { class_name, class_description } = values;

    const url = `${import.meta.env.VITE_CANISTER_URL}/app/create_class`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          class_name: class_name,
          class_description: class_description,
          class_ownerId: user?.user_id,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        // TODO: add toast
        console.log("Class created successfully");
        closeDialog();
        setClasses([...classes, data.payload as TClass]);
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
        <Button variant="outline" onClick={openDialog}>
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Class</DialogTitle>
          <DialogDescription>
            Enter the details for the new class below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="class_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class Name</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="off" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="class_description"
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

export default DialogCreate;