import localforage from "localforage";

export function localForageConfig() {
  localforage.config({
    name: "learn-with-lumi",
    version: 1,
    storeName: "learn-with-lumi",
    description: "learn-with-lumi local database",
  });
}
