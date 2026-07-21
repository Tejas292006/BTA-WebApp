import axios from "axios";
import { atom, selector } from "recoil";


export const designDataState = atom({
    key : "designDataState",
    default : selector({
        key :  "designSelector",
        get : async () => {
            const res = await axios.get(`${import.meta.env.VITE_SERVER || 'http://localhost:5000'}/api/design/get-all-design`);
            return res.data.designs
        }
    })
})