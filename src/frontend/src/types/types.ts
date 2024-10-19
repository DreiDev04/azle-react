export type TClass = {
  class_id: number;
  class_name: string;
  class_icon?: string;
  class_deckCount: number;
  class_description: string;
  class_createdAt: Date;
  // likes: number;
  // isLiked: boolean;
};

export type TUser = {
  user_id: number;
  user_username: string;
  user_email: string;
  user_password: string;
  user_salt: string;
  user_createdAt: string;
  // classes: TClass[];
  // decks: TDeck[];
};

export type TDeck = {
  deck_id: number;
  deck_name: string;
  deck_description: string | null;
  deck_createdAt: string;
  deck_cardCount: number;
  deck_userOwner: TUser;
  // classes: TClass[];
  // cards: TCard[];
};

export type TCard = {
  card_id: number;
  card_answer: string;
  card_question: string;
  card_recalledForCount: number;
  card_hint: string;
  card_isRedo: boolean | null;
  card_createdAt: string;
  card_deck: TDeck;
};