import axios from "axios";
import { atom, selector } from "recoil";


export const feeltypeDataState = atom({
    key : "feeltypeDataState",
    default : selector({
        key :  "feeltypeSelector",
        get : async () => {
            const res = await axios.get(`${import.meta.env.VITE_SERVER || 'http://localhost:5000'}/api/feeltype/get-all-feeltype`);
            return res.data.feeltypes
        }
    })
})