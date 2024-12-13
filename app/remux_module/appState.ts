import { getItem, removeItem, setItem } from "./localforage";
import { Epic, EpicState } from "./types";
import { authEpic } from "./auth";
import { getEpicLock } from "./mutex";

const epics = [authEpic] as const;

export type AppState = {
  [K in (typeof epics)[number]["key"]]: ReturnType<
    typeof getItem
  > extends Promise<infer T>
    ? T
    : never;
};

export const getAppState = async (
  epicKey?: (typeof epics)[number]["key"]
): Promise<Partial<AppState>> => {
  const state: Partial<AppState> = {};
  if (epicKey) {
    const epicState = await getItem(`${epicKey}State`);
    state[epicKey] =
      epicState ?? epics.find((e) => e.key === epicKey)?.initialState;
  } else {
    for (const epic of epics) {
      const epicState = await getItem(`${epic.key}State`);
      state[epic.key] = epicState ?? epic.initialState;
    }
  }

  return state;
};

export const appStateActions = epics.reduce((acc, epic) => {
  const epicActions = Object.entries(epic.actions).reduce(
    (epicAcc, [actionKey, actionFn]) => ({
      ...epicAcc,
      [`${epic.key}/${actionKey}`]: async (data: any) => {
        const lock = getEpicLock(epic.key);
        await lock.acquire();

        try {
          const currentState =
            (await getItem(`${epic.key}State`)) ?? epic.initialState;
          console.log("running action", actionKey);
          const updates = await actionFn(currentState, data);
          console.log("updates", updates);
          if (updates === null) {
            await removeItem(`${epic.key}State`);
          } else {
            await setItem(`${epic.key}State`, { ...currentState, ...updates });
          }
          return await getAppState();
        } catch (error) {
          console.error(error);
          return await getAppState();
        } finally {
          lock.release();
        }
      },
    }),
    {} as Record<string, (data: any) => Promise<AppState>>
  );
  return { ...acc, ...epicActions };
}, {} as Record<string, (data: any) => Promise<AppState>>);

export type AppStateAction = keyof typeof appStateActions;
