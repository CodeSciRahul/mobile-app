import { create } from "zustand";
import { Group, Receiver } from "../types/index";

interface ReceiverType {
    receiver: Receiver | Group;
    selectionType?: "private" | "group" | null;
}

interface ReceiverState {
    receiver: ReceiverType | null;
    setReceiver: (receiver: ReceiverType) => void;
}

export const useReceiver = create<ReceiverState>((set) => ({
    receiver: null,
    setReceiver: (receiver: ReceiverType) => set({ receiver }),
}));