import axios from "axios";
import { atom, selector } from "recoil";


export const paymentModeState = atom({
    key : "paymentModeState",
    default : selector({
        key :  "paymentSelector",
        get : async () => {
            const res = await axios.get(`${import.meta.env.VITE_SERVER || 'http://localhost:5000'}/api/paymentmode/get-all-paymentmode`);
            return res.data.paymentmodes
        }
    })
})