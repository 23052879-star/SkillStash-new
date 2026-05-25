import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  credits: number;
  customApiKey: string;
  addCredits: (amount: number) => void;
  deductCredit: () => boolean;
  setCustomApiKey: (key: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      credits: 2, // Starts with 2 free credits
      customApiKey: '',
      addCredits: (amount) => set((state) => ({ credits: state.credits + amount })),
      deductCredit: () => {
        const currentCredits = get().credits;
        if (currentCredits > 0) {
          set({ credits: currentCredits - 1 });
          return true;
        }
        return false;
      },
      setCustomApiKey: (key) => set({ customApiKey: key }),
    }),
    {
      name: 'resumesync-user-store',
    }
  )
);
