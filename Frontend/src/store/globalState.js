import { atom } from "recoil";

export const darkmodeAtom = atom({
  key: "darkmodeAtom",
  default: localStorage.getItem("darkmode") === "true",
});

export const globalLoaderAtom = atom({
  key: "globalLoaderAtom",
  default: false,
});
