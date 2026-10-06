import { atom } from "recoil";

const getStoredUser = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token || token === "undefined" || token === "null") return null;
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const userAtom = atom({
  key: "userState",
  default: getStoredUser(),
});
