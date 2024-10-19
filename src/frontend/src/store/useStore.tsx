import { TClass, TDeck } from '@/types/types';
import { create } from 'zustand';

type Store = {
  classes: TClass[];
  setClasses: (classes: TClass[]) => void;
  decks: TDeck[];
  setDecks: (deck: TDeck[]) => void;
  userDeck: TDeck[];
  setUserDeck: (deck: TDeck[]) => void;
}

const useStore = create<Store>((set) => ({
  classes: [],
  setClasses: (classes: TClass[]) => set({ classes }),
  decks: [],
  setDecks: (decks: TDeck[]) => set({ decks }),
  userDeck: [],
  setUserDeck: (userDeck: TDeck[]) => set({ userDeck }),
  
}));

export default useStore;