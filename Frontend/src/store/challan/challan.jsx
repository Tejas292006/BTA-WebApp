import axios from "axios";
import { atom, selector } from "recoil";

export const challanDataState = atom({
  key: "challanDataState",
  default: selector({
    key: "challanAtomSelector",
    get: async () => {
      const res = await axios.get(`${import.meta.env.VITE_SERVER || 'http://localhost:5000'}/api/challan/get-all-challan`);
      return res.data.challans
    }
  })
})
