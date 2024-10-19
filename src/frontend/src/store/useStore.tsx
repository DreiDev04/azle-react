import { TClass } from '@/types/types';
import { create } from 'zustand';

type Store = {
  classes: TClass[];
  setClasses: (classes: TClass[]) => void;
}

const useStore = create<Store>((set) => ({
  classes: [],
  setClasses: (classes: TClass[]) => set({ classes }),
}));

export default useStore;