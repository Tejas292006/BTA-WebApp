import axios from "axios";
import { atom, selector } from "recoil";

export const quickchallanDataState = atom({
  key: "quickchallanDataState",
  default: selector({
    key: "quickchallanAtomSelector",
    get: async () => {
      const res = await axios.get(`${import.meta.env.VITE_SERVER || 'http://localhost:5001'}/api/quickchallan/get-all-quickchallan`);
      return res.data.quickchallans
    }
  })
})
