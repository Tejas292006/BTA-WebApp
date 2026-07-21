import axios from "axios";
import { atom, selector } from "recoil";


export const weaveDataState = atom({
    key : "weaveDataState",
    default : selector({
        key :  "weaveSelector",
        get : async () => {
            const res = await axios.get(`${import.meta.env.VITE_SERVER || 'http://localhost:5001'}/api/weave/get-all-weave`);
            return res.data.weaves
        }
    })
})