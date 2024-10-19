import useFlashcardStore from "@/store/useStore";
import Reels from "./_components/Reels/Reels";

function Flashcards() {
  // const { cards, redoCards } = useFlashcardStore();

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
  ]
  const redoCards: {
    question: string;
    answer: string;
    recalledForCount: number;
    id: number;
    hint: string;
    deckId: number;
    createdAt: string;
  }[] = []
  return (
    <Reels
      cards={cards}
      redoCards={redoCards}
    />
  );
}

export default Flashcards;
