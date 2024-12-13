import { Epic } from "./types";

export type User = {
  id: string;
  name: string;
  email: string;
};

export interface AuthActions {
  setUser: User;
  clearUser: void;
}

export const authEpic: Epic<User | undefined, AuthActions> = {
  key: "auth",
  initialState: undefined,
  actions: {
    setUser: async (state, payload) => {
      return payload;
    },
    clearUser: async (state, payload) => {
      return null;
    },
  },
};
