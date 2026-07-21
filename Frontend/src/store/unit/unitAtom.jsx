import axios from "axios";
import { atom, selector } from "recoil";


export const unitDataState = atom({
    key : "unitsDataState",
    default : selector({
        key :  "unitSelector",
        get : async () => {
            const res = await axios.get(`${import.meta.env.VITE_SERVER || 'http://localhost:5000'}/api/unit/get-all-unit`);
            return res.data.units
        }
    })
})