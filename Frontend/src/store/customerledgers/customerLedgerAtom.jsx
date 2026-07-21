import axios from "axios";
import { atom, selector } from "recoil";


export const customerledgerDataState = atom({
    key : "customerledgerDataState",
    default : selector({
        key :  "customerledgerSelector",
        get : async () => {
            const res = await axios.get(`${import.meta.env.VITE_SERVER || 'http://localhost:5001'}/api/customerledger/get-all-customerledgers`);
            return res.data.customerledgers
        }
    })
})