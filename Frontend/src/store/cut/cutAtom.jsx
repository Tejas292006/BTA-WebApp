import axios from "axios";
import { atom, selector } from "recoil";


export const cutDataState = atom({
    key : "cutsDataState",
    default : selector({
        key :  "cutSelector",
        get : async () => {
            const res = await axios.get(`${import.meta.env.VITE_SERVER || 'http://localhost:5001'}/api/cut/get-all-cut`);
            return res.data.cuts
        }
    })
})
