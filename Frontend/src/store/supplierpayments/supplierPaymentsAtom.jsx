import axios from "axios";
import { atom, selector } from "recoil";


export const supplierpaymentDataState = atom({
    key : "supplierpaymentDataState",
    default : selector({
        key :  "supplierpaymentSelector",
        get : async () => {
            const res = await axios.get(`${import.meta.env.VITE_SERVER || 'http://localhost:5001'}/api/supplierpayment/get-all-supplierpayments`);
            return res.data.supplierpayments
        }
    })
})
