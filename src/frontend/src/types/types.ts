export type TClass = {
  id: number;
  name: string;
  icon?: string;
  deckCount: number;
  description: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
};

export type TUser = {
  id: number;
  username: string;
  email: string;
  password: string;
  salt: string;
  createdAt: string;
  // classes: TClass[];
  // decks: TDeck[];
};

export type TDeck = {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  cardCount: number;
  userOwner: TUser;
  // classes: TClass[];
  // cards: TCard[];
};

export type TCard = {
  id: number;
  answer: string;
  question: string;
  recalledForCount: number;
  hint: string;
  isRedo: boolean | null;
  createdAt: string;
  deck: TDeck;
};