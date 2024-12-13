export type EpicState = Record<string, any> | object | undefined;

export type EpicActions<T extends EpicState, A extends Record<string, any>> = {
  [K in keyof A]: (
    state: T,
    payload: A[K] extends void ? never : A[K]
  ) => Promise<Partial<T> | null>;
};

export interface Epic<T extends EpicState, A extends Record<string, any>> {
  key: string;
  initialState: T;
  actions: EpicActions<T, A>;
}
