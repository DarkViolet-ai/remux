import localforage from "localforage";
import { localForageConfig } from "./config";

export const getItem = async <T>(key: string) => {
  localForageConfig();
  return await localforage.getItem<T>(key);
};

export const setItem = async <T>(key: string, value: T) => {
  localForageConfig();
  return await localforage.setItem<T>(key, value);
};

export const removeItem = async (key: string) => {
  localForageConfig();
  return await localforage.removeItem(key);
};

export const clear = async () => {
  localForageConfig();
  return await localforage.clear();
};
