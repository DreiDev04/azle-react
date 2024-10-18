import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SetStateAction, useState } from "react";

interface AlertDialogProps {
  name: string;
  description: string;
  children: React.ReactNode;
}

function DialogEditDeck({ name, description, children }: AlertDialogProps) {
  const [className, setName] = useState(name);
  const [classDescription, setDescription] = useState(description);

  function handleChangeName(e: { target: { value: SetStateAction<string> } }) {
    setName(e.target.value);
  }

  function handleChangeDescription(e: {
    target: { value: SetStateAction<string> };
  }) {
    setDescription(e.target.value);
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Deck</AlertDialogTitle>
          <AlertDialogDescription>
            Make changes to your deck here. Click save when you're done.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="name"
              className="text-right"
            >
              Name
            </Label>
            <Input
              id="name"
              value={className}
              onChange={(e) => handleChangeName(e)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="username"
              className="text-right"
            >
              Description
            </Label>
            <Input
              id="description"
              value={classDescription}
              onChange={(e) => handleChangeDescription(e)}
              className="col-span-3"
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {/* //TODO: Add onClick handler, take func as props from Classes.tsx */}
          <AlertDialogAction type="submit">Save changes</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DialogEditDeck;
