import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Link, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { Zap, BookOpen, SmilePlus, PenTool, Scroll } from "lucide-react";

const FrontPage = () => {
  const { isAuthenticated } = useAuth(); 
  
  const [scrollPosition, setScrollPosition] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen ">
      <nav className="w-full py-4 flex gap-4 items-center px-8 bg-card">
        <div className="text-xl font-bold text-card-foreground">ScrollUp</div>
        <div className="space-x-4">
          {isAuthenticated ? (
            <>
              <Button
                variant={"default"}
                asChild
              >
                <Link to="/class">Home</Link>
              </Button>
            </>
          ) : (
            <>
              <Button
                variant={"outline"}
                asChild
              >
                <Link to="/signup">Sign Up</Link>
              </Button>
              <Button
                variant={"default"}
                asChild
              >
                <Link to="/login">Login</Link>
              </Button>

              {/* Dummy for testing */}
              {/* Delete AFTER */}
              <Button
                variant={"default"}
                asChild
              >
                <Link to="/class">Class</Link>
              </Button>
            </>
          )}
        </div>
      </nav>

      <section className="py-20 px-4">
        <div className=" mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-6xl font-black leading-none">
                Reinvent the Cycle. Scroll with Purpose.
              </h1>
              <p className="text-xl my-4 text-secondary-foreground leading-none">
                Scroll smart with ScrollUp.
              </p>
              <div className="flex space-x-4">
                <div className="flex space-x-4">
                  {isAuthenticated ? (
                    <Button
                      variant={"default"}
                      asChild
                    >
                      <Link to="/class">Go to Dashboard</Link>
                    </Button>
                  ) : (
                    <Button
                      variant={"default"}
                      asChild
                    >
                      <Link to="/signup">Get Started</Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <div className="absolute inset-0 bg-gray-200 rounded-xl transform rotate-3"></div>
                <img
                  src="https://placehold.co/600x400"
                  alt="ScrollUp App"
                  className="relative rounded-xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="flex-grow flex flex-col justify-center items-center text-center p-8 mb-10">
        <br />
        <br />
        <h1 className="text-5xl font-bold mb-4">
          No More Doomscrolling—It’s Time for Smart Scrolling!
        </h1>
        <p className="text-lg mb-6 max-w-3xl">
          We’ve all been trapped in doom scrolling. ScrollSmart helps you break
          free, curating meaningful content that inspires, educates, and
          empowers you every time you scroll.
        </p>
      </section>

      <section
        id="features"
        className="py-12 px-4 bg-accent"
      >
        <div className="mx-auto lg:mx-40">
          <h2 className="text-4xl text-center md:text-6xl font-black leading-none mb-6">
            Main Features
          </h2>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
            {[
                {
                  icon: <BookOpen className="h-10 w-10" />,
                  title: "Interactive Classes",
                  description: "Join classes filled with engaging decks of flashcards tailored to your subjects.",
                },
                // {
                //   icon: <PenTool className="h-10 w-10" />,
                //   title: "Create Your Own Flashcards",
                //   description: "Easily create and customize flashcards to enhance your learning experience.",
                // },
                {
                  icon: <SmilePlus className="h-10 w-10" />
                  ,
                  title: "Difficulty Feedback",
                  description: "Rate flashcards based on difficulty to personalize your learning journey.",
                },
                {
                  icon: <Scroll className="h-10 w-10" />,
                  title: "Scroll to Learn",
                  description: "Practice your flashcards in an engaging way by scrolling through your decks.",
                },
                {
                  icon: <Zap className="h-10 w-10" />,
                  title: "Positive Impact",
                  description: "Turn your scrolling habit into a source of growth and inspiration.",
                },
              ].map((feature, index) => (
              <div
                key={index}
                className="bg-card border-2 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="mb-4 text-card-foreground">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-card-foreground">
                  {feature.title}
                </h3>
                <p className="text-card-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-card text-card-foreground text-center py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl mb-4 max-w-3xl mx-auto">
            <span className="font-bold">Doom scrolling</span> wastes time,
            drains mental energy, and leaves us feeling overwhelmed.{" "}
            <span className="font-bold">It’s time for a change.</span>
          </h2>
          {/* <p className="text-lg mb-8">
            Join us today and never miss an event again.
          </p> */}
          {/* //TODO: Redundant kaya isip ka ng iba heehhehe */}
          {isAuthenticated ? (
            <Button
              variant={"default"}
              asChild
            >
              <Link to="/class">Go to Dashboard</Link>
            </Button>
          ) : (
            <Button
              variant={"default"}
              asChild
            >
              <Link to="/login">Login</Link>
            </Button>
          )}
          <div className="mt-12">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} ScrollUp. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FrontPage;
