import { create } from "zustand";

interface JobStore {
  // 검색 조건
  location: string; // 예: "서울시 광진구"
  employmentType: string; // 예: "CM0101"

  setLocation: (loc: string) => void;
  setEmploymentType: (type: string) => void;
  resetStore: () => void;
}

export const useJobStore = create<JobStore>((set) => ({
  location: "",
  employmentType: "",
  setLocation: (loc) => set({ location: loc }),
  setEmploymentType: (type) => set({ employmentType: type }),
  resetStore: () => set({ location: "", employmentType: "" }),
}));
