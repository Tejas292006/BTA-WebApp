import axios from "axios";
import { atom, selector } from "recoil";


export const attributeValueDataState = atom({
    key : "attributeValueData",
    default : selector({
        key :  "attributeValueSelector",
        get : async () => {
            const res = await axios.get(`${import.meta.env.VITE_SERVER || 'http://localhost:5000'}/api/attributeValue/get-all-attributeValue`);
            return res.data.attributeValues
        }
    })
})