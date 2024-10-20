import { useState } from "react";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext"; // Import the useAuth hook

const formSchema = z.object({
  user_username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  user_email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  user_password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

function Signup() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_username: "",
      user_password: "",
      user_email: "",
    },
  });

  const navigate = useNavigate();
  const { signup } = useAuth(); // Use the signup function from AuthContext

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { user_username, user_email, user_password } = values;
    try {
      await signup(user_username, user_email, user_password);
      navigate("/"); // Redirect after successful signup
    } catch (error) {
      console.log("Signup failed:", error);
    }
  }

  return (
    <div className="bg-background flex items-center justify-center h-full w-full">
      <Button asChild className="fixed top-5 left-5">
        <Link to="/">
          <span><ArrowLeft size={15} /> </span>
          Back
        </Link>
      </Button>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="p-8 min-w-[300px] rounded-xl border bg-primary-foreground text-card-foreground shadow"
        >
          <h1 className="text-2xl font-bold text-center mb-5">Sign up</h1>

          <FormField
            control={form.control}
            name="user_username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="user_email"
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
            name="user_password"
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
            <Link to="/login">
              <Button variant={"outline"}>Log in</Button>
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default Signup;
