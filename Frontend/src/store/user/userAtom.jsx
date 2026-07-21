import { atom } from 'recoil';

export const userAtom = atom({
    key: 'userState', // Unique key for the atom
    default: null,
});

