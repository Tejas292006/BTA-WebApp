import axios from "axios";
import { atom, selector } from "recoil";


export const widthDataState = atom({
    key : "widthDataState",
    default : selector({
        key :  "widthSelector",
        get : async () => {
            const res = await axios.get(`${import.meta.env.VITE_SERVER || 'http://localhost:5000'}/api/width/get-all-width`);
            return res.data.widths
        }
    })
})