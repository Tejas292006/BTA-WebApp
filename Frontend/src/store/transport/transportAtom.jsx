import axios from "axios";
import { atom, selector } from "recoil";


export const transportDataState = atom({
    key : "transportsDataState",
    default : selector({
        key :  "transportSelector",
        get : async () => {
            const res = await axios.get(`${import.meta.env.VITE_SERVER || 'http://localhost:5001'}/api/transport/get-all-transport`);
            return res.data.transports
        }
    })
})