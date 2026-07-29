import axios from "axios";
import { atom, selector } from "recoil";


export const supplierledgerDataState = atom({
    key : "supplierledgerDataState",
    default : selector({
        key :  "supplierledgerSelector",
        get : async () => {
            const res = await axios.get(`${import.meta.env.VITE_SERVER || 'http://localhost:5001'}/api/supplierledger/get-supplier-ledger`);
            return res.data.supplierLedgers
        }
    })
})