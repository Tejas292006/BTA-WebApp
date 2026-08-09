import { atom } from "recoil";

export const darkmodeAtom = atom({
  key: "darkmodeAtom",
  default: false,
});

export const globalLoaderAtom = atom({
  key: "globalLoaderAtom",
  default: false,
});
