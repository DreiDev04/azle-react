import { useState } from "react";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
// import { FormInputIcon } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

function Login() {
  const [greeting, setGreeting] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { email, password } = values;

    console.log(values);
  }

  return (
    <div className="flex items-center justify-center h-full w-full relative">
      {/* //TODO: Pakihanap nalang actual size */}
      <Button asChild className="fixed top-5 left-5">
        <Link to="/"> <span><ArrowLeft size={15}/> </span>Back</Link>
      </Button>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-background p-8 rounded-lg min-w-[300px] shadow-[0px_1px_3px_rgba(0,0,0,0.02),_0px_0px_0px_1.5px_rgba(27,31,35,0.15)]"
        >
          <h1 className="text-2xl font-bold font-mono text-center mb-5">
            Login
          </h1>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-end mt-5 justify-between">
            <Button
              className="font-bold"
              type="submit"
            >
              Submit
            </Button>
            <Link
              to="/signup"
              className="bg-secondary text-foreground"
            >
              <Button variant={"outline"}>Sign up</Button>
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default Login;
